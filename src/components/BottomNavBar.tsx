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

  // Hide bottom nav during full-screen splash or live navigation or SOS mode to maximize viewing area
  if (currentScreen === 'splash' || currentScreen === 'live_navigation') {
    return null;
  }

  return (
    <div className="absolute bottom-0 inset-x-0 z-30 bg-white/90 backdrop-blur-2xl border-t border-slate-200/90 px-3 py-1.5 flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      {/* Tab 1: Home Dashboard */}
      <button
        id="nav-tab-home"
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
          currentScreen === 'dashboard'
            ? 'text-blue-600 font-extrabold bg-blue-50/80 shadow-xs'
            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
        }`}
      >
        <Home className={`w-5 h-5 ${currentScreen === 'dashboard' ? 'stroke-[2.5] scale-110' : 'stroke-[1.75]'}`} />
        <span className="text-[10px] mt-0.5 font-bold tracking-tight">{t.homeTab}</span>
      </button>

      {/* Tab 2: Routes (Search / Comparison) */}
      <button
        id="nav-tab-routes"
        onClick={() => onNavigate('route_search')}
        className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
          currentScreen === 'route_search' || currentScreen === 'route_comparison' || currentScreen === 'shap_explain'
            ? 'text-blue-600 font-extrabold bg-blue-50/80 shadow-xs'
            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
        }`}
      >
        <Compass className={`w-5 h-5 ${
          currentScreen === 'route_search' || currentScreen === 'route_comparison'
            ? 'stroke-[2.5] scale-110'
            : 'stroke-[1.75]'
        }`} />
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
        <div className="absolute -inset-1 rounded-full bg-rose-500/30 animate-ping pointer-events-none"></div>
        <div className="absolute -inset-2 rounded-full bg-rose-500/15 animate-pulse pointer-events-none"></div>

        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 via-red-600 to-rose-500 text-white flex items-center justify-center shadow-[0_10px_25px_-3px_rgba(225,29,72,0.5)] border-[3.5px] border-white group-hover:scale-105 active:scale-95 transition-all">
          <AlertOctagon className="w-6 h-6 stroke-[2.4] animate-pulse" />
        </div>
        <span className="text-[9px] font-black text-rose-600 tracking-wider uppercase mt-1 drop-shadow-xs">
          {t.sosTab}
        </span>
      </button>

      {/* Tab 4: Analytics */}
      <button
        id="nav-tab-analytics"
        onClick={() => onNavigate('safety_analytics')}
        className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
          currentScreen === 'safety_analytics'
            ? 'text-blue-600 font-extrabold bg-blue-50/80 shadow-xs'
            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
        }`}
      >
        <TrendingUp className={`w-5 h-5 ${currentScreen === 'safety_analytics' ? 'stroke-[2.5] scale-110' : 'stroke-[1.75]'}`} />
        <span className="text-[10px] mt-0.5 font-bold tracking-tight">{t.analyticsTab}</span>
      </button>

      {/* Tab 5: Profile / Settings */}
      <button
        id="nav-tab-profile"
        onClick={() => onNavigate('profile_settings')}
        className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
          currentScreen === 'profile_settings'
            ? 'text-blue-600 font-extrabold bg-blue-50/80 shadow-xs'
            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
        }`}
      >
        <User className={`w-5 h-5 ${currentScreen === 'profile_settings' ? 'stroke-[2.5] scale-110' : 'stroke-[1.75]'}`} />
        <span className="text-[10px] mt-0.5 font-bold tracking-tight">{t.profileTab}</span>
      </button>
    </div>
  );
};
