/**
 * Centralized error handler utility for API errors
 * Provides consistent error handling across the application
 */

/**
 * Handle API errors and return user-friendly messages
 * @param {Error} error - The error object from axios
 * @returns {string} - User-friendly error message
 */
export const handleApiError = (error) => {
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  // Network errors (backend not running, no internet, etc.)
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return 'Network error. Please check your internet connection and ensure the server is running.';
  }

  // Request timeout
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timeout. Please try again.';
  }

  // Server responded with error
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || '';

    // Handle specific status codes
    switch (status) {
      case 400:
        return message || 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Session expired. Please login again.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return message || 'Resource not found.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
      case 502:
      case 503:
        return 'Server error. Please try again later.';
      default:
        return message || 'An error occurred. Please try again.';
    }
  }

  // Request was made but no response received
  if (error.request) {
    return 'No response from server. Please check your connection and try again.';
  }

  // Something else happened
  return error.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Extract error details for logging (development only)
 * @param {Error} error - The error object
 * @returns {object} - Error details object
 */
export const getErrorDetails = (error) => {
  if (!error) return null;

  return {
    message: error.message,
    code: error.code,
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    url: error.config?.url,
    method: error.config?.method
  };
};

/**
 * Check if error is a network error
 * @param {Error} error - The error object
 * @returns {boolean} - True if network error
 */
export const isNetworkError = (error) => {
  return error?.code === 'ERR_NETWORK' || 
         error?.message === 'Network Error' ||
         error?.code === 'ECONNABORTED';
};

/**
 * Check if error is an authentication error
 * @param {Error} error - The error object
 * @returns {boolean} - True if authentication error
 */
export const isAuthError = (error) => {
  return error?.response?.status === 401 || error?.response?.status === 403;
};
