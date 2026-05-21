import React, { useState } from 'react';

interface ParentLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const ParentLayout: React.FC<ParentLayoutProps> = ({ children, sidebar }) => {
  const [sidebarOpen] = useState(true);

  return (
    <div className="container-parent flex">
      {sidebar && (
        <div
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}
        >
          {sidebar}
        </div>
      )}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

