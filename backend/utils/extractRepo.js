// utils/extractRepo.js
// ─────────────────────────────────────────────────
// Utility to parse a GitHub URL and extract the
// owner and repository name.
// ─────────────────────────────────────────────────

/**
 * extractOwnerAndRepo
 * Accepts any of these formats:
 *   https://github.com/owner/repo
 *   https://github.com/owner/repo.git
 *   https://github.com/owner/repo/tree/main
 *   github.com/owner/repo
 *
 * @param {string} repoUrl — raw URL input from the user
 * @returns {{ owner: string, repo: string }}
 * @throws {Error} if the URL is not a valid GitHub URL
 */
const extractOwnerAndRepo = (repoUrl) => {
  if (!repoUrl || typeof repoUrl !== "string") {
    throw new Error("Repository URL must be a non-empty string.");
  }

  // Normalise: strip protocol, www., trailing slashes, and .git suffix
  let cleaned = repoUrl
    .trim()
    .replace(/^https?:\/\//, "")  // remove http(s)://
    .replace(/^www\./, "")         // remove www.
    .replace(/\.git$/, "")         // remove .git suffix
    .replace(/\/$/, "");           // remove trailing slash

  // Split path into segments; first is the host, second is owner, third is repo
  const parts = cleaned.split("/");

  // parts[0] should be "github.com"
  if (!parts[0].includes("github.com")) {
    throw new Error("Only GitHub URLs are supported (e.g. https://github.com/owner/repo).");
  }

  const owner = parts[1];
  const repo = parts[2]; // ignore anything after (branches, paths etc.)

  if (!owner || !repo) {
    throw new Error(
      "Could not extract owner and repo from URL. " +
      "Expected format: https://github.com/owner/repo"
    );
  }

  return { owner, repo };
};

module.exports = { extractOwnerAndRepo };
