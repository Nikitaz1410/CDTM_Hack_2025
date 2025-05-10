// src/App.jsx
import React, { useState, useEffect } from 'react';
import TabBar from './components/layout/TabBar';
import DocumentScanPage from './pages/DocumentScanPage';
import MyFactsPage from './pages/MyFactsPage';
import Header from './components/layout/Header';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import LoginPage from './pages/LoginPage';
import authService from './services/authService';

const App = () => {
  const [activeTab, setActiveTab] = useState('myFacts');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewRegistration, setIsNewRegistration] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const authenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    setIsAuthenticated(authenticated);
    setUser(currentUser);
    setIsLoading(false);
  };

  // Handle login (existing users don't need onboarding)
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setIsNewRegistration(false);
    setShowOnboarding(false);
  };

  // Handle registration (new users need onboarding)
  const handleRegistration = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setIsNewRegistration(true);
    setShowOnboarding(true);
  };

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setShowOnboarding(false);
    setIsNewRegistration(false);
  };

  // Complete onboarding
  const completeOnboarding = async (onboardingData) => {
    try {
      // Save onboarding data to backend
      // Expected endpoints:
      // - PUT /api/users/me/complete-onboarding
      // - POST /api/meds/user/{userId}
      // - POST /api/blood/user/{userId}
      await authService.saveOnboardingData(onboardingData);

      setShowOnboarding(false);
      setIsNewRegistration(false);
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
      // Still complete onboarding to avoid blocking user
      setShowOnboarding(false);
      setIsNewRegistration(false);
    }
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage
        onLogin={handleLogin}
        onRegistration={handleRegistration}
    />;
  }

  // Show onboarding only for new registrations
  if (isNewRegistration && showOnboarding) {
    return <OnboardingFlow onComplete={completeOnboarding} />;
  }

  // Render regular app content
  const renderContent = () => {
    switch(activeTab) {
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
        <Header activeTab={activeTab} user={user} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
  );
};

export default App;