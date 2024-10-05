import mongoose from "mongoose";

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
      type: String, // cloudinary URL
      required: true,
    },

    coverImage: {
      type: String, // cloudinary URL
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

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate access token
userSchema.methods.generateAccessToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
      email: this.email,
      username: this.username, // Changed from username to name
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  return token;
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
      email: this.email,
      username: this.username, // Changed from username to name
      fullname: this.fullname,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
  return token;
};

const User = mongoose.model("User", userSchema);

export default User;
