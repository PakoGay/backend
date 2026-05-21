import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {icon && <div className="text-6xl mb-4 opacity-50">{icon}</div>}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      {description && <p className="text-gray-600 mb-6 max-w-md text-center">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

