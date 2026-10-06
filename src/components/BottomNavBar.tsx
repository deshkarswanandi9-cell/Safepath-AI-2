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

  // Hide bottom nav during full-screen splash or live navigation
  if (currentScreen === 'splash' || currentScreen === 'live_navigation') {
    return null;
  }

  const isHome = currentScreen === 'dashboard';
  const isRoutes = currentScreen === 'route_search' || currentScreen === 'route_comparison' || currentScreen === 'shap_explain';
  const isAnalytics = currentScreen === 'safety_analytics';
  const isProfile = currentScreen === 'profile_settings';

  return (
    <nav 
      aria-label="Primary Navigation"
      className="relative shrink-0 z-30 bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 px-2 sm:px-3 py-1 flex items-center justify-around transition-colors shadow-sm"
    >
      {/* Tab 1: Home Dashboard */}
      <button
        id="nav-tab-home"
        type="button"
        onClick={() => onNavigate('dashboard')}
        aria-label={t.homeTab}
        aria-current={isHome ? 'page' : undefined}
        className={`flex-1 min-w-0 flex flex-col items-center py-1 px-1 rounded-lg transition-colors cursor-pointer ${
          isHome
            ? 'text-black dark:text-white font-extrabold'
            : 'text-neutral-500 hover:text-black dark:hover:text-white'
        }`}
      >
        <Home className={`w-4.5 h-4.5 ${isHome ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="text-[9px] mt-0.5 tracking-tight truncate max-w-full">{t.homeTab}</span>
      </button>

      {/* Tab 2: Routes */}
      <button
        id="nav-tab-routes"
        type="button"
        onClick={() => onNavigate('route_search')}
        aria-label={t.routesTab}
        aria-current={isRoutes ? 'page' : undefined}
        className={`flex-1 min-w-0 flex flex-col items-center py-1 px-1 rounded-lg transition-colors cursor-pointer ${
          isRoutes
            ? 'text-black dark:text-white font-extrabold'
            : 'text-neutral-500 hover:text-black dark:hover:text-white'
        }`}
      >
        <Compass className={`w-4.5 h-4.5 ${isRoutes ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="text-[9px] mt-0.5 tracking-tight truncate max-w-full">{t.routesTab}</span>
      </button>

      {/* Tab 3: Central SOS Action Button */}
      <button
        id="nav-tab-sos"
        type="button"
        onClick={onOpenSos}
        aria-label="Emergency SOS Action"
        className="relative -top-2.5 flex flex-col items-center group cursor-pointer shrink-0 px-1"
        title="Trigger Emergency SOS"
      >
        <div className="w-11 h-11 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-black active:scale-95 transition-all">
          <AlertOctagon className="w-5 h-5 stroke-[2.4]" />
        </div>
        <span className="text-[8px] font-black text-red-600 dark:text-red-400 tracking-wider uppercase mt-0.5">
          {t.sosTab}
        </span>
      </button>

      {/* Tab 4: Analytics */}
      <button
        id="nav-tab-analytics"
        type="button"
        onClick={() => onNavigate('safety_analytics')}
        aria-label={t.analyticsTab}
        aria-current={isAnalytics ? 'page' : undefined}
        className={`flex-1 min-w-0 flex flex-col items-center py-1 px-1 rounded-lg transition-colors cursor-pointer ${
          isAnalytics
            ? 'text-black dark:text-white font-extrabold'
            : 'text-neutral-500 hover:text-black dark:hover:text-white'
        }`}
      >
        <TrendingUp className={`w-4.5 h-4.5 ${isAnalytics ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="text-[9px] mt-0.5 tracking-tight truncate max-w-full">{t.analyticsTab}</span>
      </button>

      {/* Tab 5: Profile / Settings */}
      <button
        id="nav-tab-profile"
        type="button"
        onClick={() => onNavigate('profile_settings')}
        aria-label={t.profileTab}
        aria-current={isProfile ? 'page' : undefined}
        className={`flex-1 min-w-0 flex flex-col items-center py-1 px-1 rounded-lg transition-colors cursor-pointer ${
          isProfile
            ? 'text-black dark:text-white font-extrabold'
            : 'text-neutral-500 hover:text-black dark:hover:text-white'
        }`}
      >
        <User className={`w-4.5 h-4.5 ${isProfile ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="text-[9px] mt-0.5 tracking-tight truncate max-w-full">{t.profileTab}</span>
      </button>
    </nav>
  );
};
