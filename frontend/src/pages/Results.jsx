import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import ScoreGauge  from "../components/ScoreGauge";
import ScoreChart  from "../components/ScoreChart";
import StatsBadges from "../components/StatsBadges";

export default function Results() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const result = state?.result;

  if (!result) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--gray-700)" }}>No evaluation data</div>
      <Link to="/" className="btn btn-primary">← Back to Home</Link>
    </div>
  );

  const { repoUrl, owner, repoName, score, issues = [], suggestions = [], staticAnalysis = {}, analyzedFiles = [], createdAt } = result;

  const getScoreBadge = (s) => {
    if (s >= 9) return { class: "badge-green",  label: "Excellent" };
    if (s >= 7) return { class: "badge-blue",   label: "Good" };
    if (s >= 4) return { class: "badge-amber",  label: "Average" };
    return             { class: "badge-red",    label: "Needs Work" };
  };
  const scoreBadge = getScoreBadge(score);

  return (
    <div style={{ background: "var(--gray-50)", minHeight: "calc(100vh - 60px)" }}>

      {/* ── Page Header Bar ── */}
      <div style={{
        background: "var(--white)", borderBottom: "1px solid var(--border)",
        padding: "20px 32px",
      }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => navigate("/")} className="btn btn-secondary" style={{ padding: "7px 14px", fontSize: "0.82rem" }}>
              ← Back
            </button>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--gray-900)" }}>
                  {owner}/{repoName}
                </h1>
                <span className={`badge ${scoreBadge.class}`}>{scoreBadge.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                <a href={repoUrl} target="_blank" rel="noreferrer" style={{
                  fontSize: "0.8rem", color: "var(--gray-400)", textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.69 7.69 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                  {repoUrl}
                </a>
                {createdAt && (
                  <span style={{ fontSize: "0.78rem", color: "var(--gray-300)" }}>·</span>
                )}
                {createdAt && (
                  <span style={{ fontSize: "0.78rem", color: "var(--gray-400)" }}>
                    {new Date(createdAt).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={() => navigate("/")} className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "9px 18px" }}>
            + New Evaluation
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>

          {/* LEFT SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Score card */}
            <div className="anim-scale-in" style={{
              background: "var(--white)", border: "1px solid var(--border)",
              borderRadius: 14, padding: "28px 24px",
              boxShadow: "var(--shadow-sm)", textAlign: "center",
            }}>
              <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 20 }}>Quality Score</p>
              <ScoreGauge score={score} />
            </div>

            {/* Quick stats */}
            <div className="anim-scale-in anim-delay-1" style={{
              background: "var(--white)", border: "1px solid var(--border)",
              borderRadius: 14, padding: "20px",
              boxShadow: "var(--shadow-sm)",
            }}>
              <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>Quick Stats</p>
              {[
                { label: "Total files",    value: staticAnalysis.totalFiles || 0,  color: "var(--blue-600)" },
                { label: "AI reviewed",    value: staticAnalysis.analyzedFiles || analyzedFiles.length, color: "var(--purple-600)" },
                { label: "Issues found",   value: issues.length,       color: "var(--red-600)" },
                { label: "Suggestions",    value: suggestions.length,   color: "var(--blue-600)" },
              ].map(({ label, value, color }, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < 3 ? "1px solid var(--gray-100)" : "none",
                }}>
                  <span style={{ fontSize: "0.83rem", color: "var(--gray-500)" }}>{label}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Files reviewed */}
            {analyzedFiles.length > 0 && (
              <div className="anim-scale-in anim-delay-2" style={{
                background: "var(--white)", border: "1px solid var(--border)",
                borderRadius: 14, padding: "20px", boxShadow: "var(--shadow-sm)",
              }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Files Reviewed</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {analyzedFiles.map((file, i) => {
                    const ext = file.split(".").pop().toUpperCase();
                    return (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "7px 10px", borderRadius: 8,
                        background: "var(--gray-50)", border: "1px solid var(--border)",
                        fontSize: "0.78rem", color: "var(--gray-600)",
                        fontFamily: "var(--font-mono)",
                        overflow: "hidden",
                      }}>
                        <span style={{
                          flexShrink: 0, fontSize: "0.65rem", fontWeight: 600,
                          background: "var(--blue-100)", color: "var(--blue-700)",
                          padding: "2px 5px", borderRadius: 4,
                          fontFamily: "var(--font-body)",
                        }}>{ext}</span>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT MAIN PANEL */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Hygiene */}
            <div className="anim-fade-up">
              <StatsBadges staticAnalysis={{ ...staticAnalysis, analyzedFiles: staticAnalysis.analyzedFiles || analyzedFiles.length }} />
            </div>

            {/* Charts */}
            <div className="anim-fade-up anim-delay-1">
              <ScoreChart data={result} />
            </div>

            {/* Issues */}
            {issues.length > 0 && (
              <div className="anim-fade-up anim-delay-2" style={{
                background: "var(--white)", border: "1px solid var(--border)",
                borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-sm)",
              }}>
                <div style={{
                  padding: "18px 24px", borderBottom: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "var(--red-50)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--red-100)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red-600)" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--gray-800)" }}>Issues Found</p>
                      <p style={{ fontSize: "0.78rem", color: "var(--red-600)" }}>Problems that need attention</p>
                    </div>
                  </div>
                  <span className="badge badge-red">{issues.length} issues</span>
                </div>
                <div style={{ padding: "8px 0" }}>
                  {issues.map((issue, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 14,
                      padding: "14px 24px",
                      borderBottom: i < issues.length - 1 ? "1px solid var(--gray-100)" : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--red-50)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <div style={{
                        flexShrink: 0, width: 22, height: 22, borderRadius: 6,
                        background: "var(--red-100)", color: "var(--red-600)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.7rem", fontWeight: 700, marginTop: 1,
                      }}>{i + 1}</div>
                      <p style={{ fontSize: "0.875rem", color: "var(--gray-700)", lineHeight: 1.6 }}>{issue}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="anim-fade-up anim-delay-3" style={{
                background: "var(--white)", border: "1px solid var(--border)",
                borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-sm)",
              }}>
                <div style={{
                  padding: "18px 24px", borderBottom: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "var(--blue-50)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--blue-100)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue-600)" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--gray-800)" }}>Suggestions</p>
                      <p style={{ fontSize: "0.78rem", color: "var(--blue-600)" }}>Actionable improvements</p>
                    </div>
                  </div>
                  <span className="badge badge-blue">{suggestions.length} suggestions</span>
                </div>
                <div style={{ padding: "8px 0" }}>
                  {suggestions.map((sug, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 14,
                      padding: "14px 24px",
                      borderBottom: i < suggestions.length - 1 ? "1px solid var(--gray-100)" : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--blue-50)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <div style={{
                        flexShrink: 0, width: 22, height: 22, borderRadius: 6,
                        background: "var(--blue-100)", color: "var(--blue-600)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.75rem", fontWeight: 700, marginTop: 1,
                      }}>→</div>
                      <p style={{ fontSize: "0.875rem", color: "var(--gray-700)", lineHeight: 1.6 }}>{sug}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
