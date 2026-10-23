import React from 'react';
// â”€â”€â”€ CurrentWeather.jsx â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { MapPin, Thermometer, ArrowUp, ArrowDown } from "lucide-react";
import { weatherIconUrl, convertTemp, formatTime } from "../../utils/weatherHelpers";
import "./CurrentWeather.css";

/**
 * The hero card showing city name, temperature, condition icon and high/low.
 * Props: current (OWM current weather object), unit ("C"|"F")
 */
export default function CurrentWeather({ current, unit }) {
  if (!current) return null;

  const tz = current.timezone || 0;
  const localDate = new Date((current.dt + tz) * 1000).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const condition = current.weather[0];

  return (
    <article className="current-card glass-card">
      {/* Location header */}
      <div className="current-card-top">
        <div>
          <div className="location-label">
            <MapPin size={13} />
            CURRENT LOCATION
          </div>
          <h2>
            {current.name}
            <span className="country-code">, {current.sys.country}</span>
          </h2>
          <p className="date-label">{localDate}</p>
        </div>
      </div>

      {/* Temperature + icon */}
      <div className="temperature-row">
        <div className="temperature">
          {convertTemp(current.main.temp, unit)}
          <span>Â°{unit}</span>
        </div>
        <div className="condition-block">
          <img
            src={weatherIconUrl(condition.icon)}
            alt={condition.description}
            width={70}
            height={70}
          />
          <p className="condition-description">{condition.description}</p>
          <span className="feels-like">
            <Thermometer size={12} />
            Feels like {convertTemp(current.main.feels_like, unit)}Â°{unit}
          </span>
        </div>
      </div>

      {/* High / Low */}
      <div className="high-low-row">
        <span className="hl-item">
          <ArrowUp size={13} className="hl-icon high-icon" />
          H: {convertTemp(current.main.temp_max, unit)}Â°
        </span>
        <span className="hl-divider" />
        <span className="hl-item">
          <ArrowDown size={13} className="hl-icon low-icon" />
          L: {convertTemp(current.main.temp_min, unit)}Â°
        </span>
        <span className="weather-badge">{condition.main}</span>
      </div>
    </article>
  );
}

