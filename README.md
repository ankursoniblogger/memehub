# 😂 MemeHub - Full Stack Meme Sharing Platform

MemeHub is a full-stack web application where users can upload memes, vote, comment, explore trending content, and track meme performance.

🔗 **Live Link:** Coming soon  
📂 **Backend:** Node.js + Express + MongoDB  
🎨 **Frontend:** HTML, CSS (React version coming soon)

---

## 🚀 Features

- ✅ User Registration & Login (JWT Auth)
- ✅ Meme Upload Studio (Top/Bottom text, image)
- ✅ Voting System (Upvote/Downvote)
- ✅ Commenting on Memes
- ✅ Meme Feed with Sorting & Search
- ✅ Trending Tags & Filtering
- ✅ Meme Performance Analytics (Views, Stats)
- ✅ User Dashboard (My Memes, Edit/Delete)
- ✅ Leaderboards (Meme of the Day, Top Users, Badges)

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT
- **Frontend (Basic):** HTML, CSS, JavaScript
- **Tools:** Postman, Git, GitHub

---

## 📮 API Endpoints Summary

### 🔐 Authentication
- `POST /api/register` → Register a new user  
- `POST /api/login` → Login and get JWT token  

### 🖼 Meme Management
- `POST /api/memes` → Upload a new meme  
- `PUT /api/memes/:id` → Edit meme  
- `DELETE /api/memes/:id` → Delete meme  

### 🔼 Voting & Commenting
- `POST /api/memes/:id/vote` → Upvote or downvote  
- `POST /api/memes/:id/comment` → Add comment  

### 📈 Feed & Search
- `GET /api/memes?sort=new&page=1`  
- `GET /api/memes?sort=top_week&search=bug&page=1`  
- `GET /api/memes?tag=relatable`  
- `GET /api/memes/tags/trending`

### 📊 Analytics
- `GET /api/memes/:id/view` → Increase view count  
- `GET /api/memes/my-memes` → User’s meme stats  

### 🏆 Leaderboard
- `GET /api/leaderboard/meme-of-the-day`  
- `GET /api/leaderboard/weekly-leaderboard`

---

## 📦 Example API Usage (Postman)

### Register

```json
POST /api/register
{
  "username": "meme_lord",
  "email": "meme@hub.com",
  "password": "123456"
}
