import React from 'react';
import { 
  Shield, 
  MapPin, 
  SunMedium, 
  ArrowRight, 
  Bell, 
  ShieldCheck, 
  Radio, 
  Activity,
  Compass,
  AlertTriangle
} from 'lucide-react';
import { ScreenId } from '../../types';
import { MapEngine } from '../MapEngine';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenSos: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate, onOpenSos }) => {
  const { t } = useLanguage();

  return (
    <div className="relative h-full flex flex-col bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar pb-6">
      {/* Top Header */}
      <header className="px-4 pt-3 pb-3 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-black/95 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('profile_settings')}
              className="relative cursor-pointer group rounded-xl p-0.5 border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-colors"
              title="View Profile Settings"
              aria-label="Profile and Settings"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                  alt="Shivani profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-black rounded-full" />
            </button>
            <div>
              <h1 className="text-xs font-black tracking-tight text-black dark:text-white">
                {t.goodEvening}
              </h1>
              <button
                type="button"
                onClick={() => onNavigate('trusted_contacts')}
                className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                title="View Guardian Network"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{t.guardianOnline}</span>
                <span>• 3 Active</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="btn-dash-bell"
              type="button"
              onClick={() => onNavigate('safety_alert')}
              className="relative p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              title="Recent Incident Alerts"
              aria-label="View Safety Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600" />
            </button>
          </div>
        </div>

        {/* Search Route Input Button (Semantic Accessibility) */}
        <button
          type="button"
          onClick={() => onNavigate('route_search')}
          className="w-full mt-2.5 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 hover:border-black dark:hover:border-white transition-colors flex items-center justify-between group cursor-pointer text-left"
          aria-label="Search Safe Route"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-black dark:text-white block">
                {t.whereToGo}
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                Safe lighting, metro status & crowd bypass
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-black text-white dark:bg-white dark:text-black text-[10px] font-black flex items-center gap-1">
            <span>{t.planSafeRoute}</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </button>
      </header>

      {/* Safety Score Card & Status */}
      <div className="px-4 mt-3">
        <Card variant="default" padding="md" className="shadow-xs">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Badge variant="safe" size="sm">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Safe Perimeter</span>
              </Badge>
              <h2 className="text-base font-black text-black dark:text-white tracking-tight">
                Downtown Central (Sector 4)
              </h2>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2 font-medium">
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                  <SunMedium className="w-3.5 h-3.5" /> 98% Lux
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300 font-semibold">
                  <Radio className="w-3 h-3 text-emerald-500" /> 12 Sensors Live
                </span>
              </div>
            </div>

            {/* Circular Gauge Button (Accessible) */}
            <button
              type="button"
              onClick={() => onNavigate('shap_explain')}
              className="relative w-18 h-18 flex items-center justify-center cursor-pointer group shrink-0"
              title="Click to view SHAP Explainability"
              aria-label="Safety Index 94 percent. Click for SHAP breakdown"
            >
              <svg className="w-18 h-18 -rotate-90">
                <circle
                  cx="36"
                  cy="36"
                  r="28"
                  className="stroke-neutral-200 dark:stroke-neutral-800"
                  strokeWidth="4.5"
                  fill="transparent"
                />
                <circle
                  cx="36"
                  cy="36"
                  r="28"
                  className="stroke-black dark:stroke-white transition-all duration-700"
                  strokeWidth="4.5"
                  strokeDasharray="176"
                  strokeDashoffset="11"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-black text-black dark:text-white tracking-tight leading-none group-hover:scale-105 transition-transform">
                  94%
                </span>
                <span className="text-[7px] font-black uppercase tracking-wider text-neutral-500 mt-0.5">
                  AI INDEX
                </span>
              </div>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-3 gap-2 text-center">
            <button
              type="button"
              onClick={() => onNavigate('safe_haven_network')}
              className="p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-colors cursor-pointer text-center"
            >
              <div className="text-[9px] text-neutral-500 font-bold uppercase">Safe Havens</div>
              <div className="text-xs font-black text-black dark:text-white mt-0.5">5 Nearby</div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('infrastructure_reporting')}
              className="p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-colors cursor-pointer text-center"
            >
              <div className="text-[9px] text-neutral-500 font-bold uppercase">Streetlights</div>
              <div className="text-xs font-black text-black dark:text-white mt-0.5">100% Active</div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('transport_companion')}
              className="p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-colors cursor-pointer text-center"
            >
              <div className="text-[9px] text-neutral-500 font-bold uppercase">Patrol Unit</div>
              <div className="text-xs font-black text-black dark:text-white mt-0.5">120m Away</div>
            </button>
          </div>
        </Card>
      </div>

      {/* Map Preview */}
      <div className="px-4 mt-3">
        <div className="relative rounded-2xl overflow-hidden border border-neutral-300 dark:border-neutral-800 shadow-xs">
          <MapEngine
            heightClass="h-40"
            showHeatmap={true}
            showHelpPoints={true}
            showStreetlights={true}
            interactive={false}
          />
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/95 dark:bg-black/95 border border-neutral-200 dark:border-neutral-800 text-[10px] font-black text-black dark:text-white flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Sector 4 Telemetry Map</span>
          </div>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="px-4 mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Safety Modules
          </h3>
          <span className="text-[10px] font-bold text-neutral-400">Explore Services</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Public Gathering Disruption Hub */}
          <button
            type="button"
            onClick={() => onNavigate('public_gathering_hub')}
            className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black hover:border-black dark:hover:border-white transition-colors text-left cursor-pointer"
          >
            <div className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-black dark:text-white mb-1.5">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs font-bold text-black dark:text-white">Gathering Hub</div>
            <div className="text-[10px] text-neutral-500 mt-0.5">Civic crowd & transit advice</div>
          </button>

          {/* Community Safe Walk */}
          <button
            type="button"
            onClick={() => onNavigate('community_safe_walk')}
            className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black hover:border-black dark:hover:border-white transition-colors text-left cursor-pointer"
          >
            <div className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-black dark:text-white mb-1.5">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs font-bold text-black dark:text-white">Safe Walk</div>
            <div className="text-[10px] text-neutral-500 mt-0.5">Volunteer escort network</div>
          </button>
        </div>
      </div>
    </div>
  );
};
