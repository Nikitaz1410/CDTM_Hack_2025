// src/App.jsx
import React, { useState, useEffect } from 'react';
import TabBar from './components/layout/TabBar';
import ChatPage from './pages/ChatPage';
import DocumentScanPage from './pages/DocumentScanPage';
import MyFactsPage from './pages/MyFactsPage';
import Header from './components/layout/Header';
import OnboardingFlow from './components/onboarding/OnboardingFlow';

const App = () => {
  const [activeTab, setActiveTab] = useState('myFacts');
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Function to complete onboarding
  const completeOnboarding = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setShowOnboarding(false);
  };

  // If user hasn't completed onboarding, show onboarding flow
  if (showOnboarding) {
    return <OnboardingFlow onComplete={completeOnboarding} />;
  }

  // Regular app content
  const renderContent = () => {
    switch(activeTab) {
      case 'chat':
        return <ChatPage />;
      case 'documentScan':
        return <DocumentScanPage />;
      case 'myFacts':
        return <MyFactsPage />;
      default:
        return <MyFactsPage />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header activeTab={activeTab} />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;