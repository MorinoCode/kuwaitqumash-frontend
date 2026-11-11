/**
 * Confirm dialog utility using toast notifications
 * Provides a better UX alternative to window.confirm
 */

export const confirmDialog = (message, onConfirm, onCancel = null) => {
  // For now, use window.confirm as fallback
  // In future, replace with a proper modal component
  const confirmed = window.confirm(message);
  
  if (confirmed) {
    onConfirm();
  } else if (onCancel) {
    onCancel();
  }
};

/**
 * Show a confirmation toast with action buttons
 * This is a better UX but requires a custom toast component
 * 
 * @param {string} message - Confirmation message
 * @param {Function} onConfirm - Callback when confirmed
 * @param {Function} onCancel - Optional callback when cancelled
 */
export const confirmToast = (message, onConfirm, onCancel = null) => {
  // This would require a custom toast component with buttons
  // For now, fallback to window.confirm
  confirmDialog(message, onConfirm, onCancel);
};
