import React from 'react';
// â”€â”€â”€ FavoriteCities.jsx â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { Star, X, MapPin } from "lucide-react";
import "./FavoriteCities.css";

/**
 * Favorite cities panel.
 * Props:
 *   favorites     â€“ string[] from localStorage
 *   currentCity   â€“ string (the active city)
 *   onSelect      â€“ (cityName: string) => void
 *   onAdd         â€“ () => void  (adds the current city)
 *   onRemove      â€“ (cityName: string) => void
 */
export default function FavoriteCities({ favorites, currentCity, onSelect, onAdd, onRemove }) {
  const isCurrentFav = favorites.some(
    (f) => f.toLowerCase() === currentCity?.toLowerCase()
  );

  return (
    <section className="favorites-section">
      <div className="section-title-row">
        <div>
          <p className="eyebrow">QUICK SWITCH</p>
          <h3>Favorite cities</h3>
        </div>
        {/* Add / Remove current city */}
        {currentCity && (
          <button
            className={`fav-toggle-btn${isCurrentFav ? " fav-active" : ""}`}
            onClick={isCurrentFav ? () => onRemove(currentCity) : onAdd}
            aria-label={isCurrentFav ? "Remove from favorites" : "Add to favorites"}
            title={isCurrentFav ? "Remove from favorites" : `Add ${currentCity} to favorites`}
          >
            <Star size={14} fill={isCurrentFav ? "currentColor" : "none"} />
            {isCurrentFav ? "Saved" : "Save city"}
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <Star size={28} />
          <p>No favorites yet.</p>
          <span>Search a city and click "Save city" to add it here.</span>
        </div>
      ) : (
        <div className="favorites-list">
          {favorites.map((city) => (
            <div
              key={city}
              className={`fav-chip${city.toLowerCase() === currentCity?.toLowerCase() ? " fav-chip-active" : ""}`}
            >
              <button
                className="fav-chip-name"
                onClick={() => onSelect(city)}
                aria-label={`Load weather for ${city}`}
              >
                <MapPin size={12} />
                {city}
              </button>
              <button
                className="fav-chip-remove"
                onClick={() => onRemove(city)}
                aria-label={`Remove ${city} from favorites`}
                title="Remove"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

