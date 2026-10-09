import React, { useState, useEffect, useRef } from 'react';
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
  Sun,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Check,
  X,
  Siren,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ScreenId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { TRANSITIONS, popoverVariants } from '../utils/motion';

interface MobileFrameProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  children: React.ReactNode;
  onTriggerAlert: () => void;
  onTriggerCheckIn: () => void;
  portalMode?: 'citizen' | 'police_command';
  onSelectPortalMode?: (mode: 'citizen' | 'police_command') => void;
}

interface ScreenItem {
  id: ScreenId;
  num: number;
  label: string;
  group: 'Entry & Onboarding' | 'Core Route Intelligence' | 'Journey & Emergency' | 'Personal, Transit & Community';
}

const SCREENS_LIST: ScreenItem[] = [
  // Group 1: Entry & Onboarding
  { id: 'splash', num: 1, label: 'Splash Screen', group: 'Entry & Onboarding' },
  { id: 'login', num: 2, label: 'Login & Verification', group: 'Entry & Onboarding' },

  // Group 2: Core Route Intelligence
  { id: 'dashboard', num: 3, label: 'Home Dashboard', group: 'Core Route Intelligence' },
  { id: 'route_search', num: 4, label: 'Route Search', group: 'Core Route Intelligence' },
  { id: 'route_comparison', num: 5, label: 'Route Comparison', group: 'Core Route Intelligence' },
  { id: 'shap_explain', num: 6, label: 'SHAP Explainability', group: 'Core Route Intelligence' },

  // Group 3: Journey & Emergency
  { id: 'live_navigation', num: 7, label: 'Live Navigation', group: 'Journey & Emergency' },
  { id: 'safety_alert', num: 8, label: 'Safety Alert Modal', group: 'Journey & Emergency' },
  { id: 'dynamic_reroute', num: 9, label: 'Dynamic Rerouting', group: 'Journey & Emergency' },
  { id: 'safety_checkin', num: 10, label: 'Safety Check-In', group: 'Journey & Emergency' },
  { id: 'emergency_sos', num: 11, label: 'Emergency SOS', group: 'Journey & Emergency' },

  // Group 4: Personal, Transit & Community
  { id: 'trusted_contacts', num: 12, label: 'Trusted Contacts', group: 'Personal, Transit & Community' },
  { id: 'safety_analytics', num: 13, label: 'Safety Analytics', group: 'Personal, Transit & Community' },
  { id: 'profile_settings', num: 14, label: 'Profile & Settings', group: 'Personal, Transit & Community' },
  { id: 'public_gathering_hub', num: 15, label: 'Public Gathering Hub', group: 'Personal, Transit & Community' },
  { id: 'safe_haven_network', num: 16, label: 'Safe Haven Network', group: 'Personal, Transit & Community' },
  { id: 'transport_companion', num: 17, label: 'Transit Companion', group: 'Personal, Transit & Community' },
  { id: 'infrastructure_reporting', num: 18, label: 'Infrastructure Hub', group: 'Personal, Transit & Community' },
  { id: 'community_safe_walk', num: 19, label: 'Community Safe Walk', group: 'Personal, Transit & Community' },
  { id: 'proactive_police_monitoring', num: 20, label: 'Proactive Police Monitor', group: 'Personal, Transit & Community' },
  { id: 'nearest_safe_place', num: 21, label: 'Nearest Safe Place Finder', group: 'Journey & Emergency' },
];

const SCREEN_GROUPS = [
  'Entry & Onboarding',
  'Core Route Intelligence',
  'Journey & Emergency',
  'Personal, Transit & Community'
] as const;

export const MobileFrame: React.FC<MobileFrameProps> = ({
  currentScreen,
  onSelectScreen,
  children,
  onTriggerAlert,
  onTriggerCheckIn,
  portalMode = 'citizen',
  onSelectPortalMode
}) => {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { liveTime } = useUser();
  const [deviceView, setDeviceView] = useState<'mobile' | 'fluid'>('mobile');
  const [isScreenMenuOpen, setIsScreenMenuOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const shouldReduceMotion = useReducedMotion();
  
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const [containerHeight, setContainerHeight] = useState<number>(() => 
    typeof window !== 'undefined' ? Math.max(480, window.innerHeight - 90) : 844
  );

  useEffect(() => {
    const updateSize = () => {
      if (mainRef.current) {
        const rect = mainRef.current.getBoundingClientRect();
        const computed = window.getComputedStyle(mainRef.current);
        const padY = (parseFloat(computed.paddingTop) || 0) + (parseFloat(computed.paddingBottom) || 0);
        const usableH = rect.height - padY;
        if (usableH > 100) {
          setContainerHeight(usableH);
        }
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (mainRef.current) observer.observe(mainRef.current);
    window.addEventListener('resize', updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Compute realistic smartphone proportions constrained by available viewport
  const maxPhoneHeight = Math.min(844, containerHeight);
  const phoneHeight = Math.max(480, Math.floor(maxPhoneHeight));
  const phoneWidth = Math.min(390, Math.max(360, Math.round(phoneHeight * (390 / 844))));
  const fluidHeight = Math.max(480, Math.floor(Math.min(844, containerHeight)));

  // Current screen lookup
  const currentIndex = SCREENS_LIST.findIndex((s) => s.id === currentScreen);
  const currentItem = SCREENS_LIST[currentIndex] || SCREENS_LIST[0];

  // Previous and Next navigation handlers
  const handlePrevScreen = () => {
    if (currentIndex > 0) {
      onSelectScreen(SCREENS_LIST[currentIndex - 1].id);
    }
  };

  const handleNextScreen = () => {
    if (currentIndex < SCREENS_LIST.length - 1) {
      onSelectScreen(SCREENS_LIST[currentIndex + 1].id);
    }
  };

  // Close screen popover on click outside or Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isScreenMenuOpen) {
        setIsScreenMenuOpen(false);
        triggerButtonRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        isScreenMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerButtonRef.current &&
        !triggerButtonRef.current.contains(e.target as Node)
      ) {
        setIsScreenMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isScreenMenuOpen]);

  // Focus search input when menu opens
  useEffect(() => {
    if (isScreenMenuOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchFilter('');
    }
  }, [isScreenMenuOpen]);

  // Filtered screens for popover menu
  const filteredScreens = SCREENS_LIST.filter((s) => {
    if (!searchFilter.trim()) return true;
    const query = searchFilter.toLowerCase();
    return (
      s.label.toLowerCase().includes(query) ||
      s.id.toLowerCase().includes(query) ||
      String(s.num).includes(query) ||
      s.group.toLowerCase().includes(query)
    );
  });

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-white dark:bg-black text-black dark:text-white flex flex-col select-none font-sans transition-colors duration-150">
      {/* ========================================================================= */}
      {/* PROTOTYPE HEADER & TOOLBAR                                                */}
      {/* ========================================================================= */}
      <header className="w-full bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800 px-3 sm:px-4 py-2 z-40 shrink-0 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col gap-2">
          {/* ROW 1: Brand & Global Control Suite */}
          <div className="flex items-center justify-between gap-3">
            {/* Left: Minimal Monochrome Brand */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-7 h-7 rounded-md bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-black transition-colors">
                <Shield className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black tracking-tight text-black dark:text-white">
                  SafeRoute AI
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-800">
                  Prototype
                </span>
              </div>
            </div>

            {/* Middle: Dedicated Portal Switcher (Citizen App vs Police Command Center) */}
            {onSelectPortalMode && (
              <div 
                role="tablist"
                aria-label="Platform View Mode"
                className="flex items-center p-0.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-[11px] font-black"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={portalMode === 'citizen'}
                  onClick={() => onSelectPortalMode('citizen')}
                  className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    portalMode === 'citizen'
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-black'
                      : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white font-semibold'
                  }`}
                  title="Switch to Passenger / Citizen Mobile App"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Citizen Mobile</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={portalMode === 'police_command'}
                  onClick={() => onSelectPortalMode('police_command')}
                  className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    portalMode === 'police_command'
                      ? 'bg-red-600 text-white shadow-xs font-black'
                      : 'text-neutral-500 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400 font-semibold'
                  }`}
                  title="Switch to 112 Police & PCR Command Workstation"
                >
                  <Siren className="w-3.5 h-3.5" />
                  <span>112 Police Command HQ</span>
                </button>
              </div>
            )}

            {/* Right: Global Toolbar Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* 1. Theme Selector: [ ☀ Light | ☾ Dark ] with Shared Motion Indicator */}
              <div 
                role="radiogroup" 
                aria-label="Theme Selection"
                className="relative inline-flex items-center p-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 transition-colors"
              >
                <button
                  type="button"
                  role="radio"
                  id="header-theme-light"
                  aria-checked={theme === 'light'}
                  onClick={() => setTheme('light')}
                  className="relative px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white transition-colors"
                  title="Switch to Light Theme"
                >
                  {theme === 'light' && (
                    <motion.span
                      layoutId="active-theme-indicator"
                      transition={shouldReduceMotion ? TRANSITIONS.reduced : TRANSITIONS.indicatorSpring}
                      className="absolute inset-0 rounded-md bg-white shadow-xs z-0"
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-1.5 ${theme === 'light' ? 'text-black font-black' : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white font-medium'}`}>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline">Light</span>
                  </span>
                </button>

                <button
                  type="button"
                  role="radio"
                  id="header-theme-dark"
                  aria-checked={theme === 'dark'}
                  onClick={() => setTheme('dark')}
                  className="relative px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white transition-colors"
                  title="Switch to Dark Theme"
                >
                  {theme === 'dark' && (
                    <motion.span
                      layoutId="active-theme-indicator"
                      transition={shouldReduceMotion ? TRANSITIONS.reduced : TRANSITIONS.indicatorSpring}
                      className="absolute inset-0 rounded-md bg-black shadow-xs z-0"
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-1.5 ${theme === 'dark' ? 'text-white font-black' : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white font-medium'}`}>
                    <Moon className="w-3.5 h-3.5 text-neutral-300" />
                    <span className="hidden sm:inline">Dark</span>
                  </span>
                </button>
              </div>

              {/* 2. Global Language Selector */}
              <div className="inline-flex items-center bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-300 dark:border-neutral-800 px-2 py-1 transition-colors">
                <select
                  id="header-language-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-transparent text-[11px] font-bold text-black dark:text-white focus:outline-none cursor-pointer"
                  title="Select Application Language"
                  aria-label="Application Language"
                >
                  <option value="en" className="bg-white dark:bg-black text-black dark:text-white">EN</option>
                  <option value="hi" className="bg-white dark:bg-black text-black dark:text-white">HI (हिन्दी)</option>
                  <option value="es" className="bg-white dark:bg-black text-black dark:text-white">ES</option>
                  <option value="fr" className="bg-white dark:bg-black text-black dark:text-white">FR</option>
                </select>
              </div>

              {/* 3. Safety Incident Alert Action */}
              <motion.button
                type="button"
                id="header-btn-trigger-alert"
                onClick={onTriggerAlert}
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                className="px-2 sm:px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-red-50 dark:bg-neutral-900 dark:hover:bg-red-950/30 border border-neutral-300 hover:border-red-300 dark:border-neutral-800 dark:hover:border-red-900 text-red-600 dark:text-red-400 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
                title="Simulate Screen 8 Safety Incident Alert"
              >
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Alert</span>
              </motion.button>

              {/* 4. Safety Check-In Action */}
              <motion.button
                type="button"
                id="header-btn-trigger-checkin"
                onClick={onTriggerCheckIn}
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                className="px-2 sm:px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-800 text-black dark:text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white"
                title="Simulate Screen 10 Safety Check-In"
              >
                <Clock className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 shrink-0" />
                <span className="hidden sm:inline">Check-In</span>
              </motion.button>

              {/* 5. Preview Mode Selector: [ Phone | Fluid ] with Shared Motion Indicator */}
              <div 
                role="radiogroup" 
                aria-label="Device Viewport Mode"
                className="relative inline-flex items-center p-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 transition-colors"
              >
                <button
                  type="button"
                  role="radio"
                  id="header-view-phone"
                  aria-checked={deviceView === 'mobile'}
                  onClick={() => setDeviceView('mobile')}
                  className="relative px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white transition-colors"
                  title="Phone Device Frame Preview"
                >
                  {deviceView === 'mobile' && (
                    <motion.span
                      layoutId="active-preview-indicator"
                      transition={shouldReduceMotion ? TRANSITIONS.reduced : TRANSITIONS.indicatorSpring}
                      className="absolute inset-0 rounded-md bg-black text-white dark:bg-white dark:text-black shadow-xs z-0"
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-1.5 ${deviceView === 'mobile' ? 'text-white dark:text-black font-black' : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white font-medium'}`}>
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Phone</span>
                  </span>
                </button>

                <button
                  type="button"
                  role="radio"
                  id="header-view-fluid"
                  aria-checked={deviceView === 'fluid'}
                  onClick={() => setDeviceView('fluid')}
                  className="relative px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white transition-colors"
                  title="Fluid Responsive Preview"
                >
                  {deviceView === 'fluid' && (
                    <motion.span
                      layoutId="active-preview-indicator"
                      transition={shouldReduceMotion ? TRANSITIONS.reduced : TRANSITIONS.indicatorSpring}
                      className="absolute inset-0 rounded-md bg-black text-white dark:bg-white dark:text-black shadow-xs z-0"
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-1.5 ${deviceView === 'fluid' ? 'text-white dark:text-black font-black' : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white font-medium'}`}>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Fluid</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* ROW 2: Structured Screen Navigation Toolbar */}
          <div className="relative pt-1.5 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2">
            {/* Left: Screens Label + Active Screen Selector Dropdown Trigger */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10px] font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-wider shrink-0">
                SCREENS
              </span>

              {/* Screen Dropdown Trigger Button */}
              <div className="relative">
                <button
                  ref={triggerButtonRef}
                  type="button"
                  id="header-screen-menu-trigger"
                  aria-haspopup="true"
                  aria-expanded={isScreenMenuOpen}
                  onClick={() => setIsScreenMenuOpen(!isScreenMenuOpen)}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-800 text-black dark:text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white"
                >
                  <span className="font-mono text-[11px] px-1 py-0.2 rounded bg-black text-white dark:bg-white dark:text-black font-black">
                    {String(currentItem.num).padStart(2, '0')}
                  </span>
                  <span className="truncate max-w-[140px] sm:max-w-[220px]">
                    {currentItem.label}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-150 ${isScreenMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Popover Menu with Animated Entrance / Exit */}
                <AnimatePresence>
                  {isScreenMenuOpen && (
                    <motion.div
                      ref={menuRef}
                      role="menu"
                      aria-label="All Prototype Screens"
                      variants={shouldReduceMotion ? undefined : popoverVariants}
                      initial={shouldReduceMotion ? false : "initial"}
                      animate={shouldReduceMotion ? false : "animate"}
                      exit={shouldReduceMotion ? false : "exit"}
                      className="absolute left-0 top-full mt-1.5 w-80 sm:w-96 max-h-[75vh] rounded-xl bg-white dark:bg-neutral-950 text-black dark:text-white border border-neutral-300 dark:border-neutral-800 shadow-2xl p-2 z-50 flex flex-col overflow-hidden transition-colors origin-top-left"
                    >
                      {/* Menu Header with Search Filter */}
                      <div className="pb-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                        <div className="relative flex-1">
                          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            placeholder="Search 19 screens..."
                            className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg pl-8 pr-7 py-1 text-xs text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                          />
                          {searchFilter && (
                            <button
                              type="button"
                              onClick={() => setSearchFilter('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black dark:hover:text-white"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Grouped Screens Scroll Area */}
                      <div className="flex-1 overflow-y-auto py-1 space-y-2 no-scrollbar max-h-[58vh]">
                        {SCREEN_GROUPS.map((group) => {
                          const screensInGroup = filteredScreens.filter((s) => s.group === group);
                          if (screensInGroup.length === 0) return null;

                          return (
                            <div key={group} className="space-y-0.5">
                              <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400 sticky top-0 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xs">
                                {group}
                              </div>
                              <div className="space-y-0.5">
                                {screensInGroup.map((s) => {
                                  const isActive = currentScreen === s.id;
                                  return (
                                    <button
                                      key={s.id}
                                      id={`btn-jump-${s.id}`}
                                      type="button"
                                      role="menuitem"
                                      onClick={() => {
                                        onSelectScreen(s.id);
                                        setIsScreenMenuOpen(false);
                                      }}
                                      className={`w-full px-2 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between gap-2 transition-colors cursor-pointer text-left ${
                                        isActive
                                          ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        <span className={`w-5 h-5 rounded text-[10px] font-mono flex items-center justify-center shrink-0 font-bold ${
                                          isActive
                                            ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black'
                                            : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
                                        }`}>
                                          {String(s.num).padStart(2, '0')}
                                        </span>
                                        <span className="truncate">{s.label}</span>
                                      </div>
                                      {isActive && (
                                        <Check className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}

                        {filteredScreens.length === 0 && (
                          <div className="py-6 text-center text-xs text-neutral-500">
                            No screens matching "{searchFilter}"
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Step Navigation Controls [< Prev] [03 / 19] [Next >] */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-mono font-bold text-neutral-500 dark:text-neutral-400 px-1 hidden sm:inline">
                {String(currentIndex + 1).padStart(2, '0')} / {String(SCREENS_LIST.length).padStart(2, '0')}
              </span>

              <motion.button
                type="button"
                id="header-btn-prev-screen"
                onClick={handlePrevScreen}
                disabled={currentIndex <= 0}
                whileHover={shouldReduceMotion || currentIndex <= 0 ? undefined : { scale: 1.02 }}
                whileTap={shouldReduceMotion || currentIndex <= 0 ? undefined : { scale: 0.96 }}
                aria-label="Previous screen"
                className={`px-2 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 transition-colors ${
                  currentIndex <= 0
                    ? 'border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50'
                    : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border-neutral-300 dark:border-neutral-800 text-black dark:text-white cursor-pointer'
                }`}
                title="Go to previous screen"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </motion.button>

              <motion.button
                type="button"
                id="header-btn-next-screen"
                onClick={handleNextScreen}
                disabled={currentIndex >= SCREENS_LIST.length - 1}
                whileHover={shouldReduceMotion || currentIndex >= SCREENS_LIST.length - 1 ? undefined : { scale: 1.02 }}
                whileTap={shouldReduceMotion || currentIndex >= SCREENS_LIST.length - 1 ? undefined : { scale: 0.96 }}
                aria-label="Next screen"
                className={`px-2 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 transition-colors ${
                  currentIndex >= SCREENS_LIST.length - 1
                    ? 'border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50'
                    : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border-neutral-300 dark:border-neutral-800 text-black dark:text-white cursor-pointer'
                }`}
                title="Go to next screen"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN PREVIEW CONTAINER (Outer Frame Animation Only — Zero Content Scale)   */}
      {/* ========================================================================= */}
      <main 
        ref={mainRef}
        className="flex-1 min-h-0 w-full flex items-center justify-center p-2.5 sm:p-4 overflow-hidden relative bg-white dark:bg-black transition-colors duration-150"
      >
        {/* Outer Frame: Pure layout geometry transition (width, height, max-width, radius, padding).
            NO transform: scale, NO layout prop, NO spring bounce. Inner UI never scales or boings. */}
        <div
          className={`relative flex flex-col overflow-hidden shrink-0 border ${
            deviceView === 'mobile'
              ? 'rounded-[44px] bg-neutral-100 dark:bg-neutral-950 p-2 phone-frame-shell'
              : 'w-full max-w-3xl rounded-2xl bg-white dark:bg-black p-0 fluid-frame-shell'
          }`}
          style={{
            width: deviceView === 'mobile' ? `${phoneWidth}px` : '100%',
            height: deviceView === 'mobile' ? `${phoneHeight}px` : `${fluidHeight}px`,
            maxWidth: deviceView === 'mobile' ? 'min(390px, 94vw)' : '48rem',
            maxHeight: '100%',
            transition: shouldReduceMotion
              ? 'none'
              : 'width 350ms cubic-bezier(0.16, 1, 0.3, 1), height 350ms cubic-bezier(0.16, 1, 0.3, 1), max-width 350ms cubic-bezier(0.16, 1, 0.3, 1), border-radius 350ms cubic-bezier(0.16, 1, 0.3, 1), padding 350ms cubic-bezier(0.16, 1, 0.3, 1), background-color 150ms ease, border-color 150ms ease, box-shadow 350ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Inner Screen Container */}
          <div
            className={`relative w-full h-full overflow-hidden flex flex-col bg-white dark:bg-black text-black dark:text-white ${
              deviceView === 'mobile' ? 'rounded-[36px]' : 'rounded-2xl'
            }`}
            style={{
              transition: shouldReduceMotion
                ? 'none'
                : 'border-radius 350ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* iOS Status Bar (Device Chrome: Clean height/opacity transition without scaling content) */}
            <div
              className={`h-8 px-3.5 sm:px-5 flex items-center justify-between text-[11px] font-bold select-none shrink-0 z-30 border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/95 dark:bg-black/95 overflow-hidden ${
                deviceView === 'mobile' ? 'opacity-100' : 'h-0 opacity-0 pointer-events-none border-b-0 py-0'
              }`}
              style={{
                transition: shouldReduceMotion
                  ? 'none'
                  : 'height 250ms cubic-bezier(0.16, 1, 0.3, 1), opacity 250ms cubic-bezier(0.16, 1, 0.3, 1), padding 250ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <span className="font-extrabold tracking-tight">{liveTime}</span>

              {/* Dynamic Island */}
              <div className="w-20 sm:w-22 h-4.5 rounded-full bg-black dark:bg-neutral-900 flex items-center justify-between px-2 gap-1 border border-neutral-800 dark:border-neutral-700/50">
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

            {/* App Viewport Container (Renders children with stable CSS layout - never scaled or distorted) */}
            <div className={`flex-1 min-h-0 relative overflow-hidden flex flex-col ${deviceView === 'fluid' ? 'max-w-xl mx-auto w-full' : 'w-full'}`}>
              {children}
            </div>

            {/* iOS Home Bar Indicator (Device Chrome: Clean height/opacity transition without scaling content) */}
            <div
              className={`h-3 flex items-center justify-center shrink-0 z-30 bg-white/95 dark:bg-black/95 overflow-hidden ${
                deviceView === 'mobile' ? 'opacity-100' : 'h-0 opacity-0 pointer-events-none'
              }`}
              style={{
                transition: shouldReduceMotion
                  ? 'none'
                  : 'height 250ms cubic-bezier(0.16, 1, 0.3, 1), opacity 250ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div className="w-24 sm:w-28 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
