import React from 'react';
// â”€â”€â”€ RecentSearches.jsx â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { Clock, X } from "lucide-react";
import "./RecentSearches.css";

/**
 * Shows chips for recent city searches. Max 6 items stored.
 * Props:
 *   recent   â€“ string[]
 *   onSelect â€“ (city: string) => void
 *   onClear  â€“ () => void (clears all)
 */
export default function RecentSearches({ recent, onSelect, onClear }) {
  if (!recent.length) return null;

  return (
    <div className="recent-searches">
      <div className="recent-header">
        <span className="recent-label">
          <Clock size={12} />
          Recent
        </span>
        <button className="recent-clear" onClick={onClear} aria-label="Clear recent searches">
          Clear all
        </button>
      </div>
      <div className="recent-chips">
        {recent.map((city) => (
          <button
            key={city}
            className="recent-chip"
            onClick={() => onSelect(city)}
            aria-label={`Search ${city} again`}
          >
            <Clock size={11} />
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}

