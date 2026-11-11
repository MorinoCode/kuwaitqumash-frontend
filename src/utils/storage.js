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

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch {
    return false;
  }
};

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

export const getMultipleStorageItems = (keys) => {
  const result = {};
  keys.forEach((key) => {
    result[key] = getStorageItem(key);
  });
  return result;
};

export const setMultipleStorageItems = (items) => {
  let allSuccess = true;
  Object.entries(items).forEach(([key, value]) => {
    if (!setStorageItem(key, value)) {
      allSuccess = false;
    }
  });
  return allSuccess;
};
