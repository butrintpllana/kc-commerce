import './toast.css';

const ICONS = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
};

export default function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item toast-item--${toast.type}`}
          role="status"
        >
          <span className="toast-item__icon" aria-hidden="true">
            {ICONS[toast.type] || ICONS.info}
          </span>
          <span className="toast-item__message">{toast.message}</span>
          {toast.action && (
            <button
              className="toast-item__action"
              onClick={() => {
                toast.action.onClick();
                onDismiss(toast.id);
              }}
            >
              {toast.action.label}
            </button>
          )}
          <button
            className="toast-item__close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
