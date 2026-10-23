import React from 'react';
// â”€â”€â”€ AirQuality.jsx â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { Wind } from "lucide-react";
import { getAqiInfo } from "../../utils/weatherHelpers";
import "./AirQuality.css";

/**
 * Air Quality Index card using the OpenWeather Air Pollution API.
 * AQI scale: 1 (Good) â†’ 5 (Very Poor)
 * Props: aqi (OWM air_pollution list[0] object or null)
 */
export default function AirQuality({ aqi }) {
  if (!aqi) return null;

  const index = aqi.main?.aqi;
  if (!index) return null;

  const { label, cls, desc } = getAqiInfo(index);
  const components = aqi.components || {};

  // AQI bar: 5 steps
  const barWidth = `${(index / 5) * 100}%`;

  return (
    <article className={`aqi-card glass-card ${cls}`}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">AIR QUALITY</p>
          <h3>Air pollution index</h3>
        </div>
        <span className="heading-icon aqi-heading-icon">
          <Wind size={18} />
        </span>
      </div>

      {/* AQI score + label */}
      <div className="aqi-score-row">
        <div className={`aqi-badge ${cls}`}>
          <span className="aqi-number">{index}</span>
          <span className="aqi-label-text">/5</span>
        </div>
        <div>
          <p className={`aqi-status ${cls}`}>{label}</p>
          <p className="aqi-desc">{desc}</p>
        </div>
      </div>

      {/* AQI gradient bar */}
      <div className="aqi-bar-track" role="progressbar" aria-valuenow={index} aria-valuemin={1} aria-valuemax={5}>
        <div className="aqi-bar-fill" style={{ width: barWidth }} />
        <div className="aqi-tick-marks">
          {[1,2,3,4,5].map((n) => (
            <span key={n} className={`aqi-tick${index === n ? " aqi-tick-active" : ""}`} />
          ))}
        </div>
      </div>
      <div className="aqi-bar-labels">
        <span>Good</span>
        <span>Very Poor</span>
      </div>

      {/* Pollutant breakdown */}
      {Object.keys(components).length > 0 && (
        <div className="pollutants-grid">
          {[
            { key: "pm2_5", label: "PMâ‚‚.â‚…", unit: "Âµg/mÂ³" },
            { key: "pm10",  label: "PMâ‚â‚€",  unit: "Âµg/mÂ³" },
            { key: "no2",   label: "NOâ‚‚",   unit: "Âµg/mÂ³" },
            { key: "o3",    label: "Oâ‚ƒ",    unit: "Âµg/mÂ³" },
            { key: "co",    label: "CO",    unit: "Âµg/mÂ³" },
            { key: "so2",   label: "SOâ‚‚",   unit: "Âµg/mÂ³" },
          ].map(({ key, label, unit }) =>
            components[key] != null ? (
              <div className="pollutant-item" key={key}>
                <span className="pollutant-label">{label}</span>
                <strong className="pollutant-value">
                  {components[key].toFixed(1)}
                </strong>
                <span className="pollutant-unit">{unit}</span>
              </div>
            ) : null
          )}
        </div>
      )}
    </article>
  );
}

