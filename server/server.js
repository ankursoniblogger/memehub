import express from "express";
import dotenv from "dotenv";
dotenv.config();


console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import memeRoutes from "./routes/memeRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";

connectDB();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/memes", memeRoutes);
app.use("/api/leaderboard", leaderboardRoutes);


// ROUTES PLACEHOLDER
app.get("/", (req, res) => {
  res.send("MemeHub API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
