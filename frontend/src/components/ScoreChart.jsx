import React from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--white)", border: "1px solid var(--border)",
      borderRadius: 10, padding: "10px 14px",
      boxShadow: "var(--shadow-md)",
      fontFamily: "var(--font-body)", fontSize: "0.82rem",
    }}>
      <p style={{ fontWeight: 600, color: "var(--gray-700)", marginBottom: 2 }}>{label}</p>
      <p style={{ color: payload[0].color || "var(--blue-600)" }}>
        Count: <strong>{payload[0].value}</strong>
      </p>
    </div>
  );
};

export default function ScoreChart({ data }) {
  const { score, staticAnalysis, issues = [], suggestions = [], analyzedFiles = [] } = data;

  const radarData = [
    { subject: "Overall",      value: score },
    { subject: "Structure",    value: (staticAnalysis.hasReadme && staticAnalysis.hasGitignore) ? 8.5 : 3.5 },
    { subject: "Dependencies", value: staticAnalysis.hasPackageJson ? 8 : 3 },
    { subject: "File Count",   value: Math.min(10, staticAnalysis.totalFiles / 4) },
    { subject: "DevOps",       value: staticAnalysis.hasCIConfig ? 9 : staticAnalysis.hasDockerFile ? 6 : 2 },
  ];

  const barData = [
    { name: "Issues Found",   count: issues.length,       fill: "#ef4444" },
    { name: "Suggestions",    count: suggestions.length,  fill: "#3b82f6" },
    { name: "Files Reviewed", count: analyzedFiles.length,fill: "#22c55e" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* Radar */}
      <div style={{
        background: "var(--white)", border: "1px solid var(--border)",
        borderRadius: 14, padding: "24px", boxShadow: "var(--shadow-sm)",
      }}>
        <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--gray-700)", marginBottom: 16 }}>Score Dimensions</p>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject"
              tick={{ fill: "#6b7a99", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }} />
            <Radar name="Score" dataKey="value"
              stroke="#2563eb" fill="#2563eb" fillOpacity={0.12} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Bar */}
      <div style={{
        background: "var(--white)", border: "1px solid var(--border)",
        borderRadius: 14, padding: "24px", boxShadow: "var(--shadow-sm)",
      }}>
        <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--gray-700)", marginBottom: 16 }}>Analysis Summary</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f6" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "'DM Sans', sans-serif" }}
              axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
            <Bar dataKey="count" radius={[6,6,0,0]} maxBarSize={52}>
              {barData.map((e, i) => <Cell key={i} fill={e.fill} opacity={0.9} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
