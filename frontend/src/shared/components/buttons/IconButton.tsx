import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'md',
  variant = 'ghost',
  className,
  ...props
}) => {
  const sizeClass = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl',
  }[size];

  const variantClass = {
    primary: 'bg-primary-yellow text-gray-900 hover:bg-opacity-90',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
  }[variant];

  return (
    <button
      {...props}
      className={`${sizeClass} ${variantClass} rounded-lg flex items-center justify-center transition-all ${className}`}
    >
      {icon}
    </button>
  );
};

