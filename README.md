# 🚀 RepoScore — GitHub Repository Evaluation System

RepoScore is a full-stack web application that analyzes GitHub repositories and generates a structured **quality score** based on code organization, documentation, and best practices.

It helps developers quickly assess the health of a repository and receive actionable improvement suggestions.

---

## 🌐 Live Demo

* Frontend: https://repo-score.vercel.app/
* Backend API: https://repo-score.onrender.com

---

## 📌 Features

* 🔍 Analyze any public GitHub repository
* 📊 Generate a **quality score (0–100)**
* ⚠️ Identify issues (missing README, poor structure, etc.)
* 💡 Provide actionable suggestions for improvement
* 🕘 Store and view past analysis history
* ⚡ Real-time evaluation via API integration

---

## 🧠 How It Works

1. User submits a GitHub repository URL
2. Backend fetches repository metadata
3. Static analysis is performed using predefined rules:

   * README presence & quality
   * Folder structure
   * Project organization
4. A weighted scoring system calculates the final score
5. Results are returned as structured JSON:

   * Score
   * Issues
   * Suggestions

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* Axios
* CSS / UI components

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Deployment

* Frontend: Vercel
* Backend: Render

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/repo-score.git
cd repo-score
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=8000
MONGO_URI=your_mongodb_connection
```

Run backend:

```bash
npm start
```

---

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:8000
```

Run frontend:

```bash
npm run dev
```

---

## 🔌 API Endpoints

### Analyze Repository

```http
POST /api/analyze
```

**Request:**

```json
{
  "repoUrl": "https://github.com/user/repo"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "score": 78,
    "issues": ["No README", "No tests"],
    "suggestions": ["Add documentation", "Improve structure"]
  }
}
```

---

### Get History

```http
GET /api/analyze/history
```

---

## 📂 Project Structure

```
repo-score/
├── backend/
│   ├── routes/
│   ├── config/
│   ├── models/
│   └── server.js
│
├── frontend/
│   ├── src/
│   └── components/
│
└── README.md
```

---

## 🚀 Future Improvements

* 🔗 GitHub API integration for deeper insights
* 📈 Advanced scoring metrics (test coverage, commits, contributors)
* 🤖 AI-based code quality analysis
* 📊 Visualization dashboard for scores

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

Ashutosh Kushwaha

