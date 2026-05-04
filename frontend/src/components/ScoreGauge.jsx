import React, { useEffect, useState } from "react";

const getScoreConfig = (score) => {
  if (score >= 9) return { color: "#16a34a", bg: "#f0fdf4", label: "Excellent",  border: "#86efac" };
  if (score >= 7) return { color: "#2563eb", bg: "#eff6ff", label: "Good",       border: "#93c5fd" };
  if (score >= 4) return { color: "#d97706", bg: "#fffbeb", label: "Average",    border: "#fcd34d" };
  return           { color: "#dc2626", bg: "#fff1f2", label: "Needs Work", border: "#fca5a5" };
};

export default function ScoreGauge({ score }) {
  const [displayed, setDisplayed] = useState(0);
  const cfg = getScoreConfig(score);

  useEffect(() => {
    let start = 0;
    const timer = setInterval(() => {
      start = Math.min(start + score / 24, score);
      setDisplayed(parseFloat(start.toFixed(1)));
      if (start >= score) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [score]);

  const radius = 52;
  const circ   = 2 * Math.PI * radius;
  const arc    = circ * 0.75;
  const prog   = (displayed / 10) * arc;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{
        background: cfg.bg, border: `1px solid ${cfg.border}`,
        borderRadius: 20, padding: "28px 36px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      }}>
        <svg width="160" height="130" viewBox="0 0 160 160" style={{ overflow: "visible" }}>
          {/* Track */}
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10"
            strokeDasharray={`${arc} ${circ}`} strokeLinecap="round"
            transform="rotate(135 80 80)" />
          {/* Progress */}
          <circle cx="80" cy="80" r={radius} fill="none" stroke={cfg.color} strokeWidth="10"
            strokeDasharray={`${prog} ${circ}`} strokeLinecap="round"
            transform="rotate(135 80 80)"
            style={{ transition: "stroke-dasharray 0.04s linear", filter: `drop-shadow(0 0 6px ${cfg.color}50)` }} />
          {/* Score */}
          <text x="80" y="76" textAnchor="middle" fill={cfg.color}
            fontSize="30" fontWeight="700" fontFamily="'Bricolage Grotesque', serif">
            {displayed.toFixed(1)}
          </text>
          <text x="80" y="96" textAnchor="middle" fill="#9ca3af"
            fontSize="11" fontFamily="'DM Sans', sans-serif">
            out of 10
          </text>
        </svg>
        <span style={{
          fontFamily: "'Bricolage Grotesque', serif",
          fontWeight: 700, fontSize: "0.9rem",
          color: cfg.color, letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}>{cfg.label}</span>
      </div>
    </div>
  );
}
