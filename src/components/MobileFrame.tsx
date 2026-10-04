import React, { useState } from 'react';
import { 
  Smartphone, 
  Maximize2, 
  Shield, 
  Wifi, 
  Battery, 
  Signal, 
  AlertTriangle, 
  Clock, 
  Moon, 
  Sun 
} from 'lucide-react';
import { ScreenId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

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
  { id: 'public_gathering_hub', num: 15, label: 'Gathering Hub' },
  { id: 'safe_haven_network', num: 16, label: 'Safe Havens' },
  { id: 'transport_companion', num: 17, label: 'Transit Companion' },
  { id: 'infrastructure_reporting', num: 18, label: 'Infrastructure' },
  { id: 'community_safe_walk', num: 19, label: 'Safe Walk' },
];

export const MobileFrame: React.FC<MobileFrameProps> = ({
  currentScreen,
  onSelectScreen,
  children,
  onTriggerAlert,
  onTriggerCheckIn
}) => {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [deviceView, setDeviceView] = useState<'mobile' | 'fluid'>('mobile');

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100 flex flex-col select-none font-sans">
      {/* Top Prototype Controls Banner (Compact Viewport Height Friendly) */}
      <header className="w-full bg-neutral-900 border-b border-neutral-800 px-3 py-2 z-40 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1.5">
          {/* Brand & Badge */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-black">
              <Shield className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-tight text-white">SafeRoute AI</span>
              <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 text-[9px] font-bold">
                Women's Night Navigation
              </span>
            </div>
          </div>

          {/* Quick Simulation Triggers & View Toggle */}
          <div className="flex items-center gap-1.5">
            {/* Global Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors flex items-center gap-1 cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-neutral-300" />}
              <span className="text-[10px] font-bold hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            {/* Global Language Selector */}
            <div className="flex items-center gap-1 bg-neutral-800 px-2 py-1 rounded-lg border border-neutral-700">
              <select
                id="header-language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-[11px] font-bold text-neutral-200 focus:outline-none cursor-pointer"
                title="Select Application Language"
              >
                <option value="en" className="bg-neutral-900 text-white">EN</option>
                <option value="hi" className="bg-neutral-900 text-white">HI (हिन्दी)</option>
                <option value="es" className="bg-neutral-900 text-white">ES</option>
                <option value="fr" className="bg-neutral-900 text-white">FR</option>
              </select>
            </div>

            {/* Simulate Alert Action */}
            <button
              onClick={onTriggerAlert}
              className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-red-400 hover:text-red-300 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Test Screen 8 Safety Incident Alert"
            >
              <AlertTriangle className="w-3 h-3 text-red-500" />
              <span>Alert</span>
            </button>

            {/* Simulate 30s Check-In Action */}
            <button
              onClick={onTriggerCheckIn}
              className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 hover:text-white text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Test Screen 10 30s Safety Check-In"
            >
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Check-In</span>
            </button>

            <div className="h-4 w-px bg-neutral-800" />

            {/* View Mode Toggle */}
            <div className="bg-neutral-800 p-0.5 rounded-lg flex border border-neutral-700">
              <button
                onClick={() => setDeviceView('mobile')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  deviceView === 'mobile'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="iPhone Mobile Bezel"
              >
                <Smartphone className="w-3 h-3" />
                <span>iPhone</span>
              </button>
              <button
                onClick={() => setDeviceView('fluid')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  deviceView === 'fluid'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Fluid View"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Fluid</span>
              </button>
            </div>
          </div>
        </div>

        {/* 19 Screens Quick Navigation Strip */}
        <div className="max-w-7xl mx-auto mt-1.5 pt-1.5 border-t border-neutral-800 flex items-center gap-1 overflow-x-auto no-scrollbar">
          <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider shrink-0 mr-1">
            Screens:
          </span>
          {SCREENS_LIST.map((s) => {
            const isActive = currentScreen === s.id;
            return (
              <button
                key={s.id}
                id={`btn-jump-${s.id}`}
                onClick={() => onSelectScreen(s.id)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-white text-black shadow-xs font-black'
                    : 'bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/60'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded text-[8px] flex items-center justify-center font-black ${
                  isActive ? 'bg-black text-white' : 'bg-neutral-700 text-neutral-300'
                }`}>
                  {s.num}
                </span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Preview Container — Responsive Fit Guaranteed Without Window Scrolling */}
      <main className="flex-1 min-h-0 w-full flex items-center justify-center p-2 sm:p-3 overflow-hidden relative">
        {deviceView === 'mobile' ? (
          /* Mobile Device Frame — Proportional Aspect Ratio Sizing */
          <div className="relative h-full max-h-[min(812px,100%)] aspect-[390/812] max-w-[min(400px,94vw)] rounded-[44px] bg-neutral-900 border border-neutral-700/80 p-2 shadow-2xl flex flex-col overflow-hidden shrink-0 transition-all duration-200">
            {/* Inner Phone Screen */}
            <div className="relative w-full h-full rounded-[36px] overflow-hidden flex flex-col bg-white dark:bg-black text-black dark:text-white transition-colors">
              {/* iOS Status Bar */}
              <div className="h-8 px-5 flex items-center justify-between text-[11px] font-bold select-none shrink-0 z-30 border-b border-neutral-200/40 dark:border-neutral-800/60 bg-white/95 dark:bg-black/95">
                <span className="font-extrabold tracking-tight">9:41</span>

                {/* Dynamic Island */}
                <div className="w-22 h-4.5 rounded-full bg-black dark:bg-neutral-900 flex items-center justify-between px-2 gap-1 border border-neutral-700/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[8px] font-black text-white tracking-wider">SAFE</span>
                  <Shield className="w-2.5 h-2.5 text-white" />
                </div>

                <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* App Viewport Container */}
              <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
                {children}
              </div>

              {/* iOS Home Bar Indicator */}
              <div className="h-3 flex items-center justify-center shrink-0 z-30 bg-white/95 dark:bg-black/95">
                <div className="w-28 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              </div>
            </div>
          </div>
        ) : (
          /* Fluid / Tablet Application Preview */
          <div className="w-full max-w-3xl h-full max-h-[min(820px,100%)] rounded-2xl bg-white dark:bg-black text-black dark:text-white border border-neutral-300 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col relative transition-colors">
            <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col max-w-xl mx-auto w-full">
              {children}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
