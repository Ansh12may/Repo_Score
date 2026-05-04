// const axios = require("axios");
// require("dotenv").config();

// const MOCK_ISSUES = [
//   "No error handling found in several async functions",
//   "Hardcoded credentials or API keys detected in source files",
//   "Missing input validation on user-facing endpoints",
//   "No unit tests found in the repository",
//   "Inconsistent code style and formatting across files",
// ];

// const MOCK_SUGGESTIONS = [
//   "Add a comprehensive README with setup instructions",
//   "Implement ESLint and enforce it in CI",
//   "Break large functions into smaller single-purpose helpers",
//   "Write unit tests — aim for 70%+ coverage",
//   "Add a .gitignore to exclude node_modules and dist",
// ];

// const generateMockResponse = (files) => {
//   const seed = files.length % 4;
//   return {
//     aiScore:     Math.min(10, 4 + files.length),
//     issues:      MOCK_ISSUES.slice(seed, seed + 3),
//     suggestions: MOCK_SUGGESTIONS.slice(seed, seed + 3),
//   };
// };

// // const callOpenAI = async (prompt) => {
// //   const response = await axios.post(
// //     "https://api.openai.com/v1/chat/completions",
// //     {
// //       model: "gpt-4o-mini",
// //       max_tokens: 1024,
// //       temperature: 0.3,
// //       messages: [
// //         { role: "system", content: "You are an expert code reviewer. Always respond with valid JSON only — no prose, no markdown fences." },
// //         { role: "user",   content: prompt },
// //       ],
// //     },
// //     {
// //       headers: {
// //         Authorization: `Bearer ${process.env.AI_API_KEY}`,
// //         "Content-Type": "application/json",
// //       },
// //     }
// //   );
// //   return response.data.choices[0].message.content;
// // };


// import axios from "axios";

// const callGroq = async (prompt) => {
//   const response = await axios.post(
//     "https://api.groq.com/openai/v1/chat/completions",
//     {
//       model: "llama-3.1-8b-instant", // fast + free tier friendly
//       max_tokens: 1024,
//       temperature: 0.3,
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are an expert code reviewer. Always respond with valid JSON only — no prose, no markdown fences.",
//         },
//         { role: "user", content: prompt },
//       ],
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   return response.data.choices[0].message.content;
// };

// const parseAIResponse = (rawText, files) => {
//   try {
//     const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
//     const parsed  = JSON.parse(cleaned);
//     return {
//       aiScore:     Math.min(10, Math.max(0, Number(parsed.score) || 5)),
//       issues:      Array.isArray(parsed.issues)      ? parsed.issues      : [],
//       suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
//     };
//   } catch {
//     return generateMockResponse(files);
//   }
// };

// const getAIInsights = async (files) => {
//   const key = process.env.AI_API_KEY;
//   if (!key || key === "your_ai_api_key_here") {
//     console.log(" No AI_API_KEY — using mock response.");
//     return generateMockResponse(files);
//   }

//   const filesSummary = files
//     .map((f) => `### ${f.path}\n\`\`\`\n${f.content.slice(0, 1500)}\n\`\`\``)
//     .join("\n\n");

//   const prompt = `Analyse these source files and respond with JSON only:
// { "score": <0-10>, "issues": ["..."], "suggestions": ["..."] }

// Files:
// ${filesSummary}`;

//   try {
//     const rawText = await callOpenAI(prompt);
//     return parseAIResponse(rawText, files);
//   } catch (error) {
//     console.error(" OpenAI failed:", error.response?.data?.error?.message || error.message);
//     return generateMockResponse(files);
//   }
// };

// module.exports = { getAIInsights };


const axios = require("axios");
require("dotenv").config();

/**
 * Mock data (used when API is unavailable)
 */
const MOCK_ISSUES = [
  "No error handling found in several async functions",
  "Hardcoded credentials or API keys detected in source files",
  "Missing input validation on user-facing endpoints",
  "No unit tests found in the repository",
  "Inconsistent code style and formatting across files",
];

const MOCK_SUGGESTIONS = [
  "Add a comprehensive README with setup instructions",
  "Implement ESLint and enforce it in CI",
  "Break large functions into smaller single-purpose helpers",
  "Write unit tests — aim for 70%+ coverage",
  "Add a .gitignore to exclude node_modules and dist",
];

/**
 * Fallback response generator
 */
const generateMockResponse = (files) => {
  const seed = files.length % 4;
  return {
    aiScore: Math.min(10, 4 + files.length),
    issues: MOCK_ISSUES.slice(seed, seed + 3),
    suggestions: MOCK_SUGGESTIONS.slice(seed, seed + 3),
  };
};

/**
 * Groq API call
 */
const callGroq = async (prompt) => {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      max_tokens: 1024,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are an expert code reviewer. Always respond with valid JSON only — no prose, no markdown fences.",
        },
        { role: "user", content: prompt },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 8000,
    }
  );

  return response.data.choices[0].message.content;
};

/**
 * Parse AI response safely
 */
const parseAIResponse = (rawText, files) => {
  try {
    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return {
      aiScore: Math.min(10, Math.max(0, Number(parsed.score) || 5)),
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      suggestions: Array.isArray(parsed.suggestions)
        ? parsed.suggestions
        : [],
    };
  } catch (err) {
    console.warn(" Failed to parse AI response, using mock.");
    return generateMockResponse(files);
  }
};

/**
 * Main function to get AI insights
 */
const getAIInsights = async (files) => {
  const key = process.env.GROQ_API_KEY;
  const USE_AI = process.env.USE_AI === "true";

  // Fallback if API disabled or missing
  if (!USE_AI || !key || key === "your_groq_api_key_here") {
    console.log(" Using mock AI response.");
    return generateMockResponse(files);
  }

  // Prepare summarized input
  const filesSummary = files
    .map(
      (f) =>
        `### ${f.path}\n\`\`\`\n${f.content.slice(0, 1500)}\n\`\`\``
    )
    .join("\n\n");

  const prompt = `Analyse these source files and respond with JSON only:
{ "score": <0-10>, "issues": ["..."], "suggestions": ["..."] }

Files:
${filesSummary}`;

  try {
    const rawText = await callGroq(prompt);
    return parseAIResponse(rawText, files);
  } catch (error) {
    console.error(
      " Groq API failed:",
      error.response?.data?.error?.message || error.message
    );
    return generateMockResponse(files);
  }
};

module.exports = { getAIInsights };