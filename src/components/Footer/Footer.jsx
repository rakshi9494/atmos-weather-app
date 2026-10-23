import React from 'react';
// â”€â”€â”€ Footer.jsx â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { Github, ExternalLink, CloudSun } from "lucide-react";
import "./Footer.css";

/**
 * Professional footer with app branding, tech stack, GitHub repo link,
 * and developer portfolio link.
 *
 * âš ï¸  Update GITHUB_URL and PORTFOLIO_URL with your actual links
 *      before deploying to production.
 */
const GITHUB_URL    = "https://github.com/yourusername/atmos-weather-app";
const PORTFOLIO_URL = "https://yourportfolio.dev";
const DEVELOPER     = "Your Name";

export default function Footer() {
  return (
    <footer className="footer">
      {/* Brand */}
      <div className="footer-brand-group">
        <span className="footer-brand-mark">
          <CloudSun size={17} />
        </span>
        <a className="footer-brand" href="#" aria-label="Atmos home">
          atmos<span>.</span>
        </a>
      </div>

      {/* Tagline */}
      <p className="footer-tagline">Designed for the days ahead.</p>

      {/* Tech stack */}
      <div className="footer-stack">
        <span className="stack-label">Built with</span>
        {["React 18", "Vite", "CSS3", "OpenWeather API"].map((t) => (
          <span key={t} className="stack-badge">{t}</span>
        ))}
      </div>

      {/* Links */}
      <div className="footer-links">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
          aria-label="View source code on GitHub"
        >
          <Github size={14} />
          GitHub
        </a>
        <a
          href={PORTFOLIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
          aria-label={`View ${DEVELOPER}'s portfolio`}
        >
          <ExternalLink size={14} />
          Portfolio
        </a>
      </div>

      {/* Copyright */}
      <p className="footer-copy">
        Â© {new Date().getFullYear()} {DEVELOPER}. Data by{" "}
        <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer">
          OpenWeather
        </a>
        .
      </p>
    </footer>
  );
}

