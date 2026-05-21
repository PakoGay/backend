import React, { useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, sidebar }) => {
  const [sidebarOpen] = useState(true);

  return (
    <div className="container-admin flex h-screen">
      {sidebar && (
        <div
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } transition-all duration-300 overflow-hidden bg-admin-dark border-r border-admin-gray`}
        >
          {sidebar}
        </div>
      )}
      <div className="flex-1 overflow-auto bg-admin-dark">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

