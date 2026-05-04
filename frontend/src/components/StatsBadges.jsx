import React from "react";

const CHECKS = [
  { key: "hasReadme",      label: "README",        icon: "📄", desc: "Documentation present" },
  { key: "hasPackageJson", label: "package.json",  icon: "📦", desc: "Dependency manifest" },
  { key: "hasGitignore",   label: ".gitignore",    icon: "🙈", desc: "Ignore rules defined" },
  { key: "hasDockerFile",  label: "Dockerfile",    icon: "🐳", desc: "Container support" },
  { key: "hasCIConfig",    label: "CI/CD",         icon: "⚙️", desc: "Automated pipelines" },
];

export default function StatsBadges({ staticAnalysis }) {
  const passed = CHECKS.filter(c => staticAnalysis[c.key]).length;
  const total  = CHECKS.length;
  const pct    = Math.round((passed / total) * 100);

  return (
    <div style={{
      background: "var(--white)", border: "1px solid var(--border)",
      borderRadius: 14, padding: "24px", boxShadow: "var(--shadow-sm)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--gray-800)", marginBottom: 2 }}>Project Hygiene</p>
          <p style={{ fontSize: "0.8rem", color: "var(--gray-400)" }}>Best-practice file checks</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", color: pct >= 80 ? "var(--green-600)" : pct >= 50 ? "var(--amber-600)" : "var(--red-600)" }}>
            {passed}/{total}
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--gray-400)" }}>checks passed</p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, background: "var(--gray-100)", borderRadius: 100, marginBottom: 20, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 100,
          width: `${pct}%`,
          background: pct >= 80 ? "var(--green-500)" : pct >= 50 ? "var(--amber-500)" : "var(--red-500)",
          transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
        {CHECKS.map(check => {
          const ok = staticAnalysis[check.key];
          return (
            <div key={check.key} style={{
              padding: "14px 10px", borderRadius: 10, textAlign: "center",
              background: ok ? "var(--green-50)" : "var(--gray-50)",
              border: `1px solid ${ok ? "var(--green-100)" : "var(--border)"}`,
              transition: "all 0.2s",
            }}>
              <div style={{ fontSize: "1.2rem", marginBottom: 6 }}>{check.icon}</div>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, color: ok ? "var(--green-700)" : "var(--gray-400)", marginBottom: 2 }}>
                {check.label}
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 18, height: 18, borderRadius: "50%",
                background: ok ? "var(--green-500)" : "var(--gray-200)",
                fontSize: "0.6rem", color: ok ? "white" : "var(--gray-400)",
                fontWeight: 700, marginTop: 2,
              }}>
                {ok ? "✓" : "✗"}
              </div>
            </div>
          );
        })}
      </div>

      {/* File stats row */}
      <div style={{ display: "flex", gap: 12, marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
        {[
          { label: "Total files",    value: staticAnalysis.totalFiles || 0 },
          { label: "Files reviewed", value: staticAnalysis.analyzedFiles || 0 },
        ].map(({ label, value }) => (
          <div key={label} style={{
            flex: 1, padding: "12px 16px",
            background: "var(--blue-50)", border: "1px solid var(--blue-100)",
            borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: "0.82rem", color: "var(--gray-600)" }}>{label}</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "var(--blue-700)" }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
