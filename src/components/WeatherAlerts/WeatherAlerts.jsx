import React from 'react';
// â”€â”€â”€ WeatherAlerts.jsx â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { useState } from "react";
import { TriangleAlert, ChevronDown, ChevronUp, X } from "lucide-react";
import "./WeatherAlerts.css";

/**
 * Shows severe-weather alerts from the OWM One Call API (when available).
 * Collapses to a summary by default; expands on click.
 * Props: alerts (array of alert objects or empty array)
 */
export default function WeatherAlerts({ alerts = [] }) {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Don't render anything if no alerts or user dismissed
  if (!alerts.length || dismissed) return null;

  return (
    <div className="alerts-wrapper" role="alert" aria-live="polite">
      {alerts.map((alert, i) => (
        <div className="alert-card" key={i}>
          <div className="alert-header" onClick={() => setExpanded((v) => !v)}>
            <span className="alert-icon-wrap">
              <TriangleAlert size={17} />
            </span>
            <div className="alert-meta">
              <p className="alert-event">{alert.event || "Weather Alert"}</p>
              {alert.sender_name && (
                <span className="alert-sender">Source: {alert.sender_name}</span>
              )}
            </div>
            <div className="alert-actions">
              <button
                className="alert-expand-btn"
                aria-label={expanded ? "Collapse alert" : "Expand alert"}
                onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
              >
                {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
              <button
                className="alert-dismiss-btn"
                aria-label="Dismiss alerts"
                onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {expanded && alert.description && (
            <p className="alert-description">{alert.description}</p>
          )}

          {expanded && (alert.start || alert.end) && (
            <div className="alert-times">
              {alert.start && (
                <span>From: {new Date(alert.start * 1000).toLocaleString()}</span>
              )}
              {alert.end && (
                <span>Until: {new Date(alert.end * 1000).toLocaleString()}</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

