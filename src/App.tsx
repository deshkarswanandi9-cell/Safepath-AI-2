import React, { useState } from 'react';
import { ScreenId, RouteOption } from './types';
import { MOCK_ROUTES } from './data/mockData';
import { LanguageProvider } from './context/LanguageContext';
import { MobileFrame } from './components/MobileFrame';
import { SplashScreen } from './components/screens/SplashScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { RouteSearchScreen } from './components/screens/RouteSearchScreen';
import { RouteComparisonScreen } from './components/screens/RouteComparisonScreen';
import { ShapExplainabilityScreen } from './components/screens/ShapExplainabilityScreen';
import { LiveNavigationScreen } from './components/screens/LiveNavigationScreen';
import { SafetyAlertModal } from './components/screens/SafetyAlertModal';
import { DynamicReroutingScreen } from './components/screens/DynamicReroutingScreen';
import { SafetyCheckInScreen } from './components/screens/SafetyCheckInScreen';
import { EmergencySosScreen } from './components/screens/EmergencySosScreen';
import { TrustedContactsScreen } from './components/screens/TrustedContactsScreen';
import { SafetyAnalyticsScreen } from './components/screens/SafetyAnalyticsScreen';
import { ProfileSettingsScreen } from './components/screens/ProfileSettingsScreen';
import { FloatingAiAssistant } from './components/FloatingAiAssistant';
import { BottomNavBar } from './components/BottomNavBar';

function MainAppContent() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('splash');
  const [selectedRoute, setSelectedRoute] = useState<RouteOption>(MOCK_ROUTES[2]); // Default Route C (Recommended 93%)
  const [destination, setDestination] = useState('Westwood Residence, 88 Parkview');
  const [showAlertModal, setShowAlertModal] = useState(false);

  // Navigate to screen handler
  const handleNavigate = (screen: ScreenId) => {
    if (screen === 'safety_alert') {
      setShowAlertModal(true);
    } else {
      setCurrentScreen(screen);
    }
  };

  // Open SOS screen directly
  const handleOpenSos = () => {
    setCurrentScreen('emergency_sos');
  };

  // Trigger alert simulation
  const handleTriggerAlert = () => {
    setShowAlertModal(true);
  };

  // Trigger safety check-in simulation
  const handleTriggerCheckIn = () => {
    setCurrentScreen('safety_checkin');
  };

  // Confirm rerouting from Alert or Reroute screen
  const handleConfirmReroute = () => {
    setShowAlertModal(false);
    // Switch to optimal rerouted route C
    setSelectedRoute(MOCK_ROUTES[2]);
    setCurrentScreen('live_navigation');
  };

  return (
    <MobileFrame
      currentScreen={currentScreen}
      onSelectScreen={handleNavigate}
      onTriggerAlert={handleTriggerAlert}
      onTriggerCheckIn={handleTriggerCheckIn}
    >
      <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#F8FAFC]">
        {/* Active Screen Rendering */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {currentScreen === 'splash' && (
            <SplashScreen onNavigate={handleNavigate} />
          )}

          {currentScreen === 'login' && (
            <LoginScreen
              onNavigate={handleNavigate}
              onLoginSuccess={() => setCurrentScreen('dashboard')}
            />
          )}

          {currentScreen === 'dashboard' && (
            <DashboardScreen
              onNavigate={handleNavigate}
              onOpenSos={handleOpenSos}
            />
          )}

          {currentScreen === 'route_search' && (
            <RouteSearchScreen
              onNavigate={handleNavigate}
              destination={destination}
              setDestination={setDestination}
              onGenerateRoutes={() => setSelectedRoute(MOCK_ROUTES[2])}
            />
          )}

          {currentScreen === 'route_comparison' && (
            <RouteComparisonScreen
              onNavigate={handleNavigate}
              selectedRoute={selectedRoute}
              onSelectRoute={setSelectedRoute}
            />
          )}

          {currentScreen === 'shap_explain' && (
            <ShapExplainabilityScreen onNavigate={handleNavigate} />
          )}

          {currentScreen === 'live_navigation' && (
            <LiveNavigationScreen
              onNavigate={handleNavigate}
              selectedRoute={selectedRoute}
              onTriggerAlert={handleTriggerAlert}
              onTriggerCheckIn={handleTriggerCheckIn}
              onOpenSos={handleOpenSos}
            />
          )}

          {currentScreen === 'dynamic_reroute' && (
            <DynamicReroutingScreen
              onNavigate={handleNavigate}
              onConfirmReroute={handleConfirmReroute}
            />
          )}

          {currentScreen === 'safety_checkin' && (
            <SafetyCheckInScreen
              onNavigate={handleNavigate}
              onSafe={() => setCurrentScreen('live_navigation')}
              onNeedHelp={handleOpenSos}
            />
          )}

          {currentScreen === 'emergency_sos' && (
            <EmergencySosScreen onNavigate={handleNavigate} />
          )}

          {currentScreen === 'trusted_contacts' && (
            <TrustedContactsScreen onNavigate={handleNavigate} />
          )}

          {currentScreen === 'safety_analytics' && (
            <SafetyAnalyticsScreen onNavigate={handleNavigate} />
          )}

          {currentScreen === 'profile_settings' && (
            <ProfileSettingsScreen
              onNavigate={handleNavigate}
              onLogout={() => setCurrentScreen('login')}
            />
          )}
        </div>

        {/* Global Modal: Screen 8 Safety Alert Warning */}
        <SafetyAlertModal
          isOpen={showAlertModal}
          onClose={() => setShowAlertModal(false)}
          onRecalculate={() => {
            setShowAlertModal(false);
            setCurrentScreen('dynamic_reroute');
          }}
        />

        {/* Bottom Persistent Navigation Bar (5 tabs) */}
        <BottomNavBar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          onOpenSos={handleOpenSos}
        />

        {/* Floating AI Assistant Copilot */}
        {currentScreen !== 'splash' && (
          <FloatingAiAssistant />
        )}
      </div>
    </MobileFrame>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainAppContent />
    </LanguageProvider>
  );
}
