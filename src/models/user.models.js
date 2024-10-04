import mongoose, { mongo } from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    fullname: {
      type: String,
      required: true,
    },

    avatar: {
      type: String, //cloudinary url
      required: true,
    },

    coverImage: {
      type: String, //cloudinary url
    },

    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    password: {
      type: String,
      required: [true, "Password is required"],
      unique: true,
    },

    refreshTokens: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
