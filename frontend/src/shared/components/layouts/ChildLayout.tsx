import React from 'react';

interface ChildLayoutProps {
  children: React.ReactNode;
  topBar?: React.ReactNode;
  bottomNav?: React.ReactNode;
}

export const ChildLayout: React.FC<ChildLayoutProps> = ({ children, topBar, bottomNav }) => {
  return (
    <div className="container-child min-h-screen flex flex-col">
      {topBar && (
        <div className="bg-white/90 backdrop-blur shadow-md">
          {topBar}
        </div>
      )}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {children}
      </div>
      {bottomNav && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur shadow-lg md:hidden">
          {bottomNav}
        </div>
      )}
    </div>
  );
};

