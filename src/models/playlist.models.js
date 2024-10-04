import mongoose from "mongoose";

const playlistSchema = mongoose.Schema(
  {
    id: String,

    name: {
      type: String,
      unique: true,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    videos: {
      type: mongoose.Schema.ObjectId,
      ref: "Video",
    },

    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Playlist = mongoose.model("Playlist", playlistSchema);
