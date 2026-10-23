import React from 'react';
// â”€â”€â”€ Topbar.jsx â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { CloudSun, Sun, Moon, Key } from "lucide-react";
import "./Topbar.css";

/**
 * App header: branding, live indicator, unit toggle, dark/light mode toggle, API key config.
 */
export default function Topbar({
  unit,
  onUnitToggle,
  isDark,
  onThemeToggle,
  onOpenKeyModal,
  isDemoMode,
}) {
  return (
    <header className="topbar">
      {/* Brand */}
      <a className="brand" href="#" aria-label="Atmos home">
        <span className="brand-mark">
          <CloudSun size={23} />
        </span>
        <span>
          atmos<span className="brand-dot">.</span>
        </span>
      </a>

      {/* Right controls */}
      <div className="topbar-right">
        {/* Live or Demo indicator */}
        {isDemoMode ? (
          <span className="demo-pill" onClick={onOpenKeyModal} title="Click to add API key">
            <span className="demo-dot" /> Preview Mode
          </span>
        ) : (
          <span className="live-label">
            <span className="live-dot" /> Live weather
          </span>
        )}

        {/* API Key settings button */}
        <button
          className="icon-btn"
          onClick={onOpenKeyModal}
          aria-label="Configure API Key"
          title="OpenWeather API Key Settings"
        >
          <Key size={15} />
        </button>

        {/* Â°C / Â°F toggle */}
        <button
          className="unit-toggle"
          onClick={onUnitToggle}
          aria-label={`Switch to ${unit === "C" ? "Fahrenheit" : "Celsius"}`}
          title={`Switch to Â°${unit === "C" ? "F" : "C"}`}
        >
          <span className={unit === "C" ? "active" : ""}>Â°C</span>
          <span className="toggle-divider">/</span>
          <span className={unit === "F" ? "active" : ""}>Â°F</span>
        </button>

        {/* Dark / Light mode toggle */}
        <button
          className="theme-toggle"
          onClick={onThemeToggle}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}

