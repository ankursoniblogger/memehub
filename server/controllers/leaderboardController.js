import Meme from "../models/memeModel.js";
import Vote from "../models/voteModel.js";
import mongoose from "mongoose";

export const memeOfTheDay = async (req, res) => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const memes = await Meme.find({ createdAt: { $gte: oneDayAgo } });

    const memesWithVotes = await Promise.all(
      memes.map(async (meme) => {
        const upvotes = await Vote.countDocuments({ meme: meme._id, type: "upvote" });
        const downvotes = await Vote.countDocuments({ meme: meme._id, type: "downvote" });
        return {
          meme,
          netVotes: upvotes - downvotes,
        };
      })
    );

    const topMeme = memesWithVotes.sort((a, b) => b.netVotes - a.netVotes)[0];

    if (!topMeme) return res.json({ msg: "No memes found in last 24 hours" });

    res.json(topMeme);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


export const weeklyLeaderboard = async (req, res) => {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const memes = await Meme.find({ createdAt: { $gte: oneWeekAgo } });

    const leaderboardMap = {};

    for (const meme of memes) {
      const upvotes = await Vote.countDocuments({ meme: meme._id, type: "upvote" });
      const downvotes = await Vote.countDocuments({ meme: meme._id, type: "downvote" });
      const netVotes = upvotes - downvotes;

      if (!leaderboardMap[meme.user]) leaderboardMap[meme.user] = 0;
      leaderboardMap[meme.user] += netVotes;
    }

    const leaderboard = await Promise.all(
      Object.entries(leaderboardMap).map(async ([userId, score]) => {
        const user = await User.findById(userId).select("username email");
        return { user, score };
      })
    );

    const sorted = leaderboard.sort((a, b) => b.score - a.score);

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};