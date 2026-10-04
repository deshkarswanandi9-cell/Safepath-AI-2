import React from 'react';
import { 
  Home, 
  Compass, 
  AlertOctagon, 
  TrendingUp, 
  User
} from 'lucide-react';
import { ScreenId } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavBarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenSos: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
  onOpenSos
}) => {
  const { t } = useLanguage();

  // Hide bottom nav during full-screen splash or live navigation or SOS mode
  if (currentScreen === 'splash' || currentScreen === 'live_navigation') {
    return null;
  }

  const isHome = currentScreen === 'dashboard';
  const isRoutes = currentScreen === 'route_search' || currentScreen === 'route_comparison' || currentScreen === 'shap_explain';
  const isAnalytics = currentScreen === 'safety_analytics';
  const isProfile = currentScreen === 'profile_settings';

  return (
    <div className="absolute bottom-0 inset-x-0 z-30 bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 px-3 py-1.5 flex items-center justify-around shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
      {/* Tab 1: Home Dashboard */}
      <button
        id="nav-tab-home"
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
          isHome
            ? 'text-cyan-400 font-extrabold bg-cyan-950/60 border border-cyan-500/30 shadow-inner shadow-cyan-500/10'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`}
      >
        <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.5] scale-110' : 'stroke-[1.75]'}`} />
        <span className="text-[10px] mt-0.5 font-bold tracking-tight">{t.homeTab}</span>
      </button>

      {/* Tab 2: Routes (Search / Comparison) */}
      <button
        id="nav-tab-routes"
        onClick={() => onNavigate('route_search')}
        className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
          isRoutes
            ? 'text-blue-400 font-extrabold bg-blue-950/60 border border-blue-500/30 shadow-inner shadow-blue-500/10'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`}
      >
        <Compass className={`w-5 h-5 ${isRoutes ? 'stroke-[2.5] scale-110' : 'stroke-[1.75]'}`} />
        <span className="text-[10px] mt-0.5 font-bold tracking-tight">{t.routesTab}</span>
      </button>

      {/* Tab 3: Central SOS Floating Action Button */}
      <button
        id="nav-tab-sos"
        onClick={onOpenSos}
        className="relative -top-5 flex flex-col items-center group cursor-pointer"
        title="Trigger Emergency SOS"
      >
        {/* Pulsing Glow Radar Rings */}
        <div className="absolute -inset-1 rounded-full bg-rose-500/25 animate-ping pointer-events-none"></div>
        <div className="absolute -inset-2.5 rounded-full bg-rose-500/10 animate-pulse pointer-events-none"></div>

        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 via-red-600 to-rose-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(225,29,72,0.6)] border-[3px] border-slate-950 group-hover:scale-105 active:scale-95 transition-all">
          <AlertOctagon className="w-6 h-6 stroke-[2.4]" />
        </div>
        <span className="text-[9px] font-black text-rose-400 tracking-wider uppercase mt-1">
          {t.sosTab}
        </span>
      </button>

      {/* Tab 4: Analytics */}
      <button
        id="nav-tab-analytics"
        onClick={() => onNavigate('safety_analytics')}
        className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
          isAnalytics
            ? 'text-purple-400 font-extrabold bg-purple-950/60 border border-purple-500/30 shadow-inner shadow-purple-500/10'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`}
      >
        <TrendingUp className={`w-5 h-5 ${isAnalytics ? 'stroke-[2.5] scale-110' : 'stroke-[1.75]'}`} />
        <span className="text-[10px] mt-0.5 font-bold tracking-tight">{t.analyticsTab}</span>
      </button>

      {/* Tab 5: Profile / Settings */}
      <button
        id="nav-tab-profile"
        onClick={() => onNavigate('profile_settings')}
        className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
          isProfile
            ? 'text-emerald-400 font-extrabold bg-emerald-950/60 border border-emerald-500/30 shadow-inner shadow-emerald-500/10'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`}
      >
        <User className={`w-5 h-5 ${isProfile ? 'stroke-[2.5] scale-110' : 'stroke-[1.75]'}`} />
        <span className="text-[10px] mt-0.5 font-bold tracking-tight">{t.profileTab}</span>
      </button>
    </div>
  );
};
