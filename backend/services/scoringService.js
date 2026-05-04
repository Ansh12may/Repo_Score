

/**
 * computeStaticScore
 * Awards points for good project hygiene.
 *
 * @param {Object} staticAnalysis — result from analysisService.runStaticAnalysis
 * @returns {number} score 0–10
 */
const computeStaticScore = (staticAnalysis) => {
  let points = 0;
  const max   = 10;

  // +2 for having a README (critical for discoverability)
  if (staticAnalysis.hasReadme)      points += 2;

  // +2 for having a package.json / dependency manifest
  if (staticAnalysis.hasPackageJson) points += 2;

  // +1 for having a .gitignore
  if (staticAnalysis.hasGitignore)   points += 1;

  // +1 for having a Dockerfile (shows deployment awareness)
  if (staticAnalysis.hasDockerFile)  points += 1;

  // +1 for having CI/CD config
  if (staticAnalysis.hasCIConfig)    points += 1;

  // +1 for having at least some code files
  if (staticAnalysis.totalFiles > 0) points += 1;

  // +1 for a reasonably sized project (5+ files shows substance)
  if (staticAnalysis.totalFiles >= 5) points += 1;

  // +1 for a multi-language or complex project (10+ files)
  if (staticAnalysis.totalFiles >= 10) points += 1;

  // Clamp to [0, max]
  return Math.min(max, points);
};

/**
 * computeFinalScore
 * Blends the static and AI scores using a weighted average.
 *
 * @param {Object} staticAnalysis — from analysisService
 * @param {number} aiScore        — from aiService (0–10)
 * @returns {number} finalScore rounded to 1 decimal place
 */
const computeFinalScore = (staticAnalysis, aiScore) => {
  const staticScore = computeStaticScore(staticAnalysis);

  // Weighted blend: 40% static hygiene + 60% AI code quality
  const raw = staticScore * 0.4 + aiScore * 0.6;

  // Round to 1 decimal and clamp to [0, 10]
  return Math.min(10, Math.max(0, Math.round(raw * 10) / 10));
};

module.exports = { computeStaticScore, computeFinalScore };
