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

if (!isDevelopment) {

  const originalError = console.error;
  console.error = (...args) => {

    originalError(...args);
  };

  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.debug = () => {};
}

export default { log, error, warn, info, debug };
