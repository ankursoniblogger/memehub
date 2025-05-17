import express from "express";
import { memeOfTheDay, weeklyLeaderboard } from "../controllers/leaderboardController.js";

const router = express.Router();

router.get("/meme-of-the-day", memeOfTheDay);
router.get("/weekly-leaderboard", weeklyLeaderboard);

export default router;
