import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = generateAccessToken();
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
  if ([].some((field) => field?.trim() == "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }

  //handling avatar path from the multer

  const avatarLocalPath = req.files?.avatar[0]?.path;

  // handling cover image path from the multer
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover Image is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (coverImageLocalPath) {
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
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

    const createdUser = User.findById(user._id).select(
      "-password -__v",
      "-updatedAt",
      "-createdAt",
      "-refreshTokens"
    );

    if (!createdUser) {
      throw new ApiError(404, "User not found");
    } else {
      return res
        .status(201)
        .json(ApiResponse(200, createdUser, " User created successfully"));
    }
  } catch (error) {
    console.log(error);

    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }

    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
    }
  }
  throw new ApiError(500, "Internal Server Error");
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

  res.json(ApiResponse(200, { accessToken, refreshToken }, "Login successful"));
});

const refreshaccessToken = AsyncHandler(async (req, res) => {
  const incomingRefreshTokens =
    req.cookies.refreshTokens || req.body.refreshToken;

  if (!incomingRefreshTokens) {
    return res
      .status(401)
      .json(ApiResponse(401, null, "Refresh token is required"));
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshTokens,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      return res
        .status(404)
        .json(ApiResponse(404, null, "Invalid refresh Token"));

      if (incomingRefreshTokens !== user.refreshToken) {
        return res
          .status(401)
          .json(ApiResponse(401, null, "Invalid refresh Token"));
      }

      const options = {
        httpOnly: true,
      };
      const { accessToken, refreshToken: newRefreshToken } =
        await generateAccessAndRefreshToken(user._id);

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            { accessToken, refreshToken: newRefreshToken },
            "Access token refreshed Successfully"
          )
        );
    }
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while refreshing access tokens "
    );
  }
});

export {
  generateAccessAndRefreshToken,
  registerUser,
  loginUser,
  refreshaccessTokens,
};
