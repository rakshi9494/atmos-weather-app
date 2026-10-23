import React from 'react';
// â”€â”€â”€ SkeletonLoader.jsx â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Shows animated placeholder boxes while data is loading.
// This is much more professional than a simple spinner.

import "./SkeletonLoader.css";

function Bone({ className = "" }) {
  return <div className={`skeleton-bone ${className}`} aria-hidden="true" />;
}

export default function SkeletonLoader() {
  return (
    <div className="skeleton-wrapper" role="status" aria-label="Loading weather dataâ€¦">
      {/* Top row: current + sun */}
      <div className="skeleton-main-grid">
        <div className="skeleton-card skeleton-current">
          <Bone className="bone-tag" />
          <Bone className="bone-city" />
          <Bone className="bone-date" />
          <div className="skeleton-temp-row">
            <Bone className="bone-temp" />
            <div className="skeleton-icon-block">
              <Bone className="bone-icon" />
              <Bone className="bone-cond" />
              <Bone className="bone-feels" />
            </div>
          </div>
          <Bone className="bone-hl" />
        </div>
        <div className="skeleton-card skeleton-sun">
          <Bone className="bone-tag" />
          <Bone className="bone-title" />
          <Bone className="bone-arc" />
          <div className="skeleton-sun-times">
            <Bone className="bone-time" />
            <Bone className="bone-time" />
          </div>
        </div>
      </div>

      {/* Hourly row */}
      <div className="skeleton-hourly">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton-card skeleton-hour">
            <Bone className="bone-time-sm" />
            <Bone className="bone-hour-icon" />
            <Bone className="bone-hour-temp" />
          </div>
        ))}
      </div>

      {/* Details grid */}
      <div className="skeleton-metrics">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton-card skeleton-metric">
            <Bone className="bone-tag" />
            <Bone className="bone-big-val" />
            <Bone className="bone-note" />
          </div>
        ))}
      </div>
    </div>
  );
}

