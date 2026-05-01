import { useState, useEffect } from "react";

/**
 * Returns a debounced copy of `value` that only updates after `delay` ms of
 * inactivity. Useful for delaying API calls while the user is still typing.
 *
 * @param value - The raw value to debounce.
 * @param delay - Debounce window in milliseconds (default 350).
 */
export function useDebounce<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}































































































































