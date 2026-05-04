
import axios from "axios";

// Use env variable in production, fallback to proxy in dev
const API_BASE = import.meta.env.VITE_API_URL || "/api";

export const analyzeRepo = async (repoUrl) => {
  try {
    const response = await axios.post(`${API_BASE}/api/analyze`, { repoUrl });
    return response.data.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to evaluate repository. Please try again.";
    throw new Error(message);
  }
};

export const getHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE}/api/analyze/history`);
    return response.data.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch history.";
    throw new Error(message);
  }
};