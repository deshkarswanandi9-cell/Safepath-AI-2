import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Navigation, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Volume1,
  PhoneCall, 
  Share2, 
  Compass, 
  CornerUpRight, 
  CornerUpLeft,
  ArrowUp,
  ChevronRight,
  ShieldAlert,
  Play,
  Pause,
  RotateCcw,
  Search,
  X,
  MapPin,
  Sparkles,
  Layers,
  ChevronUp,
  Route,
  Shield
} from 'lucide-react';
import { ScreenId, RouteOption } from '../../types';
import { NAV_STEPS } from '../../data/mockData';
import { MapEngine } from '../MapEngine';
import { useLanguage } from '../../context/LanguageContext';

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
  const [soundMode, setSoundMode] = useState<'on' | 'alerts' | 'mute'>('on');
  const [showDrawer, setShowDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto progression simulation
  useEffect(() => {
    if (!isSimulating) return;
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) {
          return 95;
        }
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

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="relative min-h-[640px] h-full flex flex-col justify-between bg-[#E8ECEF] overflow-hidden select-none font-sans">
      {/* Full Screen Google Maps Canvas */}
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

      {/* Google Maps Turn-by-Turn Navigation Header */}
      <div className="relative z-20 p-3 pt-2 space-y-1.5">
        {/* Main Emerald Green Maneuver Card */}
        <div className="bg-[#137333] text-white rounded-3xl shadow-2xl p-3.5 border border-emerald-700/60 flex items-start justify-between">
          <div className="flex items-start gap-3.5">
            {/* Maneuver Big Icon */}
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
              {activeStep.instruction.toLowerCase().includes('left') ? (
                <CornerUpLeft className="w-7 h-7 text-white stroke-[2.5]" />
              ) : activeStep.instruction.toLowerCase().includes('right') ? (
                <CornerUpRight className="w-7 h-7 text-white stroke-[2.5]" />
              ) : (
                <ArrowUp className="w-7 h-7 text-white stroke-[2.5]" />
              )}
            </div>

            {/* Turn Instruction Text */}
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black tracking-tight text-white">
                  In {activeStep.distance}
                </span>
                <span className="text-[10px] font-bold bg-emerald-400/25 px-2 py-0.5 rounded-full border border-emerald-300/30 text-emerald-100">
                  {selectedRoute.safetyScore}% Safe
                </span>
              </div>

              <h2 className="text-xs font-extrabold text-white mt-0.5 leading-snug">
                {activeStep.instruction}
              </h2>

              {/* Safety Sidewalk Note */}
              <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-emerald-100 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                <span>{activeStep.safetyNote}</span>
              </div>
            </div>
          </div>

          {/* Sound Mode Toggle */}
          <button
            id="btn-nav-sound"
            onClick={() => {
              const next = soundMode === 'on' ? 'alerts' : soundMode === 'alerts' ? 'mute' : 'on';
              setSoundMode(next);
              triggerToast(
                next === 'on' ? '🔊 Voice Guidance Unmuted' : next === 'alerts' ? '⚠️ Alerts Only' : '🔇 Voice Guidance Muted'
              );
            }}
            className="p-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer"
            title="Toggle Voice Navigation Sound"
          >
            {soundMode === 'on' ? (
              <Volume2 className="w-4 h-4" />
            ) : soundMode === 'alerts' ? (
              <Volume1 className="w-4 h-4 text-amber-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-rose-300" />
            )}
          </button>
        </div>

        {/* Next Step Sub-Bar (Google Maps "Then turn..." teaser) */}
        {nextStep && (
          <div className="bg-[#0B5324]/95 backdrop-blur-md text-emerald-100 px-4 py-2 rounded-2xl shadow-md border border-emerald-800/40 flex items-center justify-between text-[11px] font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-300">Then</span>
              <span className="truncate max-w-[220px] text-white font-medium">{nextStep.instruction}</span>
            </div>
            <span className="text-[10px] text-emerald-200">{nextStep.distance}</span>
          </div>
        )}
      </div>

      {/* Quick Voice Companion & Safe Haven Bar */}
      <div className="relative z-10 px-3 flex items-center justify-between gap-1.5">
        <button
          onClick={() => {
            triggerToast('🎙️ AI Voice Companion: "Grand Blvd is 95% well-lit. Next police booth in 350 meters."');
          }}
          className="px-2.5 py-1 rounded-full bg-slate-900/90 text-white text-[10px] font-bold shadow-md border border-slate-700 flex items-center gap-1.5 hover:bg-slate-800 transition active:scale-95"
        >
          <Sparkles className="w-3 h-3 text-cyan-300" />
          <span>AI Voice Companion</span>
        </button>

        <button
          onClick={() => onNavigate('safe_haven_network')}
          className="px-2.5 py-1 rounded-full bg-emerald-700/90 text-white text-[10px] font-bold shadow-md border border-emerald-500/40 flex items-center gap-1.5 hover:bg-emerald-600 transition active:scale-95"
        >
          <Shield className="w-3 h-3 text-emerald-200" />
          <span>Apollo Haven (180m)</span>
        </button>

        <button
          id="btn-simulate-alert"
          onClick={onTriggerAlert}
          className="px-2.5 py-1 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white text-[10px] font-bold shadow-md flex items-center gap-1 transition active:scale-95"
        >
          <AlertTriangle className="w-3 h-3" />
          <span>Simulate Alert</span>
        </button>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="relative z-30 mx-6 -mt-2 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl shadow-xl border border-slate-700 text-center text-xs font-semibold animate-in fade-in duration-200">
          {toastMessage}
        </div>
      )}

      {/* Google Maps Bottom ETA & Trip Details Card */}
      <div className="relative z-20 p-3 pb-3">
        <div className="bg-white rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.25)] border border-slate-200 p-4">
          {/* Top Row: Large ETA + Distance + Remaining Time */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#188038] tracking-tight">
                  14 min
                </span>
                <span className="text-xs font-bold text-slate-500">•</span>
                <span className="text-xs font-bold text-slate-700">1.2 km</span>
                <span className="text-xs font-bold text-slate-500">•</span>
                <span className="text-xs font-bold text-slate-500">9:55 PM</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                <span>Fastest & safest night route via</span>
                <strong className="text-slate-800">Grand Blvd</strong>
              </p>
            </div>

            {/* Exit / End Navigation Button (Google Maps Red Close Button) */}
            <button
              id="btn-nav-exit"
              onClick={() => onNavigate('dashboard')}
              className="w-10 h-10 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center transition-transform active:scale-95 shadow-sm cursor-pointer"
              title="End Navigation & Return to Dashboard"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Progress Bar along route */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-[#1A73E8] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Google Maps Bottom Actions Row */}
          <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-100">
            {/* Action 1: Search along route */}
            <button
              onClick={() => {
                triggerToast('🔍 Showing verified 24/7 Havens & Police Kiosks on path');
              }}
              className="p-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex flex-col items-center gap-1 transition-colors cursor-pointer"
              title="Search along route"
            >
              <Search className="w-4 h-4 text-[#1A73E8]" />
              <span className="text-[9px] font-bold">Search</span>
            </button>

            {/* Action 2: Share Live Trip */}
            <button
              onClick={() => onNavigate('trusted_contacts')}
              className="p-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex flex-col items-center gap-1 transition-colors cursor-pointer"
              title="Share Live Trip Progress"
            >
              <Share2 className="w-4 h-4 text-purple-600" />
              <span className="text-[9px] font-bold">Share Trip</span>
            </button>

            {/* Action 3: Pause/Resume Simulation */}
            <button
              onClick={() => {
                setIsSimulating(!isSimulating);
                triggerToast(isSimulating ? '⏸️ Navigation Simulation Paused' : '▶️ Navigation Simulation Resumed');
              }}
              className="p-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex flex-col items-center gap-1 transition-colors cursor-pointer"
              title={isSimulating ? 'Pause Walk' : 'Resume Walk'}
            >
              {isSimulating ? (
                <Pause className="w-4 h-4 text-amber-600" />
              ) : (
                <Play className="w-4 h-4 text-emerald-600" />
              )}
              <span className="text-[9px] font-bold">{isSimulating ? 'Pause' : 'Resume'}</span>
            </button>

            {/* Action 4: Emergency SOS */}
            <button
              id="btn-nav-sos"
              onClick={onOpenSos}
              className="p-2 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 flex flex-col items-center gap-1 transition-colors cursor-pointer"
              title="Emergency SOS Alarm"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
              <span className="text-[9px] font-black text-rose-600">SOS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
