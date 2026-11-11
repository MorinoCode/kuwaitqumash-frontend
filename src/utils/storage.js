/**
 * LocalStorage utility with error handling and type safety
 * Provides safe access to localStorage with fallbacks
 */

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} - Stored value or default
 */
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;

    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch {
    return defaultValue;
  }
};

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 * @returns {boolean} - Success status
 */
export const setStorageItem = (key, value) => {
  try {
    const serialized =
      typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch {
    return false;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} - Success status
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

/**
 * Clear all localStorage items (use with caution)
 * @returns {boolean} - Success status
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch {
    return false;
  }
};

/**
 * Clear auth-related items
 */
export const clearAuthStorage = () => {
  const authKeys = [
    "user_data",
    "tenant_id",
    "active_branch_id",
    "active_branch_name",
    "active_store_id",
    "token",
    "authToken",
  ];

  authKeys.forEach((key) => removeStorageItem(key));
};

/**
 * Get multiple items at once
 * @param {string[]} keys - Array of keys
 * @returns {object} - Object with key-value pairs
 */
export const getMultipleStorageItems = (keys) => {
  const result = {};
  keys.forEach((key) => {
    result[key] = getStorageItem(key);
  });
  return result;
};

/**
 * Set multiple items at once
 * @param {object} items - Object with key-value pairs
 * @returns {boolean} - Success status (true if all succeeded)
 */
export const setMultipleStorageItems = (items) => {
  let allSuccess = true;
  Object.entries(items).forEach(([key, value]) => {
    if (!setStorageItem(key, value)) {
      allSuccess = false;
    }
  });
  return allSuccess;
};
