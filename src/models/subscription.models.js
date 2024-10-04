import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema(
  {
    id: String,

    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
