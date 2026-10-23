import React from 'react';
// â”€â”€â”€ WeatherDetails.jsx â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { Droplets, Wind, Eye, Gauge, Thermometer, CloudRain } from "lucide-react";
import "./WeatherDetails.css";

/**
 * Grid of weather metric cards: humidity, wind speed, visibility, pressure,
 * feels-like, and chance of rain.
 */
function MetricCard({ icon, label, value, note, highlight }) {
  return (
    <article className={`metric-card glass-card${highlight ? " metric-highlight" : ""}`}>
      <div className="metric-top">
        <span className="metric-icon">{icon}</span>
        <span className="metric-label">{label}</span>
      </div>
      <strong className="metric-value">{value}</strong>
      <p className="metric-note">{note}</p>
    </article>
  );
}

export default function WeatherDetails({ current }) {
  if (!current) return null;

  const wind = current.wind;
  const main = current.main;

  // Wind direction compass
  function windDirection(deg) {
    if (deg == null) return "";
    const dirs = ["N","NE","E","SE","S","SW","W","NW"];
    return dirs[Math.round(deg / 45) % 8];
  }

  return (
    <section className="details-section">
      <div className="section-title-row">
        <div>
          <p className="eyebrow">AT A GLANCE</p>
          <h3>Today's conditions</h3>
        </div>
        <span className="updated-label">
          <span className="live-dot" />
          Live data
        </span>
      </div>

      <div className="metrics-grid">
        <MetricCard
          icon={<Droplets size={16} />}
          label="Humidity"
          value={`${main.humidity}%`}
          note={main.humidity > 70 ? "High moisture" : main.humidity < 30 ? "Low moisture" : "Comfortable"}
          highlight={main.humidity > 80}
        />
        <MetricCard
          icon={<Wind size={16} />}
          label="Wind speed"
          value={`${wind.speed} m/s`}
          note={`${windDirection(wind.deg)} ${wind.gust ? `Â· Gusts ${wind.gust} m/s` : "Â· Surface wind"}`}
        />
        <MetricCard
          icon={<Eye size={16} />}
          label="Visibility"
          value={`${((current.visibility ?? 0) / 1000).toFixed(1)} km`}
          note={current.visibility >= 10000 ? "Crystal clear" : current.visibility >= 5000 ? "Good visibility" : "Reduced visibility"}
        />
        <MetricCard
          icon={<Gauge size={16} />}
          label="Pressure"
          value={`${main.pressure} hPa`}
          note={main.pressure > 1013 ? "High pressure" : "Low pressure"}
        />
        <MetricCard
          icon={<Thermometer size={16} />}
          label="Feels like"
          value={`${Math.round(main.feels_like)}Â°C`}
          note={main.feels_like < main.temp ? "Wind chill effect" : main.feels_like > main.temp ? "Heat index effect" : "Matches actual temp"}
        />
        <MetricCard
          icon={<CloudRain size={16} />}
          label="Precipitation"
          value={current.rain?.["1h"] != null ? `${current.rain["1h"]} mm` : current.snow?.["1h"] != null ? `${current.snow["1h"]} mm snow` : "0 mm"}
          note="Last 1 hour"
        />
      </div>
    </section>
  );
}

