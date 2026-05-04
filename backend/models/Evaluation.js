

const mongoose = require("mongoose");

const EvaluationSchema = new mongoose.Schema(
  {
    // The full GitHub URL that was submitted
    repoUrl: {
      type: String,
      required: [true, "Repo URL is required"],
      trim: true,
    },

    // Extracted owner and repo name from the URL
    owner: {
      type: String,
      required: true,
    },
    repoName: {
      type: String,
      required: true,
    },

    // Static analysis metadata
    staticAnalysis: {
      totalFiles: { type: Number, default: 0 },
      analyzedFiles: { type: Number, default: 0 },
      fileTypes: { type: Object, default: {} }, 
      hasReadme: { type: Boolean, default: false },
      hasPackageJson: { type: Boolean, default: false },
      hasGitignore: { type: Boolean, default: false },
    },

    // AI-generated insights
    aiInsights: {
      issues: { type: [String], default: [] },
      suggestions: { type: [String], default: [] },
      aiScore: { type: Number, default: 0 }, // 0–10
    },

    // Final combined score (0–10)
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    // Status lets the frontend poll for async results (future use)
    status: {
      type: String,
      enum: ["pending", "complete", "error"],
      default: "complete",
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

module.exports = mongoose.model("Evaluation", EvaluationSchema);
