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
    <div className="absolute bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-4 py-2 flex items-center justify-around shadow-2xl">
      {/* Tab 1: Home Dashboard */}
      <button
        id="nav-tab-home"
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition-all ${
          currentScreen === 'dashboard'
            ? 'text-blue-600 font-extrabold'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Home className={`w-5 h-5 ${currentScreen === 'dashboard' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="text-[10px] mt-0.5 font-bold">{t.homeTab}</span>
      </button>

      {/* Tab 2: Routes (Search / Comparison) */}
      <button
        id="nav-tab-routes"
        onClick={() => onNavigate('route_search')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition-all ${
          currentScreen === 'route_search' || currentScreen === 'route_comparison' || currentScreen === 'shap_explain'
            ? 'text-blue-600 font-extrabold'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Compass className={`w-5 h-5 ${
          currentScreen === 'route_search' || currentScreen === 'route_comparison'
            ? 'stroke-[2.5]'
            : 'stroke-[1.75]'
        }`} />
        <span className="text-[10px] mt-0.5 font-bold">{t.routesTab}</span>
      </button>

      {/* Tab 3: Central SOS Floating Action Button */}
      <button
        id="nav-tab-sos"
        onClick={onOpenSos}
        className="relative -top-4 flex flex-col items-center group cursor-pointer"
        title="Trigger Emergency SOS"
      >
        <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-rose-500 via-red-600 to-rose-700 text-white flex items-center justify-center shadow-xl shadow-rose-600/35 border-4 border-white group-hover:scale-105 active:scale-95 transition-all">
          <AlertOctagon className="w-6 h-6 stroke-[2.2] animate-pulse" />
        </div>
        <span className="text-[10px] font-black text-rose-600 tracking-wider uppercase mt-0.5">
          {t.sosTab}
        </span>
      </button>

      {/* Tab 4: Analytics */}
      <button
        id="nav-tab-analytics"
        onClick={() => onNavigate('safety_analytics')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition-all ${
          currentScreen === 'safety_analytics'
            ? 'text-blue-600 font-extrabold'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <TrendingUp className={`w-5 h-5 ${currentScreen === 'safety_analytics' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="text-[10px] mt-0.5 font-bold">{t.analyticsTab}</span>
      </button>

      {/* Tab 5: Profile / Settings */}
      <button
        id="nav-tab-profile"
        onClick={() => onNavigate('profile_settings')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition-all ${
          currentScreen === 'profile_settings'
            ? 'text-blue-600 font-extrabold'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <User className={`w-5 h-5 ${currentScreen === 'profile_settings' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="text-[10px] mt-0.5 font-bold">{t.profileTab}</span>
      </button>
    </div>
  );
};
