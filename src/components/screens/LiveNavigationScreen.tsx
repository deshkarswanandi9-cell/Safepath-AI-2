import React, { useState, useEffect, useRef } from 'react';
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
  Check
} from 'lucide-react';
import { ScreenId, RouteOption } from '../../types';
import { NAV_STEPS } from '../../data/mockData';
import { MapEngine } from '../MapEngine';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export type NavigationLifecycle = 'navigating' | 'paused' | 'completed';

interface LiveNavigationScreenProps {
  onNavigate: (screen: ScreenId) => void;
  selectedRoute: RouteOption;
  onTriggerAlert: () => void;
  onTriggerCheckIn: () => void;
  onOpenSos: () => void;
  onTripComplete?: () => void;
}

export const LiveNavigationScreen: React.FC<LiveNavigationScreenProps> = ({
  onNavigate,
  selectedRoute,
  onTriggerAlert,
  onTriggerCheckIn,
  onOpenSos,
  onTripComplete
}) => {
  const { t } = useLanguage();
  
  // Navigation lifecycle state machine: 'navigating' | 'paused' | 'completed'
  const [lifecycle, setLifecycle] = useState<NavigationLifecycle>('navigating');
  const [progress, setProgress] = useState<number>(0);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [soundMode, setSoundMode] = useState<'on' | 'mute'>('on');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [recenteredToast, setRecenteredToast] = useState<boolean>(false);

  // References to prevent stale closures or multiple callbacks
  const prevRouteIdRef = useRef<string>(selectedRoute.id);
  const completionReportedRef = useRef<boolean>(false);

  // Parse total route metrics safely
  const totalDistanceKm = parseFloat(selectedRoute.distance.replace(/[^\d.]/g, '')) || 4.2;
  const totalMinutes = parseInt(selectedRoute.time.replace(/[^\d]/g, ''), 10) || 12;

  // Reset journey state when active route changes
  useEffect(() => {
    if (prevRouteIdRef.current !== selectedRoute.id) {
      prevRouteIdRef.current = selectedRoute.id;
      setProgress(0);
      setCurrentStepIdx(0);
      setLifecycle('navigating');
      completionReportedRef.current = false;
    }
  }, [selectedRoute.id]);

  // Main simulation timer loop
  useEffect(() => {
    if (lifecycle !== 'navigating') return;

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          return 100;
        }

        // Advance simulation smoothly (+2.0% per second)
        const nextProgress = Math.min(100, Math.round((prevProgress + 2.0) * 10) / 10);

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
  }, [lifecycle, onTripComplete]);

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
    setLifecycle('navigating');
    completionReportedRef.current = false;
  };

  // Click on progress bar for quick scrub / manual simulation control
  const handleProgressScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newProgress = Math.round(clickRatio * 100);
    setProgress(newProgress);

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
      <div className="relative z-20 p-3 pt-2">
        {!isCompleted ? (
          /* Active Turn-by-Turn Guidance Header */
          <div className="p-3 rounded-2xl bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-300 dark:border-neutral-800 shadow-lg backdrop-blur-xs flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
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
              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <span>In {activeStep.distance}</span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{activeStep.lightingStatus} Lux</span>
                </div>
                <h2 className="text-xs font-black tracking-tight text-black dark:text-white truncate">
                  {activeStep.instruction}
                </h2>
              </div>
            </div>

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
      <div className="absolute right-3 top-22 z-20 flex flex-col gap-1.5">
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
              onClick={onTriggerAlert}
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
