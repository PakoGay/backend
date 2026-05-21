import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        {...props}
        className={`input-field resize-vertical min-h-32 ${error ? 'border-red-500' : ''} ${className}`}
      />
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
};

