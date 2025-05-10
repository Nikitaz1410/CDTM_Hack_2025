// src/components/layout/Header.jsx
import React from 'react';
import { LogOut, User } from 'lucide-react';

const Header = ({ activeTab, user, onLogout }) => {
  const getTitle = () => {
    switch(activeTab) {
      case 'documentScan':
        return 'Dokumente scannen';
      case 'myFacts':
        return 'Gesundheitsdaten';
      default:
        return 'Gesundheits-Tracker';
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'DR';

    // If email exists, use email for initials
    if (user.email) {
      const username = user.email.split('@')[0];
      const names = username.split('.');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return username.substring(0, 2).toUpperCase();
    }
    return 'DR';
  };

  // Get display name from email
  const getDisplayName = () => {
    if (!user || !user.email) return '';

    // Extract name from email (e.g., "luca.tester@example.com" -> "Luca Tester")
    const username = user.email.split('@')[0];
    const names = username.split('.');

    if (names.length >= 2) {
      return names.map(name =>
          name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
      ).join(' ');
    }

    return username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
  };

  return (
      <header className="flex items-center justify-between px-4 h-16 bg-white border-b border-gray-200">
        <h1 className="text-xl font-semibold">{getTitle()}</h1>
        <div className="flex items-center space-x-4">
          {/* User info */}
          {user && (
              <div className="hidden sm:block text-sm text-gray-600">
                {getDisplayName()}
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