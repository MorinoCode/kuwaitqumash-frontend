export const confirmDialog = (message, onConfirm, onCancel = null) => {

  const confirmed = window.confirm(message);

  if (confirmed) {
    onConfirm();
  } else if (onCancel) {
    onCancel();
  }
};

export const confirmToast = (message, onConfirm, onCancel = null) => {

  confirmDialog(message, onConfirm, onCancel);
};
