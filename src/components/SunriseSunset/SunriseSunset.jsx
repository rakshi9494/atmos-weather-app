import React from 'react';
// â”€â”€â”€ SunriseSunset.jsx â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { Sunrise, Sunset } from "lucide-react";
import { formatTime, getDaylightDuration } from "../../utils/weatherHelpers";
import "./SunriseSunset.css";

/**
 * Sun arc card showing sunrise time, sunset time, and daylight duration.
 * Props: current (OWM current weather object)
 */
export default function SunriseSunset({ current }) {
  if (!current) return null;

  const tz = current.timezone || 0;
  const { sunrise, sunset } = current.sys;
  const daylight = getDaylightDuration(sunrise, sunset);

  // Calculate how far along in the day the sun is (0â€“100%)
  const now = Math.floor(Date.now() / 1000);
  const rawProgress = ((now - sunrise) / (sunset - sunrise)) * 100;
  const progress = Math.min(Math.max(rawProgress, 0), 100);

  return (
    <article className="sun-card glass-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">DAYLIGHT</p>
          <h3>Sunrise &amp; sunset</h3>
        </div>
        <span className="heading-icon">
          <Sunrise size={19} />
        </span>
      </div>

      {/* Arc visualization */}
      <div className="sun-visual">
        <div className="sun-arc" role="img" aria-label={`Sun progress: ${Math.round(progress)}% through the day`}>
          <div
            className="sun-ball"
            style={{ left: `${progress}%` }}
            title={`${Math.round(progress)}% through daylight`}
          />
        </div>
        <div className="sun-times">
          <div className="sun-time-item">
            <Sunrise size={16} className="sun-icon" />
            <div>
              <span className="sun-label">Sunrise</span>
              <strong>{formatTime(sunrise, tz)}</strong>
            </div>
          </div>
          <div className="sun-duration">
            <span className="sun-label">Daylight</span>
            <strong>{daylight}</strong>
          </div>
          <div className="sun-time-item">
            <Sunset size={16} className="sun-icon" />
            <div>
              <span className="sun-label">Sunset</span>
              <strong>{formatTime(sunset, tz)}</strong>
            </div>
          </div>
        </div>
      </div>

      <p className="sun-note">Make the most of the daylight.</p>
    </article>
  );
}

