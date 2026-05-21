import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'px-6 py-3 text-gray-900 hover:bg-gray-100 rounded-lg transition-all',
  }[variant];

  const sizeClass = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-6 py-3',
    lg: 'text-lg px-8 py-4',
  }[size];

  const widthClass = fullWidth ? 'w-full' : '';
  const loadingClass = isLoading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${variantClass} ${sizeClass} ${widthClass} ${loadingClass} ${className}`}
    >
      {isLoading ? <span className="inline-block animate-spin mr-2">⏳</span> : null}
      {children}
    </button>
  );
};

