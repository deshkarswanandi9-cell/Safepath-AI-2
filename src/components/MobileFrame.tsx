import React, { useState } from 'react';
import { 
  Smartphone, 
  Maximize2, 
  RotateCcw, 
  Shield, 
  Wifi, 
  Battery, 
  Signal, 
  Sparkles,
  ChevronRight,
  Layers,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { ScreenId } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface MobileFrameProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  children: React.ReactNode;
  onTriggerAlert: () => void;
  onTriggerCheckIn: () => void;
}

const SCREENS_LIST: { id: ScreenId; num: number; label: string }[] = [
  { id: 'splash', num: 1, label: 'Splash' },
  { id: 'login', num: 2, label: 'Login' },
  { id: 'dashboard', num: 3, label: 'Home' },
  { id: 'route_search', num: 4, label: 'Search' },
  { id: 'route_comparison', num: 5, label: 'Routes' },
  { id: 'shap_explain', num: 6, label: 'SHAP' },
  { id: 'live_navigation', num: 7, label: 'Live Nav' },
  { id: 'safety_alert', num: 8, label: 'Alert' },
  { id: 'dynamic_reroute', num: 9, label: 'Reroute' },
  { id: 'safety_checkin', num: 10, label: 'Check-In' },
  { id: 'emergency_sos', num: 11, label: 'SOS' },
  { id: 'trusted_contacts', num: 12, label: 'Contacts' },
  { id: 'safety_analytics', num: 13, label: 'Analytics' },
  { id: 'profile_settings', num: 14, label: 'Profile' },
  { id: 'public_gathering_hub', num: 15, label: '📢 Gathering Hub' },
  { id: 'safe_haven_network', num: 16, label: '🏥 Safe Havens' },
  { id: 'transport_companion', num: 17, label: '🚗 Transit Companion' },
  { id: 'infrastructure_reporting', num: 18, label: '💡 Fix Dark Spots' },
  { id: 'community_safe_walk', num: 19, label: '👥 Safe Walk' },
];

export const MobileFrame: React.FC<MobileFrameProps> = ({
  currentScreen,
  onSelectScreen,
  children,
  onTriggerAlert,
  onTriggerCheckIn
}) => {
  const { language, setLanguage } = useLanguage();
  const [deviceView, setDeviceView] = useState<'mobile' | 'fluid'>('mobile');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center select-none font-sans">
      {/* Top Prototype Controls Banner */}
      <header className="w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 z-40 sticky top-0 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
          {/* Brand & Badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-md shadow-blue-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-tight text-white">SafeRoute AI</span>
                <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[9px] font-bold">
                  Women's Night Navigation
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                14 High-Fidelity Screens Prototype • SHAP Explainability & Live GPS
              </p>
            </div>
          </div>

          {/* Quick Simulation Triggers & View Toggle */}
          <div className="flex items-center gap-2">
            {/* Global Language Selector */}
            <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700">
              <span className="text-xs">
                {language === 'en' ? '🇺🇸' : language === 'hi' ? '🇮🇳' : language === 'es' ? '🇪🇸' : '🇫🇷'}
              </span>
              <select
                id="header-language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-[11px] font-bold text-slate-200 focus:outline-none cursor-pointer"
                title="Select Application Language"
              >
                <option value="en" className="bg-slate-900 text-white">English (US)</option>
                <option value="hi" className="bg-slate-900 text-white">हिन्दी (Hindi)</option>
                <option value="es" className="bg-slate-900 text-white">Español</option>
                <option value="fr" className="bg-slate-900 text-white">Français</option>
              </select>
            </div>

            <button
              onClick={onTriggerAlert}
              className="px-2.5 py-1 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Test Screen 8 Incident Warning"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulate Alert</span>
            </button>

            <button
              onClick={onTriggerCheckIn}
              className="px-2.5 py-1 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Test Screen 10 30s Safety Check-In"
            >
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Safety Check-In</span>
            </button>

            <div className="h-4 w-px bg-slate-800" />

            {/* View Mode Toggle */}
            <div className="bg-slate-800/80 p-0.5 rounded-xl flex">
              <button
                onClick={() => setDeviceView('mobile')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
                  deviceView === 'mobile'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="iPhone Mobile Bezel"
              >
                <Smartphone className="w-3 h-3" />
                <span>iPhone</span>
              </button>
              <button
                onClick={() => setDeviceView('fluid')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
                  deviceView === 'fluid'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Fluid Full View"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Fluid</span>
              </button>
            </div>
          </div>
        </div>

        {/* 14 Screens Quick Navigation Strip */}
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Jump to Screen:
          </span>
          {SCREENS_LIST.map((s) => {
            const isActive = currentScreen === s.id;
            return (
              <button
                key={s.id}
                id={`btn-jump-${s.id}`}
                onClick={() => onSelectScreen(s.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/20 ring-1 ring-white/30'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                }`}
              >
                <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-black ${
                  isActive ? 'bg-white text-blue-600' : 'bg-slate-700 text-slate-300'
                }`}>
                  {s.num}
                </span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Preview Container with Ambient Backdrop Lighting */}
      <main className="flex-1 w-full flex items-center justify-center p-2 sm:p-6 my-auto relative">
        {/* Ambient Glowing Background Orbs */}
        <div className="absolute w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none -translate-x-32 -translate-y-20 animate-pulse"></div>
        <div className="absolute w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none translate-x-32 translate-y-20 animate-pulse"></div>
        <div className="absolute w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none translate-y-32"></div>

        {deviceView === 'mobile' ? (
          /* Mobile Device Bezel (iPhone 16 Pro Titanium Style) */
          <div className="relative w-full max-w-[405px] h-[835px] rounded-[54px] bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 p-[11px] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.18),0_0_40px_0_rgba(37,99,235,0.2)] ring-1 ring-slate-700/60 flex flex-col transition-all duration-300">
            {/* Inner Phone Frame Accent Rim */}
            <div className="relative w-full h-full rounded-[44px] bg-[#F8FAFC] text-slate-900 overflow-hidden flex flex-col shadow-2xl ring-1 ring-black/40">
              {/* iOS Status Bar with Sleek Dynamic Island */}
              <div className="h-11 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between text-xs font-bold text-slate-900 select-none shrink-0 z-30 border-b border-slate-100">
                <span className="font-extrabold text-[13px] tracking-tight">9:41</span>

                {/* Dynamic Island with Live Pulse */}
                <div className="w-26 h-5.5 rounded-full bg-black flex items-center justify-between px-2.5 gap-1.5 shadow-md border border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-[9px] font-bold text-emerald-400">SAFE</span>
                  </div>
                  <Shield className="w-2.5 h-2.5 text-blue-400" />
                </div>

                <div className="flex items-center gap-1.5 text-slate-800">
                  <Signal className="w-3.5 h-3.5" />
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-4 h-4 text-emerald-600" />
                </div>
              </div>

              {/* Screen Content */}
              <div className="flex-1 relative overflow-hidden flex flex-col">
                {children}
              </div>

              {/* iOS Home Bar Indicator */}
              <div className="h-4 bg-white/90 backdrop-blur-md flex items-center justify-center shrink-0 z-30">
                <div className="w-32 h-1 rounded-full bg-slate-300" />
              </div>
            </div>
          </div>
        ) : (
          /* Fluid / Fullscreen View Container */
          <div className="w-full max-w-4xl h-[800px] rounded-3xl bg-[#F8FAFC] text-slate-900 shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col relative ring-1 ring-white/10">
            <div className="flex-1 relative overflow-hidden flex flex-col">
              {children}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
