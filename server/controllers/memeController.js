import Meme from "../models/memeModel.js";
import Comment from "../models/commentModel.js";
import Vote from "../models/voteModel.js";

// Create a new meme
export const createMeme = async (req, res) => {
  const { imageUrl, topText, bottomText, isDraft } = req.body;
  const userId = req.user.id; // from auth middleware

  try {
    const meme = await Meme.create({
      imageUrl,
      topText,
      bottomText,
      isDraft,
      createdBy: userId,
    });

    res.status(201).json(meme);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};










// Get all memes

export const getMemes = async (req, res) => {
  const { sort = "new", search = "", tag = "", page = 1, limit = 10 } = req.query;

  const query = {};

  // 🔍 Search by caption
  if (search) {
    query.$or = [
      { topText: { $regex: search, $options: "i" } },
      { bottomText: { $regex: search, $options: "i" } },
    ];
  }

  // 🎯 Filter by tag
  if (tag) {
    query.tags = tag;
  }

  const skip = (page - 1) * limit;

  // 🔃 Sort logic
  let sortOption = { createdAt: -1 };
  const now = new Date();

  if (sort === "top_day") {
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    query.createdAt = { $gte: dayAgo };
  } else if (sort === "top_week") {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    query.createdAt = { $gte: weekAgo };
  }

  if (sort.startsWith("top")) {
    sortOption = { netVotes: -1 };
  }

  try {
    const memes = await Meme.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "votes",
          localField: "_id",
          foreignField: "meme",
          as: "votes",
        },
      },
      {
        $addFields: {
          upvotes: {
            $size: {
              $filter: {
                input: "$votes",
                as: "v",
                cond: { $eq: ["$$v.type", "upvote"] },
              },
            },
          },
          downvotes: {
            $size: {
              $filter: {
                input: "$votes",
                as: "v",
                cond: { $eq: ["$$v.type", "downvote"] },
              },
            },
          },
          netVotes: {
            $subtract: [
              {
                $size: {
                  $filter: {
                    input: "$votes",
                    as: "v",
                    cond: { $eq: ["$$v.type", "upvote"] },
                  },
                },
              },
              {
                $size: {
                  $filter: {
                    input: "$votes",
                    as: "v",
                    cond: { $eq: ["$$v.type", "downvote"] },
                  },
                },
              },
            ],
          },
        },
      },
      { $sort: sortOption },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ]);

    res.json(memes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Trending Tags API

export const getTrendingTags = async (req, res) => {
  try {
    const tags = await Meme.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json(tags);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};















// PATCH /api/memes/:id/vote
export const voteMeme = async (req, res) => {
  const memeId = req.params.id;
  const { voteType } = req.body; // "upvote" or "downvote"
  const userId = req.user._id;

  try {
    const meme = await Meme.findById(memeId);
    if (!meme) return res.status(404).json({ msg: "Meme not found" });

    const existingVote = await Vote.findOne({ meme: memeId, user: userId });

    if (existingVote) {
      if (existingVote.type === voteType) {
        return res.status(400).json({ msg: "You already voted this way" });
      } else {
        // change vote type
        existingVote.type = voteType;
        await existingVote.save();
        return res.json({ msg: "Vote updated" });
      }
    }

    await Vote.create({ meme: memeId, user: userId, type: voteType });

    return res.status(201).json({ msg: "Vote recorded" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



// POST /api/memes/:id/comment
export const commentMeme =  async (req, res) => {
  const { text } = req.body;
  const memeId = req.params.id;

  try {
    const comment = await Comment.create({
      text,
      meme: memeId,
      user: req.user._id,
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



// Increment View Count


export const viewMeme = async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (!meme) return res.status(404).json({ msg: "Meme not found" });

    meme.views += 1;
    await meme.save();

    res.json(meme);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};




// view all memes they have created

export const getMyMemes = async (req, res) => {
  try {
    const memes = await Meme.find({ user: req.user._id }).sort({ createdAt: -1 });

    const memeStats = await Promise.all(
      memes.map(async (meme) => {
        const upvotes = await Vote.countDocuments({ meme: meme._id, type: "upvote" });
        const downvotes = await Vote.countDocuments({ meme: meme._id, type: "downvote" });
        const comments = await Comment.countDocuments({ meme: meme._id });

        return {
          ...meme.toObject(),
          stats: {
            views: meme.views,
            upvotes,
            downvotes,
            comments,
            netVotes: upvotes - downvotes,
          },
        };
      })
    );

    res.json(memeStats);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};





// Edit meme
export const editMeme = async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (!meme) return res.status(404).json({ msg: "Meme not found" });
    if (meme.user.toString() !== req.user._id.toString())
      return res.status(403).json({ msg: "Unauthorized" });

    const { topText, bottomText, tags, isDraft } = req.body;
    if (topText !== undefined) meme.topText = topText;
    if (bottomText !== undefined) meme.bottomText = bottomText;
    if (tags !== undefined) meme.tags = tags;
    if (isDraft !== undefined) meme.isDraft = isDraft;

    await meme.save();
    res.json({ msg: "Meme updated", meme });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete meme
export const deleteMeme = async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (!meme) return res.status(404).json({ msg: "Meme not found" });
    if (meme.user.toString() !== req.user._id.toString())
      return res.status(403).json({ msg: "Unauthorized" });

    await meme.deleteOne();
    res.json({ msg: "Meme deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
