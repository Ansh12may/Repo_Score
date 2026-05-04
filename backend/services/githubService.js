
const axios = require("axios");

// Build request headers — include token if provided
const buildHeaders = () => {
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User_Agent" :"Ai_project_evaluator"
  };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
};

/**
 * fetchRepoContents
 * Fetches the flat list of all files in a repository
 * using the Git Trees API (recursive=1 gives the full tree).
 *
 * @param {string} owner
 * @param {string} repo
 * @returns {Array} — array of tree items { path, type, size, url }
 */
const fetchRepoContents = async (owner, repo) => {
  try {
    // Step 1: Get the default branch info from the repo endpoint
    const repoInfoUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const repoInfoRes = await axios.get(repoInfoUrl, { headers: buildHeaders() });

    const defaultBranch = repoInfoRes.data.default_branch || "main";

    // Step 2: Fetch the full recursive tree of the default branch
    const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`;
    const treeRes = await axios.get(treeUrl, { headers: buildHeaders() });

    // Filter out directory entries — keep only blob (file) entries
    const files = treeRes.data.tree.filter((item) => item.type === "blob");

    return files; // [{ path, mode, type, sha, size, url }]
  } catch (error) {
    // Translate common GitHub API errors into friendly messages
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        throw new Error(`Repository "${owner}/${repo}" not found. Check the URL and that it is public.`);
      }
      if (status === 403) {
        throw new Error("GitHub API rate limit exceeded. Add a GITHUB_TOKEN to your .env to increase the limit.");
      }
      if (status === 409) {
        throw new Error(`Repository "${owner}/${repo}" is empty.`);
      }
    }
    throw new Error(`Failed to fetch repository: ${error.message}`);
  }
};

/**
 * fetchFileContent
 * Fetches the raw text content of a single file.
 * Uses the raw.githubusercontent.com endpoint for simplicity.
 *
 * @param {string} owner
 * @param {string} repo
 * @param {string} filePath — relative path inside the repo
 * @returns {string} file content as a string
 */
const fetchFileContent = async (owner, repo, filePath) => {
  try {
    // raw.githubusercontent.com serves files directly without base64 encoding
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${filePath}`;
    const res = await axios.get(url, {
      headers: buildHeaders(),
      // Treat all responses as text regardless of content-type
      responseType: "text",
      // Cap at 200 KB per file to avoid huge uploads to the AI
      maxContentLength: 200 * 1024,
    });
    return res.data;
  } catch (error) {
    // Non-fatal: return an empty string and log a warning
    console.warn(` Could not fetch content for ${filePath}: ${error.message}`);
    return "";
  }
};

module.exports = { fetchRepoContents, fetchFileContent };
