import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const registerUser = AsyncHandler(async (req, res) => {
  const { username, email, fullname, passowrd } = req.body;
  if ([].some((field) => field?.trim() == "")) {
    throw new ApiError(400, "All fields are required");
  }
});

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
}

return res
  .status(201)
  .json(ApiResponse(200, createdUser, " User created successfully"));

export { registerUser };
