import React from 'react';
// â”€â”€â”€ HourlyForecast.jsx â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { Droplets } from "lucide-react";
import { weatherIconUrl, convertTemp } from "../../utils/weatherHelpers";
import "./HourlyForecast.css";

/**
 * Horizontally scrollable row of 8 hourly slots (3-hour intervals from OWM).
 * Props: hourly (array), unit ("C"|"F")
 */
export default function HourlyForecast({ hourly = [], unit }) {
  if (!hourly.length) return null;

  return (
    <section className="hourly-section">
      <div className="section-title-row">
        <div>
          <p className="eyebrow">NEXT 24 HOURS</p>
          <h3>Hourly forecast</h3>
        </div>
      </div>
      <div className="hourly-scroll-wrapper">
        <div className="hourly-track">
          {hourly.map((slot, i) => (
            <article key={slot.dt} className={`hourly-card glass-card${i === 0 ? " hourly-now" : ""}`}>
              <p className="hourly-time">{i === 0 ? "Now" : slot.time}</p>
              <img
                src={weatherIconUrl(slot.icon)}
                alt={slot.description}
                width={52}
                height={52}
              />
              <strong className="hourly-temp">
                {convertTemp(slot.temp, unit)}Â°
              </strong>
              <span className="hourly-rain">
                <Droplets size={11} />
                {slot.pop}%
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

