/**
 * Logger utility that disables console.log in production
 * Use this instead of console.log/error/warn
 */

const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

export const log = (...args) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

export const error = (...args) => {
  if (isDevelopment) {
    console.error(...args);
  }
  // In production, you might want to send errors to a logging service
  // Example: sendToErrorTrackingService(...args);
};

export const warn = (...args) => {
  if (isDevelopment) {
    console.warn(...args);
  }
};

export const info = (...args) => {
  if (isDevelopment) {
    console.info(...args);
  }
};

export const debug = (...args) => {
  if (isDevelopment) {
    console.debug(...args);
  }
};

// Override console methods in production
if (!isDevelopment) {
  // Keep console.error for critical errors, but make it minimal
  const originalError = console.error;
  console.error = (...args) => {
    // Only log critical errors in production
    originalError(...args);
  };
  
  // Disable other console methods
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.debug = () => {};
}

export default { log, error, warn, info, debug };
