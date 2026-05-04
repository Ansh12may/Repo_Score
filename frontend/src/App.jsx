// src/App.jsx
// ─────────────────────────────────────────────────
// Root application component.
// Sets up React Router with three routes:
//   /          → Home (URL input)
//   /results   → Results dashboard
//   /history   → Past evaluations
// ─────────────────────────────────────────────────

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar   from "./components/Navbar";
import Home     from "./pages/Home";
import Results  from "./pages/Results";
import History  from "./pages/History";

const App = () => {
  return (
    <BrowserRouter>
      {/* Sticky navigation bar — present on all pages */}
      <Navbar />

      {/* Main content area */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/"        element={<Home />}    />
          <Route path="/results" element={<Results />} />
          <Route path="/history" element={<History />} />
          {/* Catch-all: redirect unknown paths to home */}
          <Route path="*"        element={<Home />}    />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
