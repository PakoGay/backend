import React from 'react';

interface FloatingButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right';
  size?: 'md' | 'lg';
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  icon,
  onClick,
  label,
  position = 'bottom-right',
  size = 'lg',
}) => {
  const positionClass = {
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'top-right': 'top-8 right-8',
  }[position];

  const sizeClass = size === 'lg' ? 'w-16 h-16 text-2xl' : 'w-12 h-12 text-lg';

  return (
    <button
      onClick={onClick}
      className={`fixed ${positionClass} ${sizeClass} rounded-full bg-gradient-to-br from-primary-yellow to-primary-orange text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center`}
      title={label}
    >
      {icon}
    </button>
  );
};

