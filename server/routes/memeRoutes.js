import express from "express";
import { createMeme, getMemes , getTrendingTags } from "../controllers/memeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { voteMeme, commentMeme ,viewMeme  } from "../controllers/memeController.js";
import { getMyMemes } from "../controllers/memeController.js";
import { editMeme, deleteMeme } from "../controllers/memeController.js";


const router = express.Router();

// Protected meme creation route
router.post("/", protect, createMeme);

// Public route to fetch memes
router.get("/", getMemes);
router.get("/tags/trending", getTrendingTags);


router.post("/:id/vote", protect, voteMeme);

// Commenting
router.post("/:id/comment", protect, commentMeme);

// view route 
router.get("/:id/view", viewMeme);

// get all mems 
router.get("/my-memes", protect, getMyMemes);


router.put("/:id", protect, editMeme);
router.delete("/:id", protect, deleteMeme);

export default router;
