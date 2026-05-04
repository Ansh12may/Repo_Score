import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: scrolled ? "rgba(255,255,255,0.95)" : "var(--white)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      boxShadow: scrolled ? "0 1px 10px rgba(0,0,0,0.06)" : "none",
      transition: "all 0.2s ease",
    }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "var(--gray-900)", letterSpacing: "-0.02em" }}>
            RepoScore
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[
            { to: "/", label: "Evaluate" },
            { to: "/history", label: "History" },
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: "0.875rem", fontWeight: 500,
              color: isActive(to) ? "var(--blue-600)" : "var(--gray-600)",
              background: isActive(to) ? "var(--blue-50)" : "transparent",
              textDecoration: "none",
              transition: "all 0.15s",
            }}>
              {label}
            </Link>
          ))}
          <div style={{ width: 1, height: 20, background: "var(--border)", margin: "0 8px" }} />
          <a href="https://github.com" target="_blank" rel="noreferrer" style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 8,
            fontSize: "0.875rem", fontWeight: 500,
            color: "var(--gray-600)", textDecoration: "none",
            border: "1px solid var(--border)",
            background: "var(--white)",
            boxShadow: "var(--shadow-xs)",
            transition: "all 0.15s",
          }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.69 7.69 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
