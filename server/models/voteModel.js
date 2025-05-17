import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    meme: { type: mongoose.Schema.Types.ObjectId, ref: "Meme", required: true },
    type: {
      type: String,
      enum: ["upvote", "downvote"],
      required: true,
    },
  },
  { timestamps: true }
);

voteSchema.index({ user: 1, meme: 1 }, { unique: true }); // 👈 Prevents duplicate votes

export default mongoose.model("Vote", voteSchema);