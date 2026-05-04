// src/api/analyze.js
// ─────────────────────────────────────────────────
// Thin API client for communicating with the backend.
// All HTTP calls are centralised here — no fetch/axios
// calls scattered across components.
// ─────────────────────────────────────────────────

import axios from "axios";

// Base URL — Vite's proxy forwards /api/* to localhost:5000
// In production, replace with your deployed backend URL.
const API_BASE = "/api";

/**
 * analyzeRepo
 * Sends a GitHub repo URL to the backend for evaluation.
 *
 * @param {string} repoUrl — full GitHub URL
 * @returns {Object} data — { score, issues, suggestions, staticAnalysis, … }
 * @throws {Error} with a user-friendly message on failure
 */
export const analyzeRepo = async (repoUrl) => {
  try {
    const response = await axios.post(`${API_BASE}/analyze`, { repoUrl });
    // Backend wraps the payload in { success: true, data: { … } }
    return response.data.data;
  } catch (error) {
    // Extract the most useful error message available
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to evaluate repository. Please try again.";
    throw new Error(message);
  }
};

/**
 * getHistory
 * Fetches the last 20 evaluations from the database.
 *
 * @returns {Array} list of past evaluations
 */
export const getHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE}/analyze/history`);
    return response.data.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch history.";
    throw new Error(message);
  }
};
