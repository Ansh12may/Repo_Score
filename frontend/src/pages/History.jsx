import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHistory } from "../api/analyze";

const scoreColor = (s) => s >= 9 ? "var(--green-600)" : s >= 7 ? "var(--blue-600)" : s >= 4 ? "var(--amber-600)" : "var(--red-600)";
const scoreBg    = (s) => s >= 9 ? "var(--green-50)"  : s >= 7 ? "var(--blue-50)"  : s >= 4 ? "var(--amber-50)"  : "var(--red-50)";
const scoreBadge = (s) => s >= 9 ? "Excellent" : s >= 7 ? "Good" : s >= 4 ? "Average" : "Needs Work";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    getHistory().then(setHistory).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "var(--gray-50)", minHeight: "calc(100vh - 60px)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 32px" }}>

        {/* Header */}
        <div className="anim-fade-up" style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>
            Evaluation History
          </h1>
          <p style={{ color: "var(--gray-500)", fontSize: "0.9rem" }}>
            All past repository evaluations stored in the database
          </p>
        </div>

        {loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "80px 0", color: "var(--gray-400)" }}>
            <span className="spinner" />
            <span style={{ fontSize: "0.9rem" }}>Loading evaluations…</span>
          </div>
        )}

        {error && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "16px 20px", borderRadius: 12,
            background: "var(--red-50)", border: "1px solid var(--red-100)",
            color: "var(--red-600)", fontSize: "0.875rem",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>📭</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, marginBottom: 8, color: "var(--gray-700)" }}>No evaluations yet</h3>
            <p style={{ color: "var(--gray-400)", fontSize: "0.875rem", marginBottom: 24 }}>Evaluate your first repository to see it here</p>
            <Link to="/" className="btn btn-primary">Start Evaluating →</Link>
          </div>
        )}

        {!loading && history.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Table header */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr auto auto auto",
              padding: "10px 20px", gap: 16,
              fontSize: "0.72rem", fontWeight: 600, color: "var(--gray-400)",
              textTransform: "uppercase", letterSpacing: "0.06em",
            }}>
              <span>Repository</span>
              <span style={{ textAlign: "center" }}>Score</span>
              <span style={{ textAlign: "center", minWidth: 90 }}>Grade</span>
              <span style={{ textAlign: "right", minWidth: 160 }}>Date</span>
            </div>

            {history.map((item, i) => (
              <div key={item._id} className="anim-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                <div style={{
                  background: "var(--white)", border: "1px solid var(--border)",
                  borderRadius: 12, padding: "16px 20px",
                  display: "grid", gridTemplateColumns: "1fr auto auto auto",
                  gap: 16, alignItems: "center",
                  boxShadow: "var(--shadow-xs)",
                  transition: "box-shadow 0.15s, transform 0.15s",
                  cursor: "default",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--shadow-xs)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, overflow: "hidden" }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: "linear-gradient(135deg, #2563eb15, #7c3aed15)",
                      border: "1px solid var(--blue-100)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--blue-500)">
                        <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.69 7.69 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                      </svg>
                    </div>
                    <div style={{ overflow: "hidden" }}>
                      <a href={item.repoUrl} target="_blank" rel="noreferrer" style={{
                        fontWeight: 600, fontSize: "0.92rem", color: "var(--gray-800)",
                        textDecoration: "none", display: "block",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        fontFamily: "var(--font-display)",
                      }}>
                        {item.owner}/{item.repoName}
                      </a>
                      <span style={{ fontSize: "0.75rem", color: "var(--gray-400)", fontFamily: "var(--font-mono)" }}>
                        {item.repoUrl}
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div style={{
                    textAlign: "center",
                    width: 52, height: 52, borderRadius: 12,
                    background: scoreBg(item.score),
                    border: `1px solid ${scoreColor(item.score)}22`,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.15rem", color: scoreColor(item.score), lineHeight: 1 }}>
                      {item.score}
                    </span>
                    <span style={{ fontSize: "0.6rem", color: scoreColor(item.score), opacity: 0.7 }}>/10</span>
                  </div>

                  {/* Grade badge */}
                  <div style={{ textAlign: "center", minWidth: 90 }}>
                    <span className={`badge ${item.score >= 9 ? "badge-green" : item.score >= 7 ? "badge-blue" : item.score >= 4 ? "badge-amber" : "badge-red"}`}>
                      {scoreBadge(item.score)}
                    </span>
                  </div>

                  {/* Date */}
                  <span style={{ fontSize: "0.8rem", color: "var(--gray-400)", textAlign: "right", minWidth: 160, whiteSpace: "nowrap" }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
