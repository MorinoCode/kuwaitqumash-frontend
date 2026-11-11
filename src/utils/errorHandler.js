export const handleApiError = (error) => {
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return 'Network error. Please check your internet connection and ensure the server is running.';
  }

  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timeout. Please try again.';
  }

  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || '';

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

  if (error.request) {
    return 'No response from server. Please check your connection and try again.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
};

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

export const isNetworkError = (error) => {
  return error?.code === 'ERR_NETWORK' ||
         error?.message === 'Network Error' ||
         error?.code === 'ECONNABORTED';
};

export const isAuthError = (error) => {
  return error?.response?.status === 401 || error?.response?.status === 403;
};
