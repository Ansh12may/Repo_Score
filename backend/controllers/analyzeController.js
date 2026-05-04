
const { extractOwnerAndRepo }          = require("../utils/extractRepo");
const { fetchRepoContents }            = require("../services/githubService");
const { runStaticAnalysis, selectFilesForAI } = require("../services/analysisService");
const { getAIInsights }                = require("../services/aiService");
const { computeFinalScore }            = require("../services/scoringService");
const Evaluation                       = require("../models/Evaluation");

const analyzeRepo = async (req, res) => {
  const { repoUrl } = req.body;

  //  1. Input validation 
  if (!repoUrl || typeof repoUrl !== "string" || repoUrl.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "repoUrl is required and must be a non-empty string.",
    });
  }

  let owner, repo;

  try {
    ({ owner, repo } = extractOwnerAndRepo(repoUrl));
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  try {
    // 2. Fetch repository file tree from GitHub ─
    console.log(`Fetching repository: ${owner}/${repo}`);
    const allFiles = await fetchRepoContents(owner, repo);

    // 3. Static analysis 
    console.log(` Running static analysis on ${allFiles.length} files...`);
    const staticAnalysis = runStaticAnalysis(allFiles);

    //  4. Select files and get AI insights 
    console.log(` Selecting files for AI review...`);
    const selectedFiles = await selectFilesForAI(allFiles, owner, repo, 5);

    console.log(`Getting AI insights for ${selectedFiles.length} files...`);
    const aiInsights = await getAIInsights(selectedFiles);

    // 5. Compute final combined score
    const finalScore = computeFinalScore(staticAnalysis, aiInsights.aiScore);
    console.log(`Final score: ${finalScore}/10`);

    //  6. Persist to MongoDB 
    const evaluation = new Evaluation({
      repoUrl:   repoUrl.trim(),
      owner,
      repoName:  repo,
      staticAnalysis: {
        totalFiles:     staticAnalysis.totalFiles,
        analyzedFiles:  selectedFiles.length,
        fileTypes:      staticAnalysis.fileTypes,
        hasReadme:      staticAnalysis.hasReadme,
        hasPackageJson: staticAnalysis.hasPackageJson,
        hasGitignore:   staticAnalysis.hasGitignore,
      },
      aiInsights: {
        issues:      aiInsights.issues,
        suggestions: aiInsights.suggestions,
        aiScore:     aiInsights.aiScore,
      },
      score:  finalScore,
      status: "complete",
    });

    const saved = await evaluation.save();

    // 7. Return structured response 
    return res.status(200).json({
      success: true,
      data: {
        id:       saved._id,
        repoUrl:  saved.repoUrl,
        owner,
        repoName: repo,
        score:    finalScore,
        staticAnalysis: {
          totalFiles:    staticAnalysis.totalFiles,
          analyzedFiles: selectedFiles.length,
          fileTypes:     staticAnalysis.fileTypes,
          hasReadme:     staticAnalysis.hasReadme,
          hasPackageJson:staticAnalysis.hasPackageJson,
          hasGitignore:  staticAnalysis.hasGitignore,
          hasDockerFile: staticAnalysis.hasDockerFile,
          hasCIConfig:   staticAnalysis.hasCIConfig,
        },
        issues:      aiInsights.issues,
        suggestions: aiInsights.suggestions,
        analyzedFiles: selectedFiles.map((f) => f.path),
        createdAt:   saved.createdAt,
      },
    });
  } catch (error) {
    console.error(" Evaluation pipeline error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "An unexpected error occurred during evaluation.",
    });
  }
};

/**
 * getHistory
 * GET /api/analyze/history
 * Returns the last 20 evaluations from the database.
 */
const getHistory = async (req, res) => {
  try {
    const history = await Evaluation.find({ status: "complete" })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("repoUrl owner repoName score createdAt");

    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { analyzeRepo, getHistory };
