import mongoose from "mongoose";

const tweetSchema = mongoose.Schema(
  {
    id: String,

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    tweet: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Tweet = mongoose.model("Tweet", tweetSchema);

export default Tweet;
