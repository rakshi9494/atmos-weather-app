import React from 'react';
// â”€â”€â”€ DailyForecast.jsx â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { CalendarDays, Droplets, ArrowUp, ArrowDown } from "lucide-react";
import { weatherIconUrl, convertTemp } from "../../utils/weatherHelpers";
import "./DailyForecast.css";

/**
 * 5-day daily forecast grid.
 * Props: daily (array from getDailyForecast), unit ("C"|"F")
 */
export default function DailyForecast({ daily = [], unit }) {
  if (!daily.length) return null;

  return (
    <section className="forecast-section">
      <div className="section-title-row">
        <div>
          <p className="eyebrow">PLAN AHEAD</p>
          <h3>5-day forecast</h3>
        </div>
        <span className="forecast-caption">
          <CalendarDays size={14} />
          Next five days
        </span>
      </div>

      <div className="forecast-grid">
        {daily.map((day) => (
          <article className="forecast-card glass-card" key={day.date}>
            <p className="forecast-day">{day.day}</p>
            <img
              src={weatherIconUrl(day.icon)}
              alt={day.description}
              width={64}
              height={64}
            />
            <strong className="forecast-temp">{convertTemp(day.temp, unit)}Â°</strong>
            <p className="forecast-condition">{day.description}</p>
            <div className="forecast-hl">
              <span className="forecast-hi">
                <ArrowUp size={10} />
                {convertTemp(day.tempMax, unit)}Â°
              </span>
              <span className="forecast-lo">
                <ArrowDown size={10} />
                {convertTemp(day.tempMin, unit)}Â°
              </span>
            </div>
            <span className="rain-chance">
              <Droplets size={12} />
              {day.pop}%
            </span>
          </article>
        ))}
      </div>
      <p className="forecast-footnote">
        Forecasts are estimates and may change. Data provided by OpenWeather.
      </p>
    </section>
  );
}

