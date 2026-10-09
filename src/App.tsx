import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ScreenId, RouteOption, EnvironmentalConditionsState, StoppedWaypointState } from './types';
import { MOCK_ROUTES } from './data/mockData';
import { DEFAULT_OPTIMAL_CONDITIONS, calculateDynamicSafety } from './data/conditionSimulator';
import { createStoppedWaypointSnapshot } from './utils/dynamicRerouting';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { MobileFrame } from './components/MobileFrame';
import { supabase } from './lib/supabase';
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
import { ProactivePoliceMonitoringScreen } from './components/screens/ProactivePoliceMonitoringScreen';
import { NearestSafePlaceScreen } from './components/screens/NearestSafePlaceScreen';
import { PoliceCommandCenter } from './components/police/PoliceCommandCenter';
import { FloatingAiAssistant } from './components/FloatingAiAssistant';
import { BottomNavBar } from './components/BottomNavBar';
import { screenVariants, safetyScreenVariants } from './utils/motion';

function MainAppContent() {
  const [portalMode, setPortalMode] = useState<'citizen' | 'police_command'>('citizen');
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('splash');
  const [selectedRoute, setSelectedRoute] = useState<RouteOption>(MOCK_ROUTES[2]); // Default Route C (Recommended 93%)
  const [destination, setDestination] = useState('Westwood Residence, 88 Parkview');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Navigation Progress tracking (0 - 100%) and stopped waypoint snapshot
  const [navProgress, setNavProgress] = useState<number>(0);
  const [stoppedWaypoint, setStoppedWaypoint] = useState<StoppedWaypointState | null>(null);

  // Challenge 1: Dynamic Environmental Conditions State
  const [conditions, setConditions] = useState<EnvironmentalConditionsState>(DEFAULT_OPTIMAL_CONDITIONS);

  // Dynamic Safety Calculation derived in real-time
  const calculation = useMemo(() => {
    return calculateDynamicSafety(selectedRoute.safetyScore, conditions);
  }, [selectedRoute.safetyScore, conditions]);

  // Listen for Supabase auth state changes (real login / logout events)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user && currentScreen === 'login') {
        setCurrentScreen('dashboard');
      }
      if (event === 'SIGNED_OUT') {
        setCurrentScreen('login');
      }
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trigger alert simulation with stopped waypoint snapshot from exact location
  const handleTriggerAlert = () => {
    const currentP = navProgress > 0 ? navProgress : 45;
    const snapshot = createStoppedWaypointSnapshot(selectedRoute, currentP, conditions, 'emergency_alert');
    setStoppedWaypoint(snapshot);
    setShowAlertModal(true);
  };

  // Navigate to screen handler
  const handleNavigate = (screen: ScreenId) => {
    if (screen === 'safety_alert') {
      handleTriggerAlert();
    } else if (screen === 'dynamic_reroute') {
      if (!stoppedWaypoint) {
        const currentP = navProgress > 0 ? navProgress : 45;
        const snapshot = createStoppedWaypointSnapshot(selectedRoute, currentP, conditions, 'emergency_reroute');
        setStoppedWaypoint(snapshot);
      }
      setCurrentScreen(screen);
    } else {
      setCurrentScreen(screen);
    }
  };

  // Open SOS screen directly
  const handleOpenSos = () => {
    setCurrentScreen('emergency_sos');
  };

  // Trigger safety check-in simulation
  const handleTriggerCheckIn = () => {
    setCurrentScreen('safety_checkin');
  };

  // Confirm rerouting from Alert or Reroute screen: start from exact stopped location!
  const handleConfirmReroute = (newRoute?: RouteOption, resumeProgress?: number) => {
    setShowAlertModal(false);
    if (newRoute) {
      setSelectedRoute(newRoute);
    } else {
      setSelectedRoute(MOCK_ROUTES[2]);
    }
    const targetProgress = resumeProgress !== undefined ? resumeProgress : (stoppedWaypoint?.progress ?? 0);
    setNavProgress(targetProgress);
    setConditions(DEFAULT_OPTIMAL_CONDITIONS);
    setCurrentScreen('live_navigation');
  };

  // Check if current screen is a critical safety screen (requires instant interaction)
  const isSafetyScreen =
    currentScreen === 'emergency_sos' ||
    currentScreen === 'live_navigation' ||
    currentScreen === 'safety_checkin' ||
    currentScreen === 'proactive_police_monitoring';

  // Helper to render active screen component
  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <SplashScreen
            onNavigate={handleNavigate}
            onOpenAi={() => setIsAiAssistantOpen(true)}
          />
        );
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
            onSelectRoute={setSelectedRoute}
            onTriggerAlert={handleTriggerAlert}
            onTriggerCheckIn={handleTriggerCheckIn}
            onOpenSos={handleOpenSos}
            conditions={conditions}
            onUpdateConditions={setConditions}
            calculation={calculation}
            initialProgress={navProgress}
            onProgressChange={setNavProgress}
            stoppedWaypoint={stoppedWaypoint}
          />
        );
      case 'dynamic_reroute':
        return (
          <DynamicReroutingScreen
            onNavigate={handleNavigate}
            onConfirmReroute={handleConfirmReroute}
            onSelectAndNavigateRoute={(newRoute, resumeProgress) => handleConfirmReroute(newRoute, resumeProgress)}
            calculation={calculation}
            conditions={conditions}
            stoppedWaypoint={stoppedWaypoint}
            activeRoute={selectedRoute}
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
      case 'proactive_police_monitoring':
        return (
          <ProactivePoliceMonitoringScreen
            onNavigate={handleNavigate}
            onOpenSos={handleOpenSos}
            onOpenPoliceCommandCenter={() => setPortalMode('police_command')}
          />
        );
      case 'nearest_safe_place':
        return (
          <NearestSafePlaceScreen
            onNavigate={handleNavigate}
            onSelectRoute={setSelectedRoute}
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

  // If user selected Police Command Center, render the full workstation console
  if (portalMode === 'police_command') {
    return (
      <PoliceCommandCenter 
        onSwitchToCitizenApp={() => setPortalMode('citizen')}
        onNavigateCitizenScreen={(screen) => {
          setPortalMode('citizen');
          handleNavigate(screen);
        }}
      />
    );
  }

  return (
    <MobileFrame
      currentScreen={currentScreen}
      onSelectScreen={handleNavigate}
      onTriggerAlert={handleTriggerAlert}
      onTriggerCheckIn={handleTriggerCheckIn}
      portalMode={portalMode}
      onSelectPortalMode={setPortalMode}
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
          calculation={calculation}
          conditions={conditions}
          stoppedWaypoint={stoppedWaypoint}
          onRecalculate={() => {
            setShowAlertModal(false);
            if (!stoppedWaypoint) {
              const currentP = navProgress > 0 ? navProgress : 45;
              const snapshot = createStoppedWaypointSnapshot(selectedRoute, currentP, conditions, 'emergency_alert');
              setStoppedWaypoint(snapshot);
            }
            setCurrentScreen('dynamic_reroute');
          }}
        />

        {/* Floating Copilot AI Assistant */}
        <FloatingAiAssistant
          currentScreen={currentScreen}
          isOpen={isAiAssistantOpen}
          onOpenChange={setIsAiAssistantOpen}
          onNavigate={handleNavigate}
        />

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
        <UserProvider>
          <MainAppContent />
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
