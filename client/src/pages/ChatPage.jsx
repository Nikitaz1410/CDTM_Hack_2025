// src/pages/ChatPage.jsx
import React from 'react';

const ChatPage = () => {
  const conversations = [
    { id: 1, name: 'Dr. Sarah Johnson', lastMessage: 'How are you feeling today?', time: '10:30 AM', unread: 2 },
    { id: 2, name: 'Dr. Michael Chen', lastMessage: 'Your test results look good!', time: 'Yesterday', unread: 0 },
    { id: 3, name: 'Dr. Emily Williams', lastMessage: 'Remember to take your medication', time: 'Monday', unread: 0 },
  ];

  return (
    <div className="p-4 pb-20">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>

      <div className="space-y-2">
        {conversations.map(chat => (
          <div key={chat.id} className="flex items-center p-3 bg-white rounded-lg shadow-sm cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold mr-3">
              {chat.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-medium">{chat.name}</h3>
                <span className="text-xs text-gray-500">{chat.time}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
            </div>
            {chat.unread > 0 && (
              <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center ml-2">
                {chat.unread}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatPage;