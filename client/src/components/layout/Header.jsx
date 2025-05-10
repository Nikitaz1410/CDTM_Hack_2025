// src/components/layout/Header.jsx
import React from 'react';
import { LogOut, User } from 'lucide-react';

const Header = ({ activeTab, user, onLogout }) => {
  const getTitle = () => {
    switch(activeTab) {
      case 'chat':
        return 'Chat';
      case 'documentScan':
        return 'Document Scan';
      case 'myFacts':
        return 'My Facts';
      default:
        return 'Health Tracker';
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'DR';
    if (user.username) {
      const names = user.username.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'DR';
  };

  return (
      <header className="flex items-center justify-between px-4 h-16 bg-white border-b border-gray-200">
        <h1 className="text-xl font-semibold">{getTitle()}</h1>
        <div className="flex items-center space-x-4">
          {/* User info */}
          {user && (
              <div className="hidden sm:block text-sm text-gray-600">
                {user.username}
              </div>
          )}

          {/* Logout button */}
          <button
              onClick={onLogout}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Logout"
          >
            <LogOut size={20} className="text-gray-600" />
          </button>

          {/* Profile avatar */}
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700">{getUserInitials()}</span>
          </div>
        </div>
      </header>
  );
};

export default Header;