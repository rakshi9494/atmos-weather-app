// ─── weatherHelpers.js ────────────────────────────────────────────────────────
// Pure utility functions used across the app.
// No API calls here – just data formatting and transformation.

/** Returns the OpenWeather icon URL for a given icon code. */
export function weatherIconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

/** Converts a Unix timestamp + timezone offset (seconds) to a local time string. */
export function formatTime(unix, timezoneOffset) {
  if (!unix) return "—";
  const date = new Date((unix + timezoneOffset) * 1000);
  return date.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Formats a date string or Date into a short weekday label. */
export function formatDay(dateText, isToday = false) {
  if (isToday) return "Today";
  return new Date(dateText).toLocaleDateString("en-US", { weekday: "short" });
}

/** Formats a date string into "Mon 23" style. */
export function formatDayShort(dateText) {
  const d = new Date(dateText);
  return d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
}

/**
 * Converts Celsius to the requested unit.
 * @param {number} celsius
 * @param {"C"|"F"} unit
 */
export function convertTemp(celsius, unit) {
  if (celsius == null) return "—";
  return unit === "C" ? Math.round(celsius) : Math.round((celsius * 9) / 5 + 32);
}

/**
 * Groups the 3-hourly forecast list into daily summaries (up to 5 days).
 * Prefers the midday entry for each day.
 */
export function getDailyForecast(list = []) {
  const groups = new Map();
  list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!groups.has(date)) groups.set(date, []);
    groups.get(date).push(item);
  });

  return Array.from(groups.entries())
    .slice(0, 5)
    .map(([date, entries], index) => {
      const midday = entries.find((e) => e.dt_txt.includes("12:00:00"));
      const sel = midday || entries[Math.floor(entries.length / 2)];
      const temps = entries.map((e) => e.main.temp);
      return {
        date,
        day: formatDay(date, index === 0),
        dayShort: formatDayShort(date),
        temp: Math.round(sel.main.temp),
        tempMax: Math.round(Math.max(...temps)),
        tempMin: Math.round(Math.min(...temps)),
        description: sel.weather[0].description,
        icon: sel.weather[0].icon,
        pop: Math.round((sel.pop || 0) * 100),
        humidity: sel.main.humidity,
      };
    });
}

/**
 * Extracts the next N hourly entries from the 3-hour interval list.
 * @param {Array} list – forecast list from OpenWeather /forecast endpoint
 * @param {number} count – how many hourly slots to return (default 8)
 */
export function getHourlyForecast(list = [], count = 8) {
  return list.slice(0, count).map((item) => ({
    time: item.dt_txt.split(" ")[1].slice(0, 5), // "HH:MM"
    dt: item.dt,
    temp: item.main.temp,
    icon: item.weather[0].icon,
    description: item.weather[0].description,
    pop: Math.round((item.pop || 0) * 100),
    humidity: item.main.humidity,
  }));
}

/**
 * Returns the CSS background-class name based on the main weather condition.
 * Used for dynamic weather backgrounds.
 */
export function getWeatherBgClass(weatherMain = "", isDark = true) {
  const w = weatherMain.toLowerCase();
  if (w.includes("thunder")) return "bg-thunder";
  if (w.includes("drizzle") || w.includes("rain")) return "bg-rain";
  if (w.includes("snow")) return "bg-snow";
  if (w.includes("mist") || w.includes("fog") || w.includes("haze")) return "bg-mist";
  if (w.includes("cloud")) return "bg-cloudy";
  if (w.includes("clear")) return isDark ? "bg-clear-night" : "bg-clear";
  return isDark ? "bg-default-dark" : "bg-default-light";
}

/**
 * Maps an AQI integer (1–5) to a label and CSS modifier class.
 * OpenWeather Air Pollution: 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
 */
export function getAqiInfo(aqi) {
  const map = {
    1: { label: "Good", cls: "aqi-good", desc: "Air quality is satisfactory, and air pollution poses little or no risk." },
    2: { label: "Fair", cls: "aqi-fair", desc: "Air quality is acceptable. Some pollutants may be a concern for very sensitive people." },
    3: { label: "Moderate", cls: "aqi-moderate", desc: "Sensitive groups may experience health effects. The general public is less likely to be affected." },
    4: { label: "Poor", cls: "aqi-poor", desc: "Everyone may begin to experience health effects. Sensitive groups may experience more serious effects." },
    5: { label: "Very Poor", cls: "aqi-very-poor", desc: "Health warnings of emergency conditions. The entire population is more likely to be affected." },
  };
  return map[aqi] || { label: "Unknown", cls: "aqi-unknown", desc: "AQI data not available." };
}

/** Calculates daylight duration string from sunrise and sunset unix times. */
export function getDaylightDuration(sunrise, sunset) {
  if (!sunrise || !sunset) return "—";
  const mins = Math.round((sunset - sunrise) / 60);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}
