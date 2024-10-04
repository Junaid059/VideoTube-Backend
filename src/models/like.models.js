import mongoose from "mongoose";

const likeSchema = mongoose.Schema(
  {
    id: String,

    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },

    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },

    tweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },

    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.model("Like", likeSchema);

export default Like;
