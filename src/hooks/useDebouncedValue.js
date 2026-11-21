import { useState, useEffect } from "react";

/**
 * Returns a debounced copy of `value` that only updates after `delayMs`
 * of inactivity — preventing API storms on every keystroke in search inputs.
 */
export const useDebouncedValue = (value, delayMs = 300) => {
  const [debounced, setDebounced] = useState(value);
  const isEmpty = value === "" || value === null || value === undefined;

  useEffect(() => {
    if (isEmpty) return undefined;

    const timer = setTimeout(() => {
      setDebounced(value);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [value, delayMs, isEmpty]);

  return isEmpty ? value : debounced;
};

export default useDebouncedValue;
