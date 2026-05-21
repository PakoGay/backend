import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, helperText, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        {...props}
        className={`input-field ${error ? 'border-red-500' : ''} ${className}`}
      />
      {error && <span className="text-sm text-red-600">{error}</span>}
      {helperText && !error && <span className="text-sm text-gray-500">{helperText}</span>}
    </div>
  );
};

