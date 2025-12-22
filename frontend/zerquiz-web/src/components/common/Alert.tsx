import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast as toastify } from 'react-toastify';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  icon,
  onClose,
  className = '',
}) => {
  const variants = {
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-900',
      iconColor: 'text-blue-500',
      Icon: Info,
    },
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-900',
      iconColor: 'text-green-500',
      Icon: CheckCircle,
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-900',
      iconColor: 'text-yellow-500',
      Icon: AlertCircle,
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-900',
      iconColor: 'text-red-500',
      Icon: XCircle,
    },
  };

  const variant = variants[type];
  const IconComponent = icon || <variant.Icon className="w-5 h-5" />;

  return (
    <div className={`${variant.bg} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className={variant.iconColor}>{IconComponent}</div>
        <div className="flex-1">
          {title && <h4 className={`font-semibold ${variant.text} mb-1`}>{title}</h4>}
          <p className={`text-sm ${variant.text}`}>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${variant.iconColor} hover:opacity-70 transition`}
            aria-label="Kapat"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// Toast Notification
interface ToastProps {
  type?: AlertType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type = 'info', message, duration = 3000, onClose }) => {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const variants = {
    info: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`${variants[type]} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]`}
    >
      <span className="flex-1 text-sm font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="hover:bg-white/20 rounded p-1 transition"
          aria-label="Kapat"
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};

// Toast Container
interface ToastContainerProps {
  toasts: Array<{ id: string; type: AlertType; message: string }>;
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Toast API using react-toastify
export const toast = {
  success: (message: string) => toastify.success(message),
  error: (message: string) => toastify.error(message),
  info: (message: string) => toastify.info(message),
  warning: (message: string) => toastify.warning(message),
};

// Toast Provider Hook (for custom implementation if needed)
export const useToastProvider = () => {
  const [toasts, setToasts] = React.useState<Array<{ id: string; type: AlertType; message: string }>>([]);

  const addToast = (type: AlertType, message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, removeToast, addToast };
};

export default Alert;

