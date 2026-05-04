
const path = require("path");
const { fetchFileContent } = require("./githubService");

// Extensions we consider "code" and worth sending to the AI
const CODE_EXTENSIONS = [
  ".js", ".jsx", ".ts", ".tsx",  // JavaScript / TypeScript
  ".py",                          // Python
  ".cpp", ".c", ".h",            // C / C++
  ".java",                        // Java
  ".go",                          // Go
  ".rb",                          // Ruby
  ".php",                         // PHP
  ".rs",                          // Rust
  ".swift",                       // Swift
  ".kt",                          // Kotlin
];

// Files that signal good project hygiene
const HYGIENE_FILES = {
  readme:       (p) => /readme/i.test(path.basename(p)),
  packageJson:  (p) => path.basename(p) === "package.json" && !p.includes("node_modules"),
  gitignore:    (p) => path.basename(p) === ".gitignore",
  dockerFile:   (p) => /^dockerfile$/i.test(path.basename(p)),
  ciConfig:     (p) => p.includes(".github/workflows") || p.includes(".travis.yml"),
};

/**
 * runStaticAnalysis
 * Walks the file tree and computes metadata.
 *
 * @param {Array} files — array from githubService.fetchRepoContents
 * @returns {Object} staticAnalysis metadata
 */
const runStaticAnalysis = (files) => {
  const fileTypes = {}; // { ".js": 12, ".py": 3, … }
  let hasReadme = false;
  let hasPackageJson = false;
  let hasGitignore = false;
  let hasDockerFile = false;
  let hasCIConfig = false;

  files.forEach((file) => {
    const ext = path.extname(file.path).toLowerCase() || "(no ext)";
    fileTypes[ext] = (fileTypes[ext] || 0) + 1;

    // Check hygiene signals
    if (HYGIENE_FILES.readme(file.path))      hasReadme = true;
    if (HYGIENE_FILES.packageJson(file.path)) hasPackageJson = true;
    if (HYGIENE_FILES.gitignore(file.path))   hasGitignore = true;
    if (HYGIENE_FILES.dockerFile(file.path))  hasDockerFile = true;
    if (HYGIENE_FILES.ciConfig(file.path))    hasCIConfig = true;
  });

  return {
    totalFiles: files.length,
    fileTypes,
    hasReadme,
    hasPackageJson,
    hasGitignore,
    hasDockerFile,
    hasCIConfig,
  };
};

/**
 * selectFilesForAI
 * Picks the most relevant code files to send to the AI.
 * Strategy:
 *  1. Prefer top-level files (shallow depth first)
 *  2. Only include CODE_EXTENSIONS
 *  3. Exclude node_modules, vendor, dist, build directories
 *  4. Cap at MAX_FILES
 *
 * @param {Array}  files   — full tree from GitHub
 * @param {string} owner
 * @param {string} repo
 * @param {number} maxFiles — defaults to 5
 * @returns {Array} [{ path, content }]
 */
const selectFilesForAI = async (files, owner, repo, maxFiles = 5) => {
  // Directories to skip entirely
  const SKIP_DIRS = ["node_modules", "vendor", "dist", "build", ".git", "__pycache__", "venv", ".venv"];

  const isSkipped = (filePath) =>
    SKIP_DIRS.some((dir) => filePath.split("/").includes(dir));

  const isCodeFile = (filePath) =>
    CODE_EXTENSIONS.includes(path.extname(filePath).toLowerCase());

  // Filter and sort by path depth (shallower = more important)
  const candidates = files
    .filter((f) => isCodeFile(f.path) && !isSkipped(f.path))
    .sort((a, b) => {
      const depthA = a.path.split("/").length;
      const depthB = b.path.split("/").length;
      return depthA - depthB; // ascending — shallow first
    })
    .slice(0, maxFiles);

  // Fetch the actual content for each selected file
  const filesWithContent = await Promise.all(
    candidates.map(async (file) => {
      const content = await fetchFileContent(owner, repo, file.path);
      return {
        path: file.path,
        content: content || "(could not retrieve content)",
      };
    })
  );

  // Drop files where content fetch completely failed
  return filesWithContent.filter((f) => f.content.trim().length > 0);
};

module.exports = { runStaticAnalysis, selectFilesForAI };
