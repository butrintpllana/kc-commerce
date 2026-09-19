import { createContext, useCallback, useContext, useRef, useState } from 'react';
import ToastContainer from '../components/toast/ToastContainer';

const ToastContext = createContext(null);
const DEFAULT_DURATION = 3500;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'info', options = {}) => {
      const { duration = DEFAULT_DURATION, action = null } = options;
      const id = ++idRef.current;

      setToasts((current) => [...current, { id, message, type, action }]);

      if (duration > 0) {
        setTimeout(() => dismissToast(id), duration);
      }

      return id;
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
