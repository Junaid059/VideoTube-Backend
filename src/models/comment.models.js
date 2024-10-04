import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    id: String,

    content: {
      type: String,
      required: true,
    },

    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },

    tweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
