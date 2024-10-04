import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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

commentSchema.plugin(mongooseAggregatePaginate);
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
