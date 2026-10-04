import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ScreenId, RouteOption } from './types';
import { MOCK_ROUTES } from './data/mockData';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
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
import { PublicGatheringHubScreen } from './components/screens/PublicGatheringHubScreen';
import { SafeHavenNetworkScreen } from './components/screens/SafeHavenNetworkScreen';
import { TransportCompanionScreen } from './components/screens/TransportCompanionScreen';
import { InfrastructureReportingScreen } from './components/screens/InfrastructureReportingScreen';
import { CommunitySafeWalkScreen } from './components/screens/CommunitySafeWalkScreen';
import { FloatingAiAssistant } from './components/FloatingAiAssistant';
import { BottomNavBar } from './components/BottomNavBar';
import { screenVariants, safetyScreenVariants } from './utils/motion';

function MainAppContent() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('splash');
  const [selectedRoute, setSelectedRoute] = useState<RouteOption>(MOCK_ROUTES[2]); // Default Route C (Recommended 93%)
  const [destination, setDestination] = useState('Westwood Residence, 88 Parkview');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const shouldReduceMotion = useReducedMotion();

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
    setSelectedRoute(MOCK_ROUTES[2]);
    setCurrentScreen('live_navigation');
  };

  // Check if current screen is a critical safety screen (requires instant interaction)
  const isSafetyScreen =
    currentScreen === 'emergency_sos' ||
    currentScreen === 'live_navigation' ||
    currentScreen === 'safety_checkin';

  // Helper to render active screen component
  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onNavigate={handleNavigate} />;
      case 'login':
        return (
          <LoginScreen
            onNavigate={handleNavigate}
            onLoginSuccess={() => setCurrentScreen('dashboard')}
          />
        );
      case 'dashboard':
        return (
          <DashboardScreen
            onNavigate={handleNavigate}
            onOpenSos={handleOpenSos}
          />
        );
      case 'route_search':
        return (
          <RouteSearchScreen
            onNavigate={handleNavigate}
            destination={destination}
            setDestination={setDestination}
            onGenerateRoutes={() => setSelectedRoute(MOCK_ROUTES[2])}
          />
        );
      case 'route_comparison':
        return (
          <RouteComparisonScreen
            onNavigate={handleNavigate}
            selectedRoute={selectedRoute}
            onSelectRoute={setSelectedRoute}
          />
        );
      case 'shap_explain':
        return <ShapExplainabilityScreen onNavigate={handleNavigate} />;
      case 'live_navigation':
        return (
          <LiveNavigationScreen
            onNavigate={handleNavigate}
            selectedRoute={selectedRoute}
            onTriggerAlert={handleTriggerAlert}
            onTriggerCheckIn={handleTriggerCheckIn}
            onOpenSos={handleOpenSos}
          />
        );
      case 'dynamic_reroute':
        return (
          <DynamicReroutingScreen
            onNavigate={handleNavigate}
            onConfirmReroute={handleConfirmReroute}
          />
        );
      case 'safety_checkin':
        return (
          <SafetyCheckInScreen
            onNavigate={handleNavigate}
            onSafe={() => setCurrentScreen('live_navigation')}
            onNeedHelp={handleOpenSos}
          />
        );
      case 'emergency_sos':
        return <EmergencySosScreen onNavigate={handleNavigate} />;
      case 'trusted_contacts':
        return <TrustedContactsScreen onNavigate={handleNavigate} />;
      case 'safety_analytics':
        return <SafetyAnalyticsScreen onNavigate={handleNavigate} />;
      case 'profile_settings':
        return (
          <ProfileSettingsScreen
            onNavigate={handleNavigate}
            onLogout={() => setCurrentScreen('login')}
          />
        );
      case 'public_gathering_hub':
        return (
          <PublicGatheringHubScreen
            onNavigate={handleNavigate}
            onSelectRoute={setSelectedRoute}
          />
        );
      case 'safe_haven_network':
        return (
          <SafeHavenNetworkScreen
            onNavigate={handleNavigate}
            onSelectRoute={setSelectedRoute}
          />
        );
      case 'transport_companion':
        return (
          <TransportCompanionScreen
            onNavigate={handleNavigate}
            onOpenSos={handleOpenSos}
          />
        );
      case 'infrastructure_reporting':
        return (
          <InfrastructureReportingScreen
            onNavigate={handleNavigate}
          />
        );
      case 'community_safe_walk':
        return (
          <CommunitySafeWalkScreen
            onNavigate={handleNavigate}
          />
        );
      default:
        return (
          <DashboardScreen
            onNavigate={handleNavigate}
            onOpenSos={handleOpenSos}
          />
        );
    }
  };

  return (
    <MobileFrame
      currentScreen={currentScreen}
      onSelectScreen={handleNavigate}
      onTriggerAlert={handleTriggerAlert}
      onTriggerCheckIn={handleTriggerCheckIn}
    >
      <div className="relative w-full h-full flex flex-col overflow-hidden bg-white dark:bg-black text-black dark:text-white transition-colors">
        {/* Active Screen Rendering with AnimatePresence */}
        <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentScreen}
              variants={shouldReduceMotion ? undefined : (isSafetyScreen ? safetyScreenVariants : screenVariants)}
              initial={shouldReduceMotion ? false : "initial"}
              animate={shouldReduceMotion ? false : "animate"}
              exit={shouldReduceMotion ? false : "exit"}
              className="w-full h-full flex flex-col overflow-hidden"
            >
              {renderActiveScreen()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global Modal: Screen 8 Safety Alert Warning bounded inside phone container */}
        <SafetyAlertModal
          isOpen={showAlertModal}
          onClose={() => setShowAlertModal(false)}
          onRecalculate={() => {
            setShowAlertModal(false);
            setCurrentScreen('dynamic_reroute');
          }}
        />

        {/* Floating Copilot AI Assistant */}
        <FloatingAiAssistant />

        {/* Persistent Bottom Tab Navigation Bar */}
        <BottomNavBar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          onOpenSos={handleOpenSos}
        />
      </div>
    </MobileFrame>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MainAppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
