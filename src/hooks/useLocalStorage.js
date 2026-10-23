// ─── useLocalStorage.js ───────────────────────────────────────────────────────
// A simple custom hook that keeps state in sync with localStorage.
// Usage: const [value, setValue] = useLocalStorage("key", defaultValue);

import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // localStorage might be full or unavailable in private mode
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
