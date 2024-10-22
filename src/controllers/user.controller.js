import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; // Ensure bcrypt is imported for password comparison

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = generateAccessToken(); // Assuming these functions exist
    const refreshToken = generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error ", error);
    throw new ApiError(400, "Couldn't generate access and refresh tokens");
  }
};

const registerUser = AsyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;

  if ([username, email, fullname, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }

  // Handling avatar and cover image paths from multer
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover Image is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  let coverImage;

  if (coverImageLocalPath) {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
  }

  try {
    const user = await User.create({
      username: username.toLowerCase(),
      email,
      fullname,
      password,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
    });

    const createdUser = await User.findById(user._id).select(
      "-password -__v -updatedAt -createdAt -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(201)
      .json(ApiResponse(201, createdUser, "User created successfully"));
  } catch (error) {
    console.log(error);

    // Rollback cloudinary uploads in case of error
    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }
    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
    }

    throw new ApiError(500, "Internal Server Error");
  }
});

const loginUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json(ApiResponse(400, null, "Email and password are required"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json(ApiResponse(404, null, "User not found"));
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new ApiError(401, "Password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  return res.json(
    ApiResponse(200, { accessToken, refreshToken }, "Login successful")
  );
});

const logOutUser = AsyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
  };

  res.clearCookie("refreshToken", options);
  res.clearCookie("accessToken", options);

  return res.json(ApiResponse(200, null, "Logged out successfully"));
});

const refreshAccessToken = AsyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res
      .status(401)
      .json(ApiResponse(401, null, "Refresh token is required"));
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return res.status(404).json(ApiResponse(404, null, "User not found"));
    }

    if (incomingRefreshToken !== user.refreshToken) {
      return res
        .status(401)
        .json(ApiResponse(401, null, "Invalid refresh token"));
    }

    const options = {
      httpOnly: true,
    };
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while refreshing access tokens"
    );
  }
});

const changeCurrentPassword = AsyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  const isPasswordValid = await User.isValidPassword(oldPassword);

  if (!isPasswordValid) {
    return res.status(400).json(ApiResponse(400, null, "Invalid old password"));
  }

  await User.save({ validateBeforeSave: false });
});

const getCurrentUser = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  return res.status(200).json(ApiResponse(200, user, "User found"));
});

const updateAccountDetails = AsyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!fullname || !email) {
    return res.status(400).json(ApiResponse("full name and email is required"));
  }

  const user = await User.findByIdAndUpdate(
    req.body._id,
    {
      $set: {
        fullname,
        email: email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res.status(200).json(ApiResponse(user, " Account updated"));
});

const updateUserAvatar = AsyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "something went wrong while uploading file");
  }

  const user = await User.findByIdAndUpdate(
    req.body._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res.status(200).json(200, "Avatar updated successfully");
});

const updateUserCoverImage = AsyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "file is required");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (coverImage.url) {
    throw new ApiError("something went wrong while uploading file");
  }

  await User.findByIdAndUpdate(
    req.body._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res.status(200).json(ApiResponse(200, " Image updated successfully"));
});

const getUserChannelProfile = AsyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, "username is required");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.lowerCase(),
      },
    },

    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscriberedTo",
      },
    },
    {
      $addFiels: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscriberdTo",
        },
        isSubscribed: {
          $cond: {
            if: {
              $in: [req.user._id, "$subscribers.subscriber"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        avatar: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, " channel not found ");
  }

  return res
    .status(200)
    .json(ApiResponse(200, " Channel profile fetched successfully"));
});

const getWatchHistory = AsyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "Videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    fullname: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  if (!user || user.length === 0) {
    return res.status(404).json(ApiResponse(404, "User not found"));
  }

  return res
    .status(200)
    .json(
      ApiResponse(
        200,
        user[0]?.watchHistory,
        "Watch history fetched successfully"
      )
    );
});

export {
  generateAccessAndRefreshToken,
  registerUser,
  loginUser,
  refreshAccessToken,
  logOutUser,
  updateUserAvatar,
  updateUserCoverImage,
  updateAccountDetails,
  getCurrentUser,
  changeCurrentPassword,
  getWatchHistory,
  getUserChannelProfile,
};
