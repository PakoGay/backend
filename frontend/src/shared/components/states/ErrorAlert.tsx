import React from 'react';

interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
  type?: 'error' | 'warning' | 'info';
  dismissible?: boolean;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onClose,
  type = 'error',
  dismissible = true,
}) => {
  const bgClass = {
    error: 'bg-red-50 text-red-800',
    warning: 'bg-yellow-50 text-yellow-800',
    info: 'bg-blue-50 text-blue-800',
  }[type];

  const borderClass = {
    error: 'border-red-200',
    warning: 'border-yellow-200',
    info: 'border-blue-200',
  }[type];

  return (
    <div className={`${bgClass} ${borderClass} border rounded-lg p-4 flex items-center justify-between`}>
      <span className="text-sm font-medium">{message}</span>
      {dismissible && (
        <button
          onClick={onClose}
          className="text-sm font-bold underline hover:no-underline ml-4"
        >
          ✕
        </button>
      )}
    </div>
  );
};

