import React from 'react';
import { 
  MapPin, 
  SunMedium, 
  ArrowRight, 
  Bell, 
  ShieldCheck, 
  Radio, 
  Activity,
  Compass,
  Hospital,
  Car,
  Shield
} from 'lucide-react';
import { ScreenId } from '../../types';
import { MapEngine } from '../MapEngine';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import { Card } from '../ui/Card';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenSos: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { profile, greeting, liveDate, liveTime } = useUser();

  return (
    <div className="relative h-full flex flex-col bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar">
      {/* ========================================================================= */}
      {/* 1. COMPACT PROFILE HEADER (Sticky, Minimal Height, No Search Pollution)   */}
      {/* ========================================================================= */}
      <header className="px-3.5 py-2.5 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-black/95 backdrop-blur-xs sticky top-0 z-20 shrink-0">
        <div className="flex items-center justify-between gap-2.5">
          {/* Left: Avatar + Greeting & Guardian Status */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => onNavigate('profile_settings')}
              className="relative cursor-pointer shrink-0 rounded-xl p-0.5 border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white"
              title="View Profile Settings"
              aria-label="Profile and Settings"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                <img
                  src={profile.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"}
                  alt={`${profile.full_name || 'User'} profile`}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-black rounded-full" />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-xs font-black tracking-tight text-black dark:text-white truncate leading-tight">
                  {greeting}
                </h1>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 mt-0.5">
                <button
                  type="button"
                  onClick={() => onNavigate('trusted_contacts')}
                  className="hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer truncate"
                  title="View Guardian Network"
                  aria-label={`${t.guardianOnline}, 3 active guardians`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">{t.guardianOnline}</span>
                </button>
                <span className="text-neutral-400 dark:text-neutral-600 shrink-0">•</span>
                <span className="text-neutral-500 dark:text-neutral-400 shrink-0 font-medium">{liveDate}</span>
              </div>
            </div>
          </div>

          {/* Right: Notifications Alert Bell */}
          <div className="shrink-0 flex items-center">
            <button
              id="btn-dash-bell"
              type="button"
              onClick={() => onNavigate('safety_alert')}
              className="relative p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white"
              title="Recent Incident Alerts"
              aria-label="View Safety Alerts (1 unread)"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-black" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SCROLLABLE DASHBOARD CONTENT                                              */}
      {/* ========================================================================= */}
      <div className="p-3.5 space-y-3 pb-24 flex-1">
        {/* ========================================================================= */}
        {/* 2. COHERENT ROUTE-SEARCH BAR (In Flow, Compact, Single-Unit Action)       */}
        {/* ========================================================================= */}
        <div className="p-1 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 shadow-xs">
          <button
            type="button"
            onClick={() => onNavigate('route_search')}
            className="w-full flex items-center justify-between gap-2.5 p-2 rounded-xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-all cursor-pointer text-left group"
            aria-label="Set destination: Where do you want to go?"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-7 h-7 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-black text-black dark:text-white block truncate">
                  {t.whereToGo}
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block truncate">
                  Well-lit corridors, open shops & verified paths
                </span>
              </div>
            </div>
            
            <div className="px-2.5 py-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold text-xs flex items-center gap-1 shrink-0 group-hover:opacity-90 transition-opacity">
              <span>{t.planSafeRoute || 'Plan'}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 3. MAIN SAFETY OVERVIEW CARD (Unclipped, Balanced, High Contrast)          */}
        {/* ========================================================================= */}
        <Card variant="default" padding="sm" className="shadow-xs border-neutral-200 dark:border-neutral-800">
          <div className="flex items-start justify-between gap-2.5">
            <div className="space-y-1 min-w-0 flex-1">
              {/* Verified Safe Zone Pill */}
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Verified Safe Zone</span>
              </div>

              {/* Location Heading */}
              <h2 className="text-sm font-black text-black dark:text-white tracking-tight leading-snug break-words">
                Downtown Central (Sector 4)
              </h2>

              {/* Secondary Details: Lux & Live Sensors */}
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2 font-medium flex-wrap pt-0.5">
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold shrink-0">
                  <SunMedium className="w-3 h-3" /> 98% Lux
                </span>
                <span className="text-neutral-300 dark:text-neutral-700">•</span>
                <span className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300 font-semibold shrink-0">
                  <Radio className="w-3 h-3 text-emerald-500" /> 12 Sensors Live
                </span>
              </div>
            </div>

            {/* Circular Gauge Button (Accessible & Interactive -> SHAP Explain) */}
            <button
              type="button"
              onClick={() => onNavigate('shap_explain')}
              className="relative w-14 h-14 flex items-center justify-center cursor-pointer group shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white transition-transform active:scale-95"
              title="Click to view SHAP Explainability Breakdown"
              aria-label="Safety Index 94 percent. Click for SHAP breakdown"
            >
              <svg className="w-14 h-14 -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  className="stroke-neutral-200 dark:stroke-neutral-800"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  className="stroke-black dark:stroke-white transition-all duration-700"
                  strokeWidth="3.5"
                  strokeDasharray="138"
                  strokeDashoffset="8.3"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-black text-black dark:text-white tracking-tight leading-none group-hover:scale-105 transition-transform">
                  94%
                </span>
                <span className="text-[7px] font-black uppercase tracking-wider text-neutral-500 mt-0.5">
                  AI INDEX
                </span>
              </div>
            </button>
          </div>

          {/* Quick Metrics Bar: 3 Balanced Interactive Columns */}
          <div className="mt-2.5 pt-2.5 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-3 gap-1.5 text-center">
            {/* Metric 1: Safe Havens */}
            <button
              type="button"
              onClick={() => onNavigate('nearest_safe_place')}
              className="p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-colors cursor-pointer text-center min-w-0"
              title="View Emergency Safe Haven Finder"
              aria-label="5 Safe Havens Nearby"
            >
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider truncate">Havens</div>
              <div className="text-xs font-black text-black dark:text-white mt-0.5 truncate">5 Nearby</div>
              <div className="text-[8px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 truncate">24/7 Verified</div>
            </button>

            {/* Metric 2: Streetlights */}
            <button
              type="button"
              onClick={() => onNavigate('infrastructure_reporting')}
              className="p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-colors cursor-pointer text-center min-w-0"
              title="View Infrastructure & Lighting Hub"
              aria-label="Streetlights 100% Active"
            >
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider truncate">Lighting</div>
              <div className="text-xs font-black text-black dark:text-white mt-0.5 truncate">100%</div>
              <div className="text-[8px] text-neutral-500 dark:text-neutral-400 font-medium mt-0.5 truncate">Active LEDs</div>
            </button>

            {/* Metric 3: Patrol Unit */}
            <button
              type="button"
              onClick={() => onNavigate('transport_companion')}
              className="p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-colors cursor-pointer text-center min-w-0"
              title="View Transit & Patrol Companion"
              aria-label="Patrol Unit 120m Away"
            >
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider truncate">Patrol</div>
              <div className="text-xs font-black text-black dark:text-white mt-0.5 truncate">120m</div>
              <div className="text-[8px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 truncate">En Route</div>
            </button>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 4. TELEMETRY MAP SECTION (Properly Proportioned, Non-Obtrusive Labels)    */}
        {/* ========================================================================= */}
        <div className="relative rounded-2xl overflow-hidden border border-neutral-300 dark:border-neutral-800 shadow-xs">
          <MapEngine
            heightClass="h-44"
            showHeatmap={true}
            showHelpPoints={true}
            showStreetlights={true}
            interactive={true}
            onExpandMap={() => onNavigate('route_search')}
            expandMapLabel={t.expandMap || 'Expand'}
          />
        </div>

        {/* ========================================================================= */}
        {/* 5. BALANCED SAFETY MODULES (2x2 Grid with Clean Proportions)              */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Safety Modules
            </h3>
            <span className="text-[10px] font-bold text-neutral-400">Explore Services</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* 1. Public Gathering Disruption Hub */}
            <button
              type="button"
              onClick={() => onNavigate('public_gathering_hub')}
              className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black hover:border-black dark:hover:border-white transition-colors text-left cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-black dark:text-white mb-1.5 border border-neutral-200 dark:border-neutral-800 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-black dark:text-white truncate">Gathering Hub</div>
              <div className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">Civic & transit alerts</div>
            </button>

            {/* 2. Safe Haven Directory */}
            <button
              type="button"
              onClick={() => onNavigate('safe_haven_network')}
              className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black hover:border-black dark:hover:border-white transition-colors text-left cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-black dark:text-white mb-1.5 border border-neutral-200 dark:border-neutral-800 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                <Hospital className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-black dark:text-white truncate">Safe Havens</div>
              <div className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">24/7 verified refuges</div>
            </button>

            {/* 3. Safe Public Transit & Cab Companion */}
            <button
              type="button"
              onClick={() => onNavigate('transport_companion')}
              className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black hover:border-black dark:hover:border-white transition-colors text-left cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-black dark:text-white mb-1.5 border border-neutral-200 dark:border-neutral-800 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                <Car className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-black dark:text-white truncate">Transit Companion</div>
              <div className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">Cab ride & deviation alarm</div>
            </button>

            {/* 4. Community Safe Walk */}
            <button
              type="button"
              onClick={() => onNavigate('community_safe_walk')}
              className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black hover:border-black dark:hover:border-white transition-colors text-left cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-black dark:text-white mb-1.5 border border-neutral-200 dark:border-neutral-800 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-black dark:text-white truncate">Safe Walk</div>
              <div className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">Volunteer escort network</div>
            </button>

            {/* 5. Proactive Police Monitoring (Challenge 4) */}
            <button
              type="button"
              onClick={() => onNavigate('proactive_police_monitoring')}
              className="p-2.5 rounded-xl border-2 border-indigo-300 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 hover:border-indigo-600 dark:hover:border-indigo-500 transition-colors text-left cursor-pointer group col-span-2"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-indigo-800 dark:text-indigo-300 truncate">Proactive Police Monitoring</div>
                  <div className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5 line-clamp-1">Non-emergency silent PCR safety link • Challenge 4</div>
                </div>
                <span className="ml-auto text-[9px] font-black px-1.5 py-0.5 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 shrink-0">LIVE</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
