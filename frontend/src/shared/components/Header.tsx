import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/shared/components/buttons/Button';

interface HeaderProps {
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all ${
        transparent ? 'bg-transparent' : 'bg-white/90 backdrop-blur shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <span className="text-3xl">📚</span>
          <span className="bg-gradient-to-r from-primary-yellow via-primary-green to-primary-blue bg-clip-text text-transparent">
            Literacy Hub
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Features
          </a>
          <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
            About
          </a>
          <a href="#contact" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-gray-700 font-medium hidden sm:block">Hello, {user?.username}</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

