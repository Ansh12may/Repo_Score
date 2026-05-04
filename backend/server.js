
require("dotenv").config();

const express    = require("express");
const cors       = require("cors");
const connectDB  = require("./config/db");

const app  = express();
const PORT = process.env.PORT || 8080;

// ── Connect to MongoDB ────────────────────────────
connectDB();


app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form bodies (just in case)
app.use(express.urlencoded({ extended: false }));

// ── Routes ────────────────────────────────────────
const analyzeRouter = require("./routes/analyze");

app.use("/api/analyze", analyzeRouter);

// Health-check endpoint — useful for load balancers / uptime monitors
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// Global error handler — catches errors passed via next(err)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ success: false, message: "Internal server error." });
});

// ── Start Server ──────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log(` Analyze:      POST http://localhost:${PORT}/api/analyze`);
});
