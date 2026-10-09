import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, 
  Navigation, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  AlertOctagon,
  CornerUpRight, 
  CornerUpLeft,
  ArrowUp,
  Layers,
  LocateFixed,
  CheckCircle2,
  RotateCcw,
  Home,
  Check,
  Activity,
  Sliders,
  TrendingDown,
  TrendingUp,
  LightbulbOff,
  Users,
  RotateCw,
  Building2,
  X
} from 'lucide-react';
import { 
  ScreenId, 
  RouteOption, 
  EnvironmentalConditionsState, 
  DynamicSafetyCalculation,
  StoppedWaypointState
} from '../../types';
import { NAV_STEPS, MOCK_ROUTES } from '../../data/mockData';
import { MapEngine } from '../MapEngine';
import { DynamicConditionsPanel } from '../DynamicConditionsPanel';
import { AdaptiveRecommendationBanner } from '../AdaptiveRecommendationBanner';
import { 
  DEFAULT_OPTIMAL_CONDITIONS, 
  CONDITION_SCENARIO_PRESETS,
  calculateDynamicSafety,
  evaluateAdaptiveRecommendation
} from '../../data/conditionSimulator';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

export type NavigationLifecycle = 'navigating' | 'paused' | 'completed';

interface LiveNavigationScreenProps {
  onNavigate: (screen: ScreenId) => void;
  selectedRoute: RouteOption;
  onSelectRoute?: (route: RouteOption) => void;
  onTriggerAlert: () => void;
  onTriggerCheckIn: () => void;
  onOpenSos: () => void;
  onTripComplete?: () => void;
  conditions?: EnvironmentalConditionsState;
  onUpdateConditions?: (conditions: EnvironmentalConditionsState) => void;
  calculation?: DynamicSafetyCalculation;
  initialProgress?: number;
  onProgressChange?: (progress: number) => void;
  stoppedWaypoint?: StoppedWaypointState | null;
}

export const LiveNavigationScreen: React.FC<LiveNavigationScreenProps> = ({
  onNavigate,
  selectedRoute,
  onSelectRoute,
  onTriggerAlert,
  onTriggerCheckIn,
  onOpenSos,
  onTripComplete,
  conditions: externalConditions,
  onUpdateConditions: externalOnUpdateConditions,
  calculation: externalCalculation,
  initialProgress = 0,
  onProgressChange,
  stoppedWaypoint
}) => {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  
  // Navigation lifecycle state machine: 'navigating' | 'paused' | 'completed'
  const [lifecycle, setLifecycle] = useState<NavigationLifecycle>('navigating');
  const [progress, setProgress] = useState<number>(initialProgress);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(() => {
    return Math.min(NAV_STEPS.length - 1, Math.floor((initialProgress / 100) * NAV_STEPS.length));
  });

  const [soundMode, setSoundMode] = useState<'on' | 'mute'>('on');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [recenteredToast, setRecenteredToast] = useState<boolean>(false);

  // Challenge 1: Dynamic Conditions State
  const [internalConditions, setInternalConditions] = useState<EnvironmentalConditionsState>(DEFAULT_OPTIMAL_CONDITIONS);
  const conditions = externalConditions ?? internalConditions;
  const onUpdateConditions = externalOnUpdateConditions ?? setInternalConditions;

  // Derive calculation locally if not provided from parent (standalone use)
  const internalCalculation = useMemo(
    () => calculateDynamicSafety(selectedRoute.safetyScore, conditions),
    [selectedRoute.safetyScore, conditions]
  );
  const calculation = externalCalculation ?? internalCalculation;

  const [autoSimulate, setAutoSimulate] = useState<boolean>(true);
  const [showConditionsDrawer, setShowConditionsDrawer] = useState<boolean>(false);
  const [bannerDismissed, setBannerDismissed] = useState<boolean>(false);

  // Sync progress if initialProgress is passed from parent (e.g. returning from dynamic reroute)
  useEffect(() => {
    if (initialProgress !== undefined && Math.abs(initialProgress - progress) > 0.5) {
      setProgress(initialProgress);
      const step = Math.min(
        NAV_STEPS.length - 1,
        Math.floor((initialProgress / 100) * NAV_STEPS.length)
      );
      setCurrentStepIdx(step);
      if (initialProgress >= 100) {
        setLifecycle('completed');
      } else {
        setLifecycle('navigating');
      }
    }
  }, [initialProgress]);

  // Challenge 3: Adaptive Recommendation Reassessment
  const adaptiveRecommendation = useMemo(() => {
    return evaluateAdaptiveRecommendation(
      selectedRoute,
      MOCK_ROUTES,
      conditions,
      calculation
    );
  }, [selectedRoute, conditions, calculation]);

  // Handler to accept new recommended route - preserve current progress from where user stopped
  const handleAcceptRecommendedRoute = (routeId: string) => {
    const targetRoute = MOCK_ROUTES.find(r => r.id === routeId) || MOCK_ROUTES[2];
    if (onSelectRoute) {
      onSelectRoute(targetRoute);
    }
    onUpdateConditions(DEFAULT_OPTIMAL_CONDITIONS);
    // Preserve progress along the route instead of resetting to 0
    onProgressChange?.(progress);
    setBannerDismissed(false);
  };

  // Track progress thresholds for Challenge 1 auto-simulation
  const simulatedStep1Ref = useRef<boolean>(false);
  const simulatedStep2Ref = useRef<boolean>(false);

  // References to prevent stale closures or multiple callbacks
  const prevRouteIdRef = useRef<string>(selectedRoute.id);
  const completionReportedRef = useRef<boolean>(false);

  // Parse total route metrics safely
  const totalDistanceKm = parseFloat(selectedRoute.distance.replace(/[^\d.]/g, '')) || 4.2;
  const totalMinutes = parseInt(selectedRoute.time.replace(/[^\d]/g, ''), 10) || 12;

  // Handle active route changes without resetting progress if resuming mid-trip
  useEffect(() => {
    if (prevRouteIdRef.current !== selectedRoute.id) {
      prevRouteIdRef.current = selectedRoute.id;
      if (initialProgress === undefined || initialProgress === 0) {
        setProgress(0);
        setCurrentStepIdx(0);
      }
      setLifecycle('navigating');
      completionReportedRef.current = false;
      simulatedStep1Ref.current = false;
      simulatedStep2Ref.current = false;
      onUpdateConditions(DEFAULT_OPTIMAL_CONDITIONS);
    }
  }, [selectedRoute.id, initialProgress, onUpdateConditions]);

  // Main simulation timer loop & Challenge 1 dynamic event triggers
  useEffect(() => {
    if (lifecycle !== 'navigating') return;

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          return 100;
        }

        // Advance simulation smoothly (+2.0% per second)
        const nextProgress = Math.min(100, Math.round((prevProgress + 2.0) * 10) / 10);
        onProgressChange?.(nextProgress);

        // Challenge 1: Trigger realistic condition changes along route if autoSimulate is active
        if (autoSimulate) {
          // Event 1 at ~22% progress: Streetlight Grid Failure (-18 pts)
          if (nextProgress >= 22 && nextProgress < 48 && !simulatedStep1Ref.current) {
            simulatedStep1Ref.current = true;
            const preset = CONDITION_SCENARIO_PRESETS.find(p => p.id === 'streetlight_failure');
            if (preset) {
              onUpdateConditions({ ...preset.conditions });
              setBannerDismissed(false);
            }
          }
          // Event 2 at ~48% progress: Compound Risk (Streetlight failure + Footfall drop + Barricade -> 54%)
          if (nextProgress >= 48 && nextProgress < 85 && !simulatedStep2Ref.current) {
            simulatedStep2Ref.current = true;
            const preset = CONDITION_SCENARIO_PRESETS.find(p => p.id === 'compound_risk');
            if (preset) {
              onUpdateConditions({ ...preset.conditions });
              setBannerDismissed(false);
            }
          }
        }

        if (nextProgress >= 100) {
          setCurrentStepIdx(NAV_STEPS.length - 1);
          setLifecycle('completed');
          if (!completionReportedRef.current) {
            completionReportedRef.current = true;
            if (onTripComplete) onTripComplete();
          }
          return 100;
        } else {
          const step = Math.min(
            NAV_STEPS.length - 1,
            Math.floor((nextProgress / 100) * NAV_STEPS.length)
          );
          setCurrentStepIdx(step);
          return nextProgress;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lifecycle, onTripComplete, autoSimulate, onUpdateConditions, onProgressChange]);

  // Recenter handler
  const handleRecenter = () => {
    setRecenteredToast(true);
    setTimeout(() => setRecenteredToast(false), 1500);
  };

  // Play / Pause toggle
  const handleTogglePlayPause = () => {
    if (lifecycle === 'completed') return;
    setLifecycle((prev) => (prev === 'navigating' ? 'paused' : 'navigating'));
  };

  // Restart journey handler
  const handleRestart = () => {
    setProgress(0);
    setCurrentStepIdx(0);
    onProgressChange?.(0);
    setLifecycle('navigating');
    completionReportedRef.current = false;
  };

  // Click on progress bar for quick scrub / manual simulation control
  const handleProgressScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newProgress = Math.round(clickRatio * 100);
    setProgress(newProgress);
    onProgressChange?.(newProgress);


    if (newProgress >= 100) {
      setCurrentStepIdx(NAV_STEPS.length - 1);
      setLifecycle('completed');
      if (!completionReportedRef.current) {
        completionReportedRef.current = true;
        if (onTripComplete) onTripComplete();
      }
    } else {
      const step = Math.min(
        NAV_STEPS.length - 1,
        Math.floor((newProgress / 100) * NAV_STEPS.length)
      );
      setCurrentStepIdx(step);
      if (lifecycle === 'completed') {
        setLifecycle('navigating');
        completionReportedRef.current = false;
      }
    }
  };

  // Dynamic remaining metrics calculations
  const remainingRatio = lifecycle === 'completed' ? 0 : Math.max(0, 1 - progress / 100);
  const remainingKm = totalDistanceKm * remainingRatio;
  const remainingMin = Math.ceil(totalMinutes * remainingRatio);

  const formattedDistance = 
    lifecycle === 'completed' || remainingKm <= 0.01
      ? '0 m'
      : remainingKm < 1
        ? `${Math.round(remainingKm * 1000)} m`
        : `${remainingKm.toFixed(1)} km`;

  const formattedTime = 
    lifecycle === 'completed' || remainingMin === 0
      ? '0 min'
      : `${remainingMin} min`;

  // Compute dynamic arrival time
  const [etaTime, setEtaTime] = useState<string>('');
  useEffect(() => {
    const d = new Date();
    if (lifecycle !== 'completed') {
      d.setMinutes(d.getMinutes() + remainingMin);
    }
    setEtaTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [remainingMin, lifecycle]);

  const activeStep = NAV_STEPS[currentStepIdx] || NAV_STEPS[0];
  const isCompleted = lifecycle === 'completed';

  return (
    <div className="relative h-full w-full flex flex-col justify-between overflow-hidden select-none font-sans bg-white dark:bg-black text-black dark:text-white transition-colors">
      {/* Map Surface */}
      <div className="absolute inset-0 z-0">
        <MapEngine
          activeRoute={selectedRoute}
          heightClass="h-full"
          showHeatmap={showHeatmap}
          showHelpPoints={true}
          showStreetlights={true}
          interactive={true}
          navMode={true}
          userProgress={progress}
          lastStoppedLocation={
            stoppedWaypoint
              ? { x: stoppedWaypoint.coords.x, y: stoppedWaypoint.coords.y, label: stoppedWaypoint.locationName }
              : undefined
          }
          luxLevel={conditions.lighting.luxLevel}
          lightingStatus={conditions.lighting.status}
          disruptionLabel={conditions.gathering.status !== 'none' ? conditions.gathering.label : undefined}
        />
      </div>

      {/* Recenter Toast Feedback */}
      {recenteredToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-full bg-black/90 dark:bg-white/90 text-white dark:text-black text-[11px] font-bold shadow-lg flex items-center gap-1.5 pointer-events-none transition-all">
          <LocateFixed className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
          <span>{isCompleted ? 'Focused on Destination' : 'Centered on GPS Position'}</span>
        </div>
      )}

      {/* Top Floating Header: Turn Guidance OR Arrival Confirmation */}
      <div className="relative z-20 p-3 pt-2 space-y-1.5">
        {!isCompleted ? (
          /* Active Turn-by-Turn Guidance Header */
          <div className="p-3 rounded-2xl bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-300 dark:border-neutral-800 shadow-lg backdrop-blur-xs flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {/* Turn Icon */}
              <div className="w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0 shadow-xs">
                {activeStep.turnType === 'left' ? (
                  <CornerUpLeft className="w-6 h-6 stroke-[2.5]" />
                ) : activeStep.turnType === 'right' ? (
                  <CornerUpRight className="w-6 h-6 stroke-[2.5]" />
                ) : (
                  <ArrowUp className="w-6 h-6 stroke-[2.5]" />
                )}
              </div>

              {/* Instruction Text */}
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <span>In {activeStep.distance}</span>
                  <span>•</span>
                  <span className={`font-extrabold ${
                    conditions.lighting.luxLevel < 40 
                      ? 'text-red-500' 
                      : conditions.lighting.luxLevel < 70 
                      ? 'text-amber-500' 
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {conditions.lighting.luxLevel} Lux
                  </span>
                </div>
                <h2 className="text-xs font-black tracking-tight text-black dark:text-white truncate">
                  {activeStep.instruction}
                </h2>
              </div>
            </div>

            {/* Challenge 1 Dynamic Safety Score Button */}
            <button
              id="btn-nav-dynamic-score"
              type="button"
              onClick={() => setShowConditionsDrawer(true)}
              className={`px-2 py-1 rounded-xl border text-left shrink-0 transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                calculation.statusLevel === 'optimal'
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : calculation.statusLevel === 'moderate'
                  ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                  : 'bg-red-50 dark:bg-red-950/80 border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 animate-pulse'
              }`}
              title="Click to view Challenge 1 Dynamic Conditions Panel"
            >
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Live Safety
                </span>
                <span className="text-xs font-black leading-none">
                  {calculation.currentScore}%
                </span>
              </div>
              <Activity className="w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Exit Back Button */}
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors shrink-0 cursor-pointer"
              title="Exit Navigation"
              aria-label="Exit Navigation to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Terminal Arrival Header */
          <div className="p-3 rounded-2xl bg-white/95 dark:bg-black/95 text-black dark:text-white border border-emerald-500/50 dark:border-emerald-500/40 shadow-lg backdrop-blur-xs flex items-center justify-between gap-2.5 animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Verified Arrival Icon */}
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>

              {/* Arrival Message */}
              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span>Destination Reached</span>
                  <span>•</span>
                  <span>100% Safe</span>
                </div>
                <h2 className="text-xs font-black tracking-tight text-black dark:text-white truncate">
                  You've arrived safely at Westwood Res.
                </h2>
              </div>
            </div>

            {/* Exit to Home */}
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors shrink-0 cursor-pointer"
              title="Return to Home"
              aria-label="Return to Home Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Unified Side Quick Action Rail */}
      <div className="absolute right-3 top-24 z-20 flex flex-col gap-1.5">
        {/* Recenter / Focus */}
        <button
          type="button"
          onClick={handleRecenter}
          className="w-8 h-8 rounded-xl bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-300 dark:border-neutral-800 shadow-md hover:border-black dark:hover:border-white transition-colors cursor-pointer flex items-center justify-center"
          title={isCompleted ? "Focus Destination" : "Recenter on Location"}
          aria-label="Recenter Map"
        >
          <LocateFixed className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </button>

        {/* Challenge 1 Dynamic Conditions Panel Toggle Button */}
        {!isCompleted && (
          <button
            type="button"
            id="btn-nav-toggle-conditions"
            onClick={() => setShowConditionsDrawer(!showConditionsDrawer)}
            className={`w-8 h-8 rounded-xl border shadow-md transition-colors cursor-pointer flex items-center justify-center ${
              showConditionsDrawer || calculation.statusLevel !== 'optimal'
                ? 'bg-amber-500 text-black border-amber-600 font-bold'
                : 'bg-white/95 dark:bg-black/95 text-black dark:text-white border-neutral-300 dark:border-neutral-800'
            }`}
            title="Challenge 1: Environmental Condition Monitor"
            aria-label="Toggle Live Condition Monitor"
          >
            <Sliders className="w-4 h-4" />
          </button>
        )}

        {/* Safety Heatmap & Corridor Layer Toggle */}
        <button
          type="button"
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`w-8 h-8 rounded-xl border shadow-md transition-colors cursor-pointer flex items-center justify-center ${
            showHeatmap
              ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
              : 'bg-white/95 dark:bg-black/95 text-neutral-400 border-neutral-300 dark:border-neutral-800'
          }`}
          title={showHeatmap ? 'Hide Safety Heatmap' : 'Show Safety Heatmap'}
          aria-label="Toggle Safety Heatmap Overlay"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Active Navigation Only Controls */}
        {!isCompleted ? (
          <>
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundMode(soundMode === 'on' ? 'mute' : 'on')}
              className="w-8 h-8 rounded-xl bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-300 dark:border-neutral-800 shadow-md hover:border-black dark:hover:border-white transition-colors cursor-pointer flex items-center justify-center"
              title={soundMode === 'on' ? 'Mute Audio' : 'Unmute Audio'}
              aria-label="Toggle Navigation Audio"
            >
              {soundMode === 'on' ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
            </button>

            {/* Pause / Resume Simulation */}
            <button
              type="button"
              onClick={handleTogglePlayPause}
              className="w-8 h-8 rounded-xl bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-300 dark:border-neutral-800 shadow-md hover:border-black dark:hover:border-white transition-colors cursor-pointer flex items-center justify-center"
              title={lifecycle === 'navigating' ? 'Pause GPS Simulation' : 'Resume GPS Simulation'}
              aria-label="Play or Pause GPS Simulation"
            >
              {lifecycle === 'navigating' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-500" />}
            </button>

            {/* 30s Check-In Simulation */}
            <button
              type="button"
              onClick={onTriggerCheckIn}
              className="w-8 h-8 rounded-xl bg-white/95 dark:bg-black/95 text-amber-600 dark:text-amber-400 border border-neutral-300 dark:border-neutral-800 shadow-md hover:border-amber-500 transition-colors cursor-pointer flex items-center justify-center"
              title="Trigger 30s Check-In"
              aria-label="Trigger 30s Safety Check-In"
            >
              <Clock className="w-4 h-4" />
            </button>

            {/* Simulate Safety Alert */}
            <button
              type="button"
              onClick={() => {
                onProgressChange?.(progress);
                onTriggerAlert();
              }}
              className="w-8 h-8 rounded-xl bg-white/95 dark:bg-black/95 text-red-600 dark:text-red-400 border border-neutral-300 dark:border-neutral-800 shadow-md hover:border-red-500 transition-colors cursor-pointer flex items-center justify-center"
              title="Simulate Safety Alert"
              aria-label="Simulate Safety Alert"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          </>
        ) : (
          /* Completed State: Quick Restart Action */
          <button
            type="button"
            onClick={handleRestart}
            className="w-8 h-8 rounded-xl bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-300 dark:border-neutral-800 shadow-md hover:border-black dark:hover:border-white transition-colors cursor-pointer flex items-center justify-center"
            title="Restart Simulation"
            aria-label="Restart Journey Simulation"
          >
            <RotateCcw className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
          </button>
        )}
      </div>

      {/* Challenge 3: In-Journey Adaptive Recommendation Banner (When AI re-evaluates and switches recommendation) */}
      <AnimatePresence>
        {!isCompleted && adaptiveRecommendation.hasRecommendationChanged && !bannerDismissed && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            className="relative z-30 mx-3 mb-2"
          >
            <AdaptiveRecommendationBanner
              recommendationState={adaptiveRecommendation}
              onAcceptRecommendation={handleAcceptRecommendedRoute}
              onOpenDetailedComparison={() => {
                onProgressChange?.(progress);
                onNavigate('dynamic_reroute');
              }}
              onDismiss={() => setBannerDismissed(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* In-Journey Dynamic Environmental Alert Banner (Fallback for minor condition shifts) */}
      <AnimatePresence>
        {!isCompleted && !adaptiveRecommendation.hasRecommendationChanged && calculation.currentScore < 80 && !bannerDismissed && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
            animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
            className="relative z-25 mx-3 mb-1.5 p-2.5 rounded-2xl bg-white/95 dark:bg-black/95 border border-red-400 dark:border-red-800 shadow-xl backdrop-blur-xs flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-wider">
                    Condition Change
                  </span>
                  <span className="text-[10px] font-bold text-neutral-500">
                    • Score: {calculation.currentScore}% ({calculation.scoreDelta} pts)
                  </span>
                </div>
                <p className="text-[10px] font-bold text-black dark:text-white truncate">
                  {conditions.lighting.status === 'failed' ? 'Streetlight outage' : ''}
                  {conditions.lighting.status === 'failed' && conditions.pedestrian.status === 'deserted' ? ' & ' : ''}
                  {conditions.pedestrian.status === 'deserted' ? 'Low activity' : ''}
                  {' detected ahead.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onProgressChange?.(progress);
                  onNavigate('dynamic_reroute');
                }}
                className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-black text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Reroute</span>
                <RotateCw className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setBannerDismissed(true)}
                className="p-1 rounded text-neutral-400 hover:text-black dark:hover:text-white"
                aria-label="Dismiss alert banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenge 1: Slide-up Dynamic Conditions Telemetry & Simulator Drawer */}
      <AnimatePresence>
        {showConditionsDrawer && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 100 }}
            animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? false : { opacity: 0, y: 100 }}
            className="absolute inset-x-2 bottom-3 z-40"
          >
            <DynamicConditionsPanel
              conditions={conditions}
              onUpdateConditions={onUpdateConditions}
              calculation={calculation}
              onTriggerReroute={() => {
                setShowConditionsDrawer(false);
                onProgressChange?.(progress);
                onNavigate('dynamic_reroute');
              }}
              autoSimulate={autoSimulate}
              onToggleAutoSimulate={setAutoSimulate}
              isOpen={showConditionsDrawer}
              onClose={() => setShowConditionsDrawer(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Route Progression & SOS / Arrival Card */}
      <div className="relative z-20 p-3 pb-4">
        {!isCompleted ? (
          /* Active Navigation Progression Card */
          <div className="p-3.5 rounded-2xl bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-300 dark:border-neutral-800 shadow-2xl backdrop-blur-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-black dark:text-white">
                    {formattedTime}
                  </span>
                  <span className="text-xs text-neutral-500 font-bold">
                    • {formattedDistance} • ETA {etaTime}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>
                    {lifecycle === 'paused'
                      ? 'Simulation paused • Tap play to resume'
                      : `Navigating along designated ${selectedRoute.name}`}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Nearest Safe Place Button */}
                <button
                  type="button"
                  id="btn-nav-find-haven"
                  onClick={() => onNavigate('nearest_safe_place')}
                  className="px-2.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
                  title="Find Nearest Safe Place & Refuges"
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline">Haven</span>
                </button>

                {/* Quick SOS Trigger */}
                <button
                  id="btn-nav-sos"
                  type="button"
                  onClick={onOpenSos}
                  className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  title="Immediate SOS Dispatch"
                >
                  <AlertOctagon className="w-4 h-4" />
                  <span>SOS</span>
                </button>
              </div>
            </div>

            {/* Interactive Linear Progress Bar (Clickable for testing) */}
            <div 
              className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden cursor-pointer"
              title="Click track to scrub simulation progress"
              onClick={handleProgressScrub}
            >
              <div
                className="bg-black dark:bg-white h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          /* Terminal Arrival Summary Card */
          <div className="p-3.5 rounded-2xl bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-300 dark:border-neutral-800 shadow-2xl backdrop-blur-xs space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-black dark:text-white">
                    Journey Complete
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    100% Safe
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                  Safely navigated to Westwood Residence at {etaTime}
                </p>
              </div>

              {/* Secondary Emergency Contact Access */}
              <button
                id="btn-nav-sos"
                type="button"
                onClick={onOpenSos}
                className="p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:text-red-600 hover:border-red-400 transition-colors cursor-pointer"
                title="Emergency SOS"
                aria-label="Emergency SOS"
              >
                <AlertOctagon className="w-4 h-4" />
              </button>
            </div>

            {/* Actual Journey Statistics Grid */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-neutral-200 dark:border-neutral-800 text-center">
              <div className="p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60">
                <div className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Distance</div>
                <div className="text-xs font-black text-black dark:text-white mt-0.5">{selectedRoute.distance}</div>
              </div>
              <div className="p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60">
                <div className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Duration</div>
                <div className="text-xs font-black text-black dark:text-white mt-0.5">{selectedRoute.time}</div>
              </div>
              <div className="p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60">
                <div className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Safety Index</div>
                <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{selectedRoute.safetyScore}%</div>
              </div>
            </div>

            {/* 100% Completed Progress Indicator */}
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 dark:bg-emerald-500 h-1.5 rounded-full w-full" />
            </div>

            {/* Primary & Secondary Actions */}
            <div className="flex items-center gap-2 pt-0.5">
              <Button
                id="btn-nav-complete-home"
                variant="primary"
                size="md"
                fullWidth
                onClick={() => onNavigate('dashboard')}
                icon={<Home className="w-4 h-4" />}
              >
                Back to Home
              </Button>
              <Button
                id="btn-nav-restart"
                variant="outline"
                size="md"
                onClick={handleRestart}
                icon={<RotateCcw className="w-4 h-4" />}
                className="shrink-0"
                title="Restart Navigation Simulation"
              >
                Restart
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
