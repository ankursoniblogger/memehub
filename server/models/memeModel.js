// import mongoose from "mongoose";
// const memeSchema = new mongoose.Schema(
//   {
//     image: { type: String, required: true },
//     topText: String,
//     bottomText: String,
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     tags: [String],
//     comments: [
//       {
//         user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//         text: { type: String, maxlength: 140 },
//         createdAt: { type: Date, default: Date.now },
//       }
//     ],
//     votes: [
//       {
//         user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//         value: { type: Number, enum: [1, -1] },
//       }
//     ],
//   },
//   { timestamps: true }
// );


// export default mongoose.model("Meme", memeSchema);


import mongoose from "mongoose";

const memeSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    topText: { type: String },
    bottomText: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    
    views: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    tags: [String],
    isDraft: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Meme", memeSchema);
