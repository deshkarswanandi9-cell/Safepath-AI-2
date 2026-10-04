import React, { useState, useEffect } from 'react';
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
  ArrowUp
} from 'lucide-react';
import { ScreenId, RouteOption } from '../../types';
import { NAV_STEPS } from '../../data/mockData';
import { MapEngine } from '../MapEngine';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface LiveNavigationScreenProps {
  onNavigate: (screen: ScreenId) => void;
  selectedRoute: RouteOption;
  onTriggerAlert: () => void;
  onTriggerCheckIn: () => void;
  onOpenSos: () => void;
}

export const LiveNavigationScreen: React.FC<LiveNavigationScreenProps> = ({
  onNavigate,
  selectedRoute,
  onTriggerAlert,
  onTriggerCheckIn,
  onOpenSos
}) => {
  const { t } = useLanguage();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progress, setProgress] = useState(25);
  const [isSimulating, setIsSimulating] = useState(true);
  const [soundMode, setSoundMode] = useState<'on' | 'mute'>('on');

  // Auto progression simulation
  useEffect(() => {
    if (!isSimulating) return;
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) return 95;
        const nextP = p + 1.2;
        const step = Math.min(
          NAV_STEPS.length - 1,
          Math.floor((nextP / 100) * NAV_STEPS.length)
        );
        setCurrentStepIdx(step);
        return nextP;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSimulating]);

  const activeStep = NAV_STEPS[currentStepIdx] || NAV_STEPS[0];
  const nextStep = NAV_STEPS[currentStepIdx + 1] || null;

  return (
    <div className="relative h-full w-full flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Map Surface */}
      <div className="absolute inset-0 z-0">
        <MapEngine
          activeRoute={selectedRoute}
          heightClass="h-full"
          showHeatmap={true}
          showHelpPoints={true}
          showStreetlights={true}
          interactive={true}
          navMode={true}
          userProgress={progress}
        />
      </div>

      {/* Top Floating Turn-by-Turn Guidance Header */}
      <div className="relative z-20 p-3 pt-2">
        <div className="p-3 rounded-2xl bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-300 dark:border-neutral-800 shadow-lg backdrop-blur-xs flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Turn Icon */}
            <div className="w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0">
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

          {/* Quick Exit Back Button */}
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors shrink-0"
            title="Exit Navigation"
            aria-label="Exit Navigation to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Side Quick Action Controls */}
      <div className="absolute right-3 top-20 z-20 flex flex-col gap-1.5">
        {/* Sound toggle */}
        <button
          type="button"
          onClick={() => setSoundMode(soundMode === 'on' ? 'mute' : 'on')}
          className="p-2 rounded-xl bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-300 dark:border-neutral-800 shadow-md hover:border-black dark:hover:border-white transition-colors cursor-pointer"
          title={soundMode === 'on' ? 'Mute Audio' : 'Unmute Audio'}
          aria-label="Toggle Navigation Audio"
        >
          {soundMode === 'on' ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
        </button>

        {/* Pause / Resume simulation */}
        <button
          type="button"
          onClick={() => setIsSimulating(!isSimulating)}
          className="p-2 rounded-xl bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-300 dark:border-neutral-800 shadow-md hover:border-black dark:hover:border-white transition-colors cursor-pointer"
          title={isSimulating ? 'Pause GPS Simulation' : 'Resume GPS Simulation'}
          aria-label="Play or Pause GPS Simulation"
        >
          {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Simulate Alert */}
        <button
          type="button"
          onClick={onTriggerAlert}
          className="p-2 rounded-xl bg-white/95 dark:bg-black/95 text-red-600 dark:text-red-400 border border-neutral-300 dark:border-neutral-800 shadow-md hover:border-red-500 transition-colors cursor-pointer"
          title="Simulate Safety Alert"
          aria-label="Simulate Safety Alert"
        >
          <AlertTriangle className="w-4 h-4" />
        </button>

        {/* Simulate Check-In */}
        <button
          type="button"
          onClick={onTriggerCheckIn}
          className="p-2 rounded-xl bg-white/95 dark:bg-black/95 text-amber-600 dark:text-amber-400 border border-neutral-300 dark:border-neutral-800 shadow-md hover:border-amber-500 transition-colors cursor-pointer"
          title="Trigger 30s Check-In"
          aria-label="Trigger 30s Safety Check-In"
        >
          <Clock className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Route Progression & SOS Card */}
      <div className="relative z-20 p-3 pb-4">
        <div className="p-3.5 rounded-2xl bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-300 dark:border-neutral-800 shadow-2xl backdrop-blur-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-black dark:text-white">
                  12 min
                </span>
                <span className="text-xs text-neutral-500 font-bold">• 4.2 km • 10:14 PM</span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Navigating along designated {selectedRoute.name}</span>
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

          {/* Linear Progress Bar */}
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1 rounded-full overflow-hidden">
            <div
              className="bg-black dark:bg-white h-1 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
