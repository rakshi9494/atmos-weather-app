import React from 'react';
// â”€â”€â”€ SearchBar.jsx â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Autocomplete search input that shows city suggestions from the Geocoding API.
// Calls onSearch(cityName) when the user selects or submits.

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, RefreshCw, LocateFixed, X } from "lucide-react";
import { fetchSuggestions } from "../../hooks/useWeather";
import "./SearchBar.css";

/** Debounce helper â€“ delays a function call until the user stops typing. */
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchBar({ onSearch, onLocationClick, loading }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [sugLoading, setSugLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1); // keyboard nav
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const debouncedInput = useDebounce(input, 350);

  // Fetch suggestions whenever the debounced input changes
  useEffect(() => {
    if (debouncedInput.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setSugLoading(true);
    fetchSuggestions(debouncedInput)
      .then((results) => {
        setSuggestions(results);
        setShowDropdown(results.length > 0);
        setActiveIndex(-1);
      })
      .catch(() => setSuggestions([]))
      .finally(() => setSugLoading(false));
  }, [debouncedInput]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectSuggestion(suggestion) {
    setInput(suggestion.name);
    setSuggestions([]);
    setShowDropdown(false);
    onSearch(suggestion.name);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      selectSuggestion(suggestions[activeIndex]);
    } else {
      setShowDropdown(false);
      onSearch(input.trim());
    }
  }

  function handleKeyDown(e) {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  }

  function clearInput() {
    setInput("");
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  }

  return (
    <div className="search-container" ref={containerRef}>
      <form className="search-form" onSubmit={handleSubmit} role="search">
        {/* Search icon */}
        <Search size={17} className="search-icon" />

        {/* Text input */}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          placeholder="Search city..."
          aria-label="Search city"
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
          autoComplete="off"
        />

        {/* Clear button */}
        {input && (
          <button
            type="button"
            className="clear-btn"
            onClick={clearInput}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}

        {/* Location button */}
        <button
          type="button"
          className="location-btn"
          onClick={onLocationClick}
          disabled={loading}
          aria-label="Use my location"
          title="Use my current location"
        >
          <LocateFixed size={16} />
        </button>

        {/* Divider */}
        <span className="form-divider" />

        {/* Search submit button */}
        <button
          type="submit"
          className="search-submit"
          disabled={loading}
          aria-label="Search weather"
        >
          {loading ? <RefreshCw size={16} className="spin" /> : <Search size={16} />}
        </button>
      </form>

      {/* Autocomplete dropdown */}
      {showDropdown && (
        <ul
          id="suggestions-list"
          className="suggestions-dropdown"
          role="listbox"
          aria-label="City suggestions"
        >
          {sugLoading ? (
            <li className="suggestion-loading">Searchingâ€¦</li>
          ) : (
            suggestions.map((s, i) => (
              <li
                key={`${s.lat}-${s.lon}`}
                id={`suggestion-${i}`}
                className={`suggestion-item${i === activeIndex ? " active" : ""}`}
                role="option"
                aria-selected={i === activeIndex}
                onMouseDown={() => selectSuggestion(s)} // mousedown fires before blur
              >
                <Search size={13} className="sug-icon" />
                <span className="sug-name">{s.name}</span>
                {s.state && <span className="sug-state">{s.state}</span>}
                <span className="sug-country">{s.country}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

