// src/components/layout/TabBar.jsx
import React from 'react';
import { MessageCircle, FileText, User } from 'lucide-react';

const TabBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'chat', label: 'Chat', icon: <MessageCircle /> },
    { id: 'documentScan', label: 'Scan', icon: <FileText /> },
    { id: 'myFacts', label: 'My Facts', icon: <User /> }
  ];

  return (
    <div className="flex justify-around items-center w-full h-16 bg-white border-t border-gray-200 fixed bottom-0 left-0">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeTab === tab.id ? 'text-blue-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <div className="w-6 h-6">{tab.icon}</div>
          <span className="text-xs mt-1">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabBar;