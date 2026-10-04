import React from 'react';
import { 
  Search, 
  Shield, 
  MapPin, 
  Share2, 
  AlertCircle, 
  Users, 
  SunMedium, 
  ArrowRight, 
  Bell, 
  Sparkles, 
  ChevronRight, 
  TrendingUp, 
  Activity
} from 'lucide-react';
import { ScreenId } from '../../types';
import { MapEngine } from '../MapEngine';
import { useLanguage } from '../../context/LanguageContext';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenSos: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate, onOpenSos }) => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-[640px] h-full flex flex-col bg-[#F8FAFC] overflow-y-auto no-scrollbar pb-28">
      {/* Top Header Card with Dynamic Ambiance */}
      <div className="p-5 pb-3.5 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              onClick={() => onNavigate('profile_settings')}
              className="relative cursor-pointer group"
              title="View Profile Settings"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                  alt="Shivani avatar"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-xs"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
                  {t.goodEvening}
                </h1>
              </div>
              <p 
                onClick={() => onNavigate('trusted_contacts')}
                className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 cursor-pointer hover:text-emerald-700 transition"
                title="View Trusted Contacts"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <strong className="text-emerald-700 font-bold">{t.guardianOnline}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-dash-bell"
              onClick={() => onNavigate('safety_alert')}
              className="relative p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all hover:scale-105 active:scale-95 shadow-xs"
              title="Recent Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white"></span>
            </button>
          </div>
        </div>

        {/* Search Bar: 📍 Where do you want to go? */}
        <div
          onClick={() => onNavigate('route_search')}
          className="mt-4 p-3 px-4 rounded-2xl bg-gradient-to-r from-slate-100 via-slate-50 to-blue-50/50 hover:from-blue-50/80 hover:to-indigo-50/80 cursor-pointer border border-slate-200/90 transition-all flex items-center justify-between group shadow-sm hover:shadow-md hover:border-blue-300"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-110 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-700 group-hover:text-slate-950 transition-colors">
              {t.whereToGo}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-xl bg-white text-[10px] font-extrabold text-blue-600 border border-slate-200/80 shadow-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
            {t.planSafeRoute} →
          </span>
        </div>
      </div>

      {/* Map Preview: Live City Map with interactive overlay */}
      <div className="relative mx-4 mt-4 rounded-3xl overflow-hidden shadow-lg border border-slate-200/90 group">
        <MapEngine
          heightClass="h-48"
          showHeatmap={true}
          showHelpPoints={true}
          showStreetlights={true}
          interactive={false}
        />
        {/* Floating live map overlay label */}
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 shadow-md flex items-center gap-2 text-white">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-[11px] font-extrabold text-emerald-300">{t.downtownSafeZone}</span>
        </div>
        <button
          onClick={() => onNavigate('route_search')}
          className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-extrabold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <span>{t.expandMap}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Public Gathering & Transit Disruption Live Intelligence Card */}
      <div className="px-4 mt-4">
        <div 
          onClick={() => onNavigate('public_gathering_hub')}
          className="p-4 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-xl shadow-slate-950/20 border border-amber-500/30 cursor-pointer hover:border-amber-400 hover:shadow-amber-500/10 transition-all relative overflow-hidden group active:scale-[0.99]"
        >
          {/* Subtle Ambient Shimmer */}
          <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                  </span>
                  <h3 className="text-xs font-black text-white group-hover:text-amber-300 transition-colors tracking-tight">
                    Public Gathering & Disruption Hub
                  </h3>
                </div>
                <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">
                  Live Delhi metro gate advisories, crowd surge forecaster & bypass routes
                </p>
              </div>
            </div>

            <span className="p-2 rounded-xl bg-white/10 group-hover:bg-amber-400 group-hover:text-slate-950 text-white transition-all shrink-0 ml-2">
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            {t.quickActions}
          </h2>
          <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{t.priorityServices}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Action 1: Find Safe Route */}
          <button
            id="btn-quick-find-route"
            onClick={() => onNavigate('route_search')}
            className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all text-left flex items-start gap-3 shadow-sm group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">
                {t.findSafeRoute}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {t.findSafeRouteDesc}
              </div>
            </div>
          </button>

          {/* Action 2: Share Live Location */}
          <button
            id="btn-quick-share-location"
            onClick={() => onNavigate('trusted_contacts')}
            className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all text-left flex items-start gap-3 shadow-sm group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-800 group-hover:text-purple-600 transition-colors">
                {t.shareLiveLocation}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {t.shareLiveLocationDesc}
              </div>
            </div>
          </button>

          {/* Action 3: Emergency SOS */}
          <button
            id="btn-quick-emergency-sos"
            onClick={onOpenSos}
            className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 hover:border-rose-400 hover:shadow-md transition-all text-left flex items-start gap-3 shadow-sm group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shadow-md shadow-rose-500/25 group-hover:scale-105 transition-transform">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-rose-800 group-hover:text-rose-900 transition-colors">
                {t.emergencySos}
              </div>
              <div className="text-[10px] text-rose-600/80 mt-0.5">
                {t.emergencySosDesc}
              </div>
            </div>
          </button>

          {/* Action 4: Trusted Contacts */}
          <button
            id="btn-quick-trusted-contacts"
            onClick={() => onNavigate('trusted_contacts')}
            className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all text-left flex items-start gap-3 shadow-sm group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-800 group-hover:text-emerald-600 transition-colors">
                {t.trustedContacts}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {t.trustedContactsDesc}
              </div>
            </div>
          </button>

          {/* Action 5: Verified Safe Haven Network */}
          <button
            onClick={() => onNavigate('safe_haven_network')}
            className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-cyan-300 hover:shadow-md transition-all text-left flex items-start gap-3 shadow-sm group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-800 group-hover:text-cyan-600 transition-colors">
                Safe Haven Network
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                5 verified 24/7 refuges
              </div>
            </div>
          </button>

          {/* Action 6: Ride & Public Transit Companion */}
          <button
            onClick={() => onNavigate('transport_companion')}
            className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all text-left flex items-start gap-3 shadow-sm group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors">
                Transit Ride Companion
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Route deviation alarm
              </div>
            </div>
          </button>

          {/* Action 7: Community Safe Walk */}
          <button
            onClick={() => onNavigate('community_safe_walk')}
            className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all text-left flex items-start gap-3 shadow-sm group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-800 group-hover:text-emerald-600 transition-colors">
                Community Safe Walk
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Campus security escort
              </div>
            </div>
          </button>

          {/* Action 8: Fix Streetlights & Infrastructure */}
          <button
            onClick={() => onNavigate('infrastructure_reporting')}
            className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-300 hover:shadow-md transition-all text-left flex items-start gap-3 shadow-sm group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <SunMedium className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-800 group-hover:text-amber-600 transition-colors">
                Fix Dark Spots
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Report broken streetlights
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Safety Overview Card */}
      <div className="px-4 mt-5">
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-slate-900">{t.safetyOverview}</h3>
                <p className="text-[10px] text-slate-500">{t.currentGpsRadius}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {t.secureZone}
            </span>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Area Safety Score: 86% */}
            <div 
              onClick={() => onNavigate('shap_explain')}
              className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/40 border border-blue-100 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
              title="Click to view AI SHAP score breakdown"
            >
              <div className="text-[10px] font-semibold text-slate-500">{t.areaSafetyScore}</div>
              <div className="text-2xl font-black text-blue-700 mt-0.5 flex items-baseline gap-1">
                86%
                <span className="text-[10px] font-bold text-emerald-600">+4%</span>
              </div>
              <div className="w-full bg-blue-200/50 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1.5 rounded-full w-[86%]"></div>
              </div>
            </div>

            {/* Street Lighting: Good */}
            <div 
              onClick={() => onNavigate('shap_explain')}
              className="p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-100 cursor-pointer hover:border-amber-300 hover:shadow-sm transition-all"
              title="Click to view illumination factor"
            >
              <div className="text-[10px] font-semibold text-slate-500">{t.streetLighting}</div>
              <div className="text-base font-extrabold text-amber-800 mt-1 flex items-center gap-1.5">
                <SunMedium className="w-4 h-4 text-amber-500 fill-amber-500" />
                {t.goodLighting}
              </div>
              <p className="text-[9px] text-slate-500 mt-1">{t.smartLeds}</p>
            </div>

            {/* Crowd Activity: Medium */}
            <div 
              onClick={() => onNavigate('safety_analytics')}
              className="p-3 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50/40 border border-purple-100 cursor-pointer hover:border-purple-300 hover:shadow-sm transition-all"
              title="Click to view crowd activity analytics"
            >
              <div className="text-[10px] font-semibold text-slate-500">{t.crowdActivity}</div>
              <div className="text-base font-extrabold text-purple-800 mt-1 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-purple-500" />
                {t.mediumActivity}
              </div>
              <p className="text-[9px] text-slate-500 mt-1">{t.openShops}</p>
            </div>

            {/* Nearby Help Points: 5 */}
            <div 
              onClick={onOpenSos}
              className="p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-100 cursor-pointer hover:border-emerald-300 hover:shadow-sm transition-all"
              title="Click to view nearby emergency help points"
            >
              <div className="text-[10px] font-semibold text-slate-500">{t.nearbyHelpPoints}</div>
              <div className="text-base font-extrabold text-emerald-800 mt-1 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                {t.helpPointsAvailable}
              </div>
              <p className="text-[9px] text-slate-500 mt-1">Police, Metro & 24/7 Booth</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('shap_explain')}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              {t.viewShapExplain}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Recommended Safe Paths Quick Select Card */}
      <div className="px-4 mt-5">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-blue-500/30 flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-white">Recommended Safe Paths</h3>
                <p className="text-[10px] text-blue-200">High-illumination verified paths</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('route_search')}
              className="px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[10px] font-bold transition-colors"
            >
              View All Paths →
            </button>
          </div>

          <div 
            onClick={() => onNavigate('route_comparison')}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 cursor-pointer transition-all flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">Grand Blvd Safe Corridor</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[9px] font-black">
                  94% SAFE
                </span>
              </div>
              <p className="text-[10px] text-blue-200 mt-0.5">1.2 km • 14 min walk • 98% Lit</p>
            </div>
            <button className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-colors">
              Select Path
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
