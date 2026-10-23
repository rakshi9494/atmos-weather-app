// ─── useWeather.js ────────────────────────────────────────────────────────────
// Central hook that manages all API calls (current weather, forecast, AQI, alerts)
// and exposes loading / error states to the rest of the app.

import { useState, useCallback } from "react";
import { getDailyForecast, getHourlyForecast } from "../utils/weatherHelpers";

const BASE = "https://api.openweathermap.org";

// ─── Key resolution ──────────────────────────────────────────────────────────
export function getActiveKey() {
  const envKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (envKey && envKey !== "your_api_key_here" && envKey.trim().length > 10) {
    return envKey.trim();
  }
  try {
    const stored = window.localStorage.getItem("atmos_user_api_key");
    if (stored && stored.trim() && stored !== "your_api_key_here") {
      return stored.trim();
    }
  } catch {
    // ignore
  }
  return null;
}

// ─── Realistic Sample Data (for preview when API key is not yet configured) ─
export const SAMPLE_DATA = {
  isDemoMode: true,
  current: {
    name: "Hyderabad",
    timezone: 19800,
    dt: Math.floor(Date.now() / 1000),
    sys: {
      country: "IN",
      sunrise: Math.floor(Date.now() / 1000) - 21600,
      sunset: Math.floor(Date.now() / 1000) + 18000,
    },
    main: {
      temp: 28,
      feels_like: 30,
      temp_min: 23,
      temp_max: 32,
      pressure: 1012,
      humidity: 62,
    },
    weather: [
      {
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    wind: {
      speed: 3.5,
      deg: 130,
      gust: 5.1,
    },
    visibility: 9500,
    rain: { "1h": 0 },
  },
  dailyForecast: [
    { date: "2026-10-23", day: "Today", dayShort: "Fri 23", temp: 28, tempMax: 32, tempMin: 23, description: "clear sky", icon: "01d", pop: 0, humidity: 62 },
    { date: "2026-10-24", day: "Sat", dayShort: "Sat 24", temp: 29, tempMax: 33, tempMin: 24, description: "few clouds", icon: "02d", pop: 10, humidity: 58 },
    { date: "2026-10-25", day: "Sun", dayShort: "Sun 25", temp: 27, tempMax: 30, tempMin: 23, description: "scattered clouds", icon: "03d", pop: 20, humidity: 65 },
    { date: "2026-10-26", day: "Mon", dayShort: "Mon 26", temp: 26, tempMax: 29, tempMin: 22, description: "light rain", icon: "10d", pop: 65, humidity: 76 },
    { date: "2026-10-27", day: "Tue", dayShort: "Tue 27", temp: 28, tempMax: 31, tempMin: 24, description: "partly cloudy", icon: "02d", pop: 15, humidity: 60 },
  ],
  hourlyForecast: [
    { time: "Now", dt: 1, temp: 28, icon: "01d", description: "clear sky", pop: 0, humidity: 62 },
    { time: "18:00", dt: 2, temp: 27, icon: "01d", description: "clear sky", pop: 0, humidity: 64 },
    { time: "21:00", dt: 3, temp: 25, icon: "01n", description: "clear sky", pop: 5, humidity: 70 },
    { time: "00:00", dt: 4, temp: 24, icon: "02n", description: "few clouds", pop: 10, humidity: 75 },
    { time: "03:00", dt: 5, temp: 23, icon: "02n", description: "few clouds", pop: 10, humidity: 78 },
    { time: "06:00", dt: 6, temp: 24, icon: "01d", description: "clear sky", pop: 0, humidity: 74 },
    { time: "09:00", dt: 7, temp: 27, icon: "01d", description: "clear sky", pop: 0, humidity: 65 },
    { time: "12:00", dt: 8, temp: 31, icon: "02d", description: "few clouds", pop: 5, humidity: 55 },
  ],
  aqi: {
    main: { aqi: 2 },
    components: {
      pm2_5: 18.4,
      pm10: 32.1,
      no2: 12.3,
      o3: 45.6,
      co: 320.0,
      so2: 5.2,
    },
  },
  alerts: [
    {
      event: "High UV Index Warning",
      sender_name: "National Meteorological Center",
      start: Math.floor(Date.now() / 1000) - 3600,
      end: Math.floor(Date.now() / 1000) + 14400,
      description: "Moderate to high UV levels expected. Wear protective eyewear and sun protection during midday peak.",
    },
  ],
};

const POPULAR_CITIES = [
  { name: "Hyderabad", state: "Telangana", country: "IN", lat: 17.385, lon: 78.4867 },
  { name: "Mumbai", state: "Maharashtra", country: "IN", lat: 19.076, lon: 72.8777 },
  { name: "Delhi", state: "Delhi", country: "IN", lat: 28.6139, lon: 77.209 },
  { name: "Bengaluru", state: "Karnataka", country: "IN", lat: 12.9716, lon: 77.5946 },
  { name: "London", state: "England", country: "GB", lat: 51.5074, lon: -0.1278 },
  { name: "New York", state: "New York", country: "US", lat: 40.7128, lon: -74.006 },
  { name: "Tokyo", state: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503 },
  { name: "Paris", state: "Île-de-France", country: "FR", lat: 48.8566, lon: 2.3522 },
];

// ─── Geocoding (search suggestions) ─────────────────────────────────────────
export async function fetchSuggestions(query) {
  if (!query || query.trim().length < 2) return [];
  const key = getActiveKey();
  if (!key) {
    // Return filtered popular cities for immediate interactive feedback
    const q = query.trim().toLowerCase();
    return POPULAR_CITIES.filter((c) => c.name.toLowerCase().includes(q)).map((c) => ({
      ...c,
      label: [c.name, c.state, c.country].filter(Boolean).join(", "),
    }));
  }

  try {
    const url = `${BASE}/geo/1.0/direct?q=${encodeURIComponent(query.trim())}&limit=5&appid=${key}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((item) => ({
      name: item.name,
      state: item.state || "",
      country: item.country,
      lat: item.lat,
      lon: item.lon,
      label: [item.name, item.state, item.country].filter(Boolean).join(", "),
    }));
  } catch {
    return [];
  }
}

// ─── Reverse geocoding (lat/lon → city name) ─────────────────────────────────
export async function reverseGeocode(lat, lon) {
  const key = getActiveKey();
  if (!key) return null;
  try {
    const url = `${BASE}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${key}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data[0] || null;
  } catch {
    return null;
  }
}

// ─── Core weather fetch by city name ─────────────────────────────────────────
async function fetchByCity(city, key) {
  const q = encodeURIComponent(city.trim());
  const [curRes, fcRes] = await Promise.all([
    fetch(`${BASE}/data/2.5/weather?q=${q}&units=metric&appid=${key}`),
    fetch(`${BASE}/data/2.5/forecast?q=${q}&units=metric&appid=${key}`),
  ]);

  const curData = await curRes.json();
  if (!curRes.ok) {
    if (curRes.status === 404) throw new Error("City not found. Check spelling and try again.");
    if (curRes.status === 401) throw new Error("Invalid or inactive API key. Newly created keys can take 1–2 hours to activate.");
    throw new Error(curData.message || "Could not load current weather.");
  }

  const fcData = await fcRes.json();
  if (!fcRes.ok) throw new Error(fcData.message || "Could not load the forecast.");

  return { current: curData, forecast: fcData };
}

// ─── Core weather fetch by coordinates ───────────────────────────────────────
async function fetchByCoords(lat, lon, key) {
  const [curRes, fcRes] = await Promise.all([
    fetch(`${BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`),
    fetch(`${BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}`),
  ]);

  const curData = await curRes.json();
  if (!curRes.ok) throw new Error(curData.message || "Could not load weather for this location.");

  const fcData = await fcRes.json();
  if (!fcRes.ok) throw new Error(fcData.message || "Could not load the forecast.");

  return { current: curData, forecast: fcData };
}

// ─── Air Quality fetch ────────────────────────────────────────────────────────
async function fetchAirQuality(lat, lon, key) {
  try {
    const res = await fetch(
      `${BASE}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.list?.[0] || null;
  } catch {
    return null;
  }
}

// ─── Alerts fetch ─────────────────────────────────────────────────────────────
async function fetchAlerts(lat, lon, key) {
  try {
    const res = await fetch(
      `${BASE}/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,current&appid=${key}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.alerts || [];
  } catch {
    return [];
  }
}

// ─── Main hook ────────────────────────────────────────────────────────────────
export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);

  /** Process API data into UI shape. */
  async function processAndSet(rawCurrent, rawForecast, key) {
    const lat = rawCurrent.coord.lat;
    const lon = rawCurrent.coord.lon;

    const [aqi, alerts] = await Promise.all([
      fetchAirQuality(lat, lon, key),
      fetchAlerts(lat, lon, key),
    ]);

    setWeather({
      current: rawCurrent,
      dailyForecast: getDailyForecast(rawForecast.list),
      hourlyForecast: getHourlyForecast(rawForecast.list, 8),
      aqi,
      alerts,
    });
    setIsDemoMode(false);
  }

  /** Fetch weather by city name. */
  const loadByCity = useCallback(async (cityName) => {
    if (!cityName?.trim()) {
      setError("Please enter a city name.");
      return null;
    }

    const key = getActiveKey();
    if (!key) {
      // Load sample preview data with clear demo flag
      setLoading(true);
      setError("");
      setTimeout(() => {
        setWeather({
          ...SAMPLE_DATA,
          current: {
            ...SAMPLE_DATA.current,
            name: cityName.trim().charAt(0).toUpperCase() + cityName.trim().slice(1),
          },
        });
        setIsDemoMode(true);
        setLoading(false);
      }, 300);
      return cityName.trim();
    }

    setLoading(true);
    setError("");
    try {
      const { current, forecast } = await fetchByCity(cityName, key);
      await processAndSet(current, forecast, key);
      return current.name;
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Fetch weather by coordinates (geolocation). */
  const loadByCoords = useCallback(async (lat, lon) => {
    const key = getActiveKey();
    if (!key) {
      setWeather(SAMPLE_DATA);
      setIsDemoMode(true);
      return "Hyderabad";
    }

    setLoading(true);
    setError("");
    try {
      const { current, forecast } = await fetchByCoords(lat, lon, key);
      await processAndSet(current, forecast, key);
      return current.name;
    } catch (err) {
      setError(err.message || "Could not get weather for your location.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveApiKey = useCallback((newKey) => {
    if (!newKey || !newKey.trim()) {
      window.localStorage.removeItem("atmos_user_api_key");
    } else {
      window.localStorage.setItem("atmos_user_api_key", newKey.trim());
    }
    setError("");
  }, []);

  const clearError = useCallback(() => setError(""), []);

  return {
    weather,
    loading,
    error,
    isDemoMode,
    loadByCity,
    loadByCoords,
    saveApiKey,
    clearError,
  };
}
