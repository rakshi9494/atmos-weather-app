// ─── App.jsx ──────────────────────────────────────────────────────────────────
// Root component. Wires all hooks and components together.
// All state that persists across sessions is stored in localStorage.

import React, { useEffect, useState, useCallback } from "react";
import { CloudSun, Key, X, ExternalLink } from "lucide-react";

// ── Hooks ─────────────────────────────────────────────────────────────────────
import { useWeather, getActiveKey } from "./hooks/useWeather";
import { useLocalStorage } from "./hooks/useLocalStorage";

// ── Components ────────────────────────────────────────────────────────────────
import Topbar           from "./components/Topbar/Topbar";
import SearchBar        from "./components/SearchBar/SearchBar";
import CurrentWeather   from "./components/CurrentWeather/CurrentWeather";
import HourlyForecast   from "./components/HourlyForecast/HourlyForecast";
import DailyForecast    from "./components/DailyForecast/DailyForecast";
import WeatherDetails   from "./components/WeatherDetails/WeatherDetails";
import AirQuality       from "./components/AirQuality/AirQuality";
import SunriseSunset    from "./components/SunriseSunset/SunriseSunset";
import WeatherAlerts    from "./components/WeatherAlerts/WeatherAlerts";
import FavoriteCities   from "./components/FavoriteCities/FavoriteCities";
import RecentSearches   from "./components/RecentSearches/RecentSearches";
import SkeletonLoader   from "./components/SkeletonLoader/SkeletonLoader";
import Footer           from "./components/Footer/Footer";

import { getWeatherBgClass } from "./utils/weatherHelpers";
import "./App.css";

const MAX_RECENT = 6;

export default function App() {
  // ── Persistent preferences (localStorage) ─────────────────────────────────
  const [isDark, setIsDark]         = useLocalStorage("atmos-dark-mode", true);
  const [unit, setUnit]             = useLocalStorage("atmos-unit", "C");
  const [favorites, setFavorites]   = useLocalStorage("atmos-favorites", []);
  const [recent, setRecent]         = useLocalStorage("atmos-recent", []);

  // ── API Key modal state ───────────────────────────────────────────────────
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput]         = useState(() => getActiveKey() || "");

  // ── Weather state ─────────────────────────────────────────────────────────
  const {
    weather,
    loading,
    error,
    isDemoMode,
    loadByCity,
    loadByCoords,
    saveApiKey,
    clearError,
  } = useWeather();

  const current         = weather?.current;
  const dailyForecast   = weather?.dailyForecast  || [];
  const hourlyForecast  = weather?.hourlyForecast || [];
  const aqi             = weather?.aqi;
  const alerts          = weather?.alerts || [];
  const currentCityName = current?.name || "";

  // ── Apply theme class to <html> ───────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle("light-mode", !isDark);
  }, [isDark]);

  // ── Load default city on mount ────────────────────────────────────────────
  useEffect(() => {
    loadByCity("Hyderabad");
  }, [loadByCity]);

  // ── Search handler ────────────────────────────────────────────────────────
  const handleSearch = useCallback(async (cityName) => {
    const resolved = await loadByCity(cityName);
    if (resolved) {
      setRecent((prev) => {
        const filtered = prev.filter((c) => c.toLowerCase() !== resolved.toLowerCase());
        return [resolved, ...filtered].slice(0, MAX_RECENT);
      });
    }
  }, [loadByCity, setRecent]);

  // ── Geolocation handler ───────────────────────────────────────────────────
  function handleUseLocation() {
    clearError();
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const resolvedName = await loadByCoords(coords.latitude, coords.longitude);
        if (resolvedName) {
          setRecent((prev) => {
            const filtered = prev.filter((c) => c.toLowerCase() !== resolvedName.toLowerCase());
            return [resolvedName, ...filtered].slice(0, MAX_RECENT);
          });
        }
      },
      () => {
        // Geolocation denied
      },
      { timeout: 10000 }
    );
  }

  // ── Save API Key ──────────────────────────────────────────────────────────
  function handleSaveKey(e) {
    e.preventDefault();
    saveApiKey(keyInput);
    setShowKeyModal(false);
    loadByCity(currentCityName || "Hyderabad");
  }

  // ── Favorites management ──────────────────────────────────────────────────
  function addFavorite() {
    if (!currentCityName) return;
    setFavorites((prev) => {
      if (prev.some((f) => f.toLowerCase() === currentCityName.toLowerCase())) return prev;
      return [...prev, currentCityName];
    });
  }

  function removeFavorite(city) {
    setFavorites((prev) => prev.filter((f) => f.toLowerCase() !== city.toLowerCase()));
  }

  // ── Background class based on current weather condition ───────────────────
  const bgClass = current
    ? getWeatherBgClass(current.weather[0].main, isDark)
    : isDark ? "bg-default-dark" : "bg-default-light";

  return (
    <main className={`app-shell ${bgClass} ${isDark ? "theme-dark" : "theme-light"}`}>
      {/* Ambient decorative blobs */}
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <div className="dashboard">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <Topbar
          unit={unit}
          onUnitToggle={() => setUnit((u) => (u === "C" ? "F" : "C"))}
          isDark={isDark}
          onThemeToggle={() => setIsDark((d) => !d)}
          onOpenKeyModal={() => setShowKeyModal(true)}
          isDemoMode={isDemoMode}
        />

        {/* ── Demo / Preview Mode Notice ─────────────────────────────────── */}
        {isDemoMode && (
          <div className="demo-banner">
            <div className="demo-banner-content">
              <span className="demo-banner-tag">PREVIEW MODE</span>
              <p>
                Displaying sample weather data for portfolio demonstration. Add your free OpenWeather API key to connect live real-time conditions.
              </p>
            </div>
            <button
              className="demo-banner-btn"
              onClick={() => setShowKeyModal(true)}
            >
              <Key size={14} /> Add API Key
            </button>
          </div>
        )}

        {/* ── Hero intro + search row ─────────────────────────────────────── */}
        <section className="intro-row">
          <div className="intro-text">
            <p className="eyebrow">WEATHER OVERVIEW</p>
            <h1>
              Forecast made <span>beautiful.</span>
            </h1>
            <p className="intro-copy">A little clarity for whatever the day brings.</p>
          </div>

          <div className="search-area">
            <SearchBar
              onSearch={handleSearch}
              onLocationClick={handleUseLocation}
              loading={loading}
            />
            <RecentSearches
              recent={recent}
              onSelect={handleSearch}
              onClear={() => setRecent([])}
            />
          </div>
        </section>

        {/* ── Weather Alerts ──────────────────────────────────────────────── */}
        <WeatherAlerts alerts={alerts} />

        {/* ── Error banner ────────────────────────────────────────────────── */}
        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button onClick={clearError} aria-label="Dismiss error">
              Dismiss
            </button>
          </div>
        )}

        {/* ── Loading Skeleton ────────────────────────────────────────────── */}
        {loading && !current ? (
          <SkeletonLoader />
        ) : current ? (
          <>
            {/* ── Main grid: current weather + sunrise/sunset ─────────────── */}
            <section className="main-grid">
              <CurrentWeather current={current} unit={unit} />
              <SunriseSunset current={current} />
            </section>

            {/* ── Hourly forecast ─────────────────────────────────────────── */}
            <HourlyForecast hourly={hourlyForecast} unit={unit} />

            {/* ── Weather details metrics ─────────────────────────────────── */}
            <WeatherDetails current={current} />

            {/* ── Air Quality + Favorites row ─────────────────────────────── */}
            <div className="aqi-fav-row">
              <div className="aqi-col">
                <AirQuality aqi={aqi} />
              </div>
              <div className="fav-col">
                <FavoriteCities
                  favorites={favorites}
                  currentCity={currentCityName}
                  onSelect={handleSearch}
                  onAdd={addFavorite}
                  onRemove={removeFavorite}
                />
              </div>
            </div>

            {/* ── 5-day daily forecast ────────────────────────────────────── */}
            <DailyForecast daily={dailyForecast} unit={unit} />
          </>
        ) : (
          /* ── Empty state ────────────────────────────────────────────────── */
          <section className="empty-state glass-card">
            <CloudSun size={44} />
            <h2>Your forecast is waiting</h2>
            <p>Search for any city to see its current weather, hourly and 5-day forecast.</p>
            <button
              className="empty-cta"
              onClick={() => handleSearch("Hyderabad")}
            >
              Try Hyderabad
            </button>
          </section>
        )}

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <Footer />
      </div>

      {/* ── API Key Modal ─────────────────────────────────────────────────── */}
      {showKeyModal && (
        <div className="modal-backdrop" onClick={() => setShowKeyModal(false)}>
          <div className="modal-card glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="modal-icon"><Key size={18} /></span>
                <h3>OpenWeather API Key</h3>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setShowKeyModal(false)}
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            <p className="modal-description">
              Enter your free OpenWeather API key below. The key is saved locally in your browser’s <code>localStorage</code> (or via <code>.env</code>) and will never be exposed.
            </p>

            <form onSubmit={handleSaveKey} className="modal-form">
              <input
                type="text"
                placeholder="Paste API key here (e.g. 5d8f2...)"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="modal-input"
                autoFocus
              />

              <div className="modal-footer-actions">
                <a
                  href="https://openweathermap.org/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-ext-link"
                >
                  Get free API key <ExternalLink size={12} />
                </a>

                <div className="modal-btn-row">
                  <button
                    type="button"
                    className="modal-cancel-btn"
                    onClick={() => setShowKeyModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="modal-submit-btn">
                    Save &amp; Connect Live
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
