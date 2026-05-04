import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeRepo } from "../api/analyze";

const EXAMPLES = [
  { owner: "expressjs/express",  label: "Express.js",   lang: "Node.js" },
  { owner: "facebook/react",     label: "React",         lang: "JavaScript" },
  { owner: "tiangolo/fastapi",   label: "FastAPI",       lang: "Python" },
  { owner: "vercel/next.js",     label: "Next.js",       lang: "TypeScript" },
];

const STEPS = [
  { icon: "🔗", title: "Paste URL", desc: "Enter any public GitHub repository URL" },
  { icon: "⚙️", title: "Analysis", desc: "We fetch the repo tree and key source files" },
  { icon: "🤖", title: "AI Review", desc: "GPT-4o-mini reviews your code quality" },
  { icon: "📊", title: "Score", desc: "Get a 0–10 score with issues and suggestions" },
];

export default function Home() {
  const navigate = useNavigate();
  const [url, setUrl]         = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [phase, setPhase]     = useState("");

  const handleAnalyze = async () => {
    if (!url.trim()) { setError("Please enter a GitHub repository URL"); return; }
    if (!url.includes("github.com")) { setError("URL must be a GitHub repository (github.com)"); return; }
    setError(""); setLoading(true); setPhase("Fetching repository structure…");
    try {
      const t = setTimeout(() => setPhase("Running AI code review…"), 2500);
      const result = await analyzeRepo(url);
      clearTimeout(t);
      navigate("/results", { state: { result } });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false); setPhase("");
    }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "calc(100vh - 60px)" }}>

      {/* ── Hero ── */}
      <div style={{
        background: "linear-gradient(180deg, var(--gray-50) 0%, var(--white) 100%)",
        borderBottom: "1px solid var(--border)",
        padding: "80px 32px 64px",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>

          {/* Top badge */}
          <div className="anim-fade-up" style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <span className="badge badge-blue" style={{ padding: "6px 14px", fontSize: "0.78rem" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--blue-500)", display: "inline-block" }} />
              AI-Powered Code Analysis
            </span>
          </div>

          {/* Headline */}
          <h1 className="anim-fade-up anim-delay-1" style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.4rem, 5vw, 3.5rem)",
            fontWeight: 800,
            color: "var(--gray-900)",
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            marginBottom: 20,
          }}>
            Evaluate any GitHub<br />
            <span style={{
              background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              repo in seconds
            </span>
          </h1>

          <p className="anim-fade-up anim-delay-2" style={{
            fontSize: "1.1rem", color: "var(--gray-500)", lineHeight: 1.7,
            maxWidth: 500, margin: "0 auto 40px",
          }}>
            Static analysis + AI code review combined into a single,
            actionable quality score for any public GitHub repository.
          </p>

          {/* Input card */}
          <div className="anim-fade-up anim-delay-3" style={{
            background: "var(--white)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 8,
            boxShadow: "var(--shadow-lg)",
            display: "flex", gap: 8,
            marginBottom: 16,
          }}>
            <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
              <svg style={{ position: "absolute", left: 14, color: "var(--gray-400)", flexShrink: 0 }}
                width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.69 7.69 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              <input
                value={url}
                onChange={e => { setUrl(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && !loading && handleAnalyze()}
                placeholder="https://github.com/owner/repository"
                disabled={loading}
                autoFocus
                style={{
                  width: "100%", padding: "14px 14px 14px 42px",
                  fontSize: "0.95rem", fontFamily: "var(--font-body)",
                  border: error ? "1.5px solid var(--red-500)" : "1.5px solid transparent",
                  borderRadius: 10, outline: "none",
                  background: "var(--gray-50)", color: "var(--gray-900)",
                  transition: "all 0.15s",
                }}
                onFocus={e => { e.target.style.background = "var(--white)"; e.target.style.borderColor = "var(--blue-500)"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)"; }}
                onBlur={e  => { e.target.style.background = "var(--gray-50)"; e.target.style.borderColor = error ? "var(--red-500)" : "transparent"; e.target.style.boxShadow = "none"; }}
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || !url.trim()}
              className="btn btn-primary"
              style={{ padding: "14px 28px", fontSize: "0.95rem", fontWeight: 600, borderRadius: 10 }}
            >
              {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderTopColor: "white", borderColor: "rgba(255,255,255,0.3)" }} />{phase ? "Analysing…" : "Loading…"}</> : <>Analyze</>}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "var(--red-50)", border: "1px solid var(--red-100)",
              borderRadius: 10, padding: "10px 16px",
              color: "var(--red-600)", fontSize: "0.875rem",
              marginBottom: 12, textAlign: "left",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Status */}
          {loading && phase && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--gray-500)", fontSize: "0.85rem", marginBottom: 8 }}>
              <span className="spinner" style={{ width: 14, height: 14 }} />
              {phase}
            </div>
          )}

          {/* Example chips */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
            <span style={{ fontSize: "0.8rem", color: "var(--gray-400)", fontWeight: 500 }}>Try:</span>
            {EXAMPLES.map(ex => (
              <button key={ex.owner} onClick={() => { setUrl(`https://github.com/${ex.owner}`); setError(""); }}
                disabled={loading}
                style={{
                  padding: "5px 12px", borderRadius: 100,
                  border: "1px solid var(--border)",
                  background: "var(--white)", cursor: "pointer",
                  fontSize: "0.8rem", color: "var(--gray-600)", fontWeight: 500,
                  display: "flex", alignItems: "center", gap: 6,
                  transition: "all 0.15s", fontFamily: "var(--font-body)",
                  boxShadow: "var(--shadow-xs)",
                }}>
                <span style={{ fontSize: "0.7rem", background: "var(--blue-50)", color: "var(--blue-600)", padding: "1px 6px", borderRadius: 100, fontWeight: 600 }}>{ex.lang}</span>
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "72px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--blue-600)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>How it works</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.03em" }}>Four steps to a better codebase</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {STEPS.map((step, i) => (
            <div key={i} className={`anim-fade-up anim-delay-${i+1}`} style={{
              background: "var(--white)", border: "1px solid var(--border)",
              borderRadius: 14, padding: "28px 24px",
              boxShadow: "var(--shadow-sm)", position: "relative",
              transition: "box-shadow 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{
                position: "absolute", top: -12, left: 24,
                background: "var(--blue-600)", color: "white",
                width: 24, height: 24, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.7rem", fontWeight: 700, boxShadow: "0 2px 8px rgba(37,99,235,0.4)",
              }}>{i + 1}</div>
              <div style={{ fontSize: "1.6rem", marginBottom: 12, marginTop: 8 }}>{step.icon}</div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 8, letterSpacing: "-0.01em" }}>{step.title}</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--gray-500)", lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "24px 32px", textAlign: "center" }}>
        <p style={{ fontSize: "0.82rem", color: "var(--gray-400)" }}>
          RepoScore — AI Project Evaluator &nbsp;·&nbsp; Built with React, Express & GPT-4o-mini
        </p>
      </div>
    </div>
  );
}
