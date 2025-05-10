// src/components/layout/Header.jsx
import React from 'react';

const Header = ({ activeTab }) => {
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

  return (
    <header className="flex items-center justify-between px-4 h-16 bg-white border-b border-gray-200">
      <h1 className="text-xl font-semibold">{getTitle()}</h1>
      <div className="flex items-center space-x-4">
        {/* Profile icon or additional actions could go here */}
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-xs">DR</span>
        </div>
      </div>
    </header>
  );
};

export default Header;