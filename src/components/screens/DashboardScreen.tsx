import React from 'react';
import { 
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
  Activity,
  Compass,
  Radio,
  Eye,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  Zap,
  Navigation
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
    <div className="relative min-h-[640px] h-full flex flex-col bg-[#0b101b] text-slate-100 overflow-y-auto no-scrollbar pb-28">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-0 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Luxury Header with Live AI Status */}
      <div className="relative z-10 px-4 pt-3 pb-3 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              onClick={() => onNavigate('profile_settings')}
              className="relative cursor-pointer group"
              title="View Profile Settings"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                  alt="User avatar"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full shadow-xs"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black text-white tracking-tight">
                  {t.goodEvening}
                </h1>
                <span className="text-xs">✨</span>
              </div>
              <p 
                onClick={() => onNavigate('trusted_contacts')}
                className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5 cursor-pointer hover:text-emerald-400 transition"
                title="View Guardian Network"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-emerald-400 font-bold">{t.guardianOnline}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 text-[10px]">3 Contacts</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-dash-copilot"
              onClick={() => onNavigate('copilot_chat')}
              className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-purple-600/30 border border-blue-400/30 text-blue-300 hover:text-white hover:border-blue-400 transition-all hover:scale-105 active:scale-95 shadow-sm flex items-center gap-1"
              title="AI Safety Copilot"
            >
              <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 pr-0.5">AI</span>
            </button>

            <button
              id="btn-dash-bell"
              onClick={() => onNavigate('safety_alert')}
              className="relative p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 transition-all hover:scale-105 active:scale-95 border border-white/10"
              title="Recent Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-slate-900"></span>
            </button>
          </div>
        </div>

        {/* Futuristic Search Input Bar */}
        <div
          onClick={() => onNavigate('route_search')}
          className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-white/10 via-white/5 to-blue-500/10 hover:from-blue-600/20 hover:to-indigo-600/20 cursor-pointer border border-white/15 hover:border-blue-400/50 transition-all flex items-center justify-between group shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors block">
                {t.whereToGo}
              </span>
              <span className="text-[10px] text-slate-400">
                Safe lighting, metro status & crowd bypass
              </span>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-[10px] font-black text-white shadow-md shadow-blue-600/30 transition-all group-hover:scale-105 flex items-center gap-1">
            <span>{t.planSafeRoute}</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Holographic AI Safety Aura & Current Zone Gauge Card */}
      <div className="px-4 mt-3.5">
        <div className="relative p-4 rounded-3xl bg-gradient-to-br from-slate-900/95 via-indigo-950/80 to-slate-900/95 border border-indigo-500/30 shadow-2xl overflow-hidden">
          {/* Animated background glow */}
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between">
            {/* Left Info */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified Safe Perimeter</span>
              </div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>Downtown Central</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30 font-bold">
                  Sector 4
                </span>
              </h2>
              <p className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                <span>98% Illumination</span>
                <span className="text-slate-600">•</span>
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span className="text-cyan-300 font-semibold">12 AI Nodes Live</span>
              </p>
            </div>

            {/* Circular Holographic Safety Score Gauge */}
            <div 
              onClick={() => onNavigate('shap_explain')}
              className="relative w-20 h-20 flex items-center justify-center cursor-pointer group shrink-0"
              title="Click to view AI SHAP Explainability Breakdown"
            >
              <svg className="w-20 h-20 -rotate-90">
                {/* Background Track */}
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  className="stroke-slate-800"
                  strokeWidth="5"
                  fill="transparent"
                />
                {/* Active Progress Gradient */}
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  className="stroke-emerald-400 transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  strokeWidth="5"
                  strokeDasharray="201"
                  strokeDashoffset="12"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-black text-emerald-400 tracking-tight leading-none group-hover:scale-110 transition-transform">
                  94%
                </span>
                <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 mt-0.5">
                  AI INDEX
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar Inside Hero */}
          <div className="mt-3.5 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
            <div 
              onClick={() => onNavigate('safe_haven_network')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
            >
              <div className="text-[9px] text-slate-400 font-bold uppercase">Safe Havens</div>
              <div className="text-xs font-black text-cyan-300 mt-0.5 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3 text-cyan-400" />
                <span>5 Nearby</span>
              </div>
            </div>

            <div 
              onClick={() => onNavigate('infrastructure_reporting')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
            >
              <div className="text-[9px] text-slate-400 font-bold uppercase">Streetlights</div>
              <div className="text-xs font-black text-amber-300 mt-0.5 flex items-center justify-center gap-1">
                <SunMedium className="w-3 h-3 text-amber-400" />
                <span>100% Active</span>
              </div>
            </div>

            <div 
              onClick={() => onNavigate('transport_companion')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
            >
              <div className="text-[9px] text-slate-400 font-bold uppercase">Patrol Unit</div>
              <div className="text-xs font-black text-purple-300 mt-0.5 flex items-center justify-center gap-1">
                <Activity className="w-3 h-3 text-purple-400" />
                <span>120m Away</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Preview: Live City Map with interactive overlay */}
      <div className="relative mx-4 mt-3.5 rounded-3xl overflow-hidden shadow-2xl border border-white/15 group">
        <MapEngine
          heightClass="h-44"
          showHeatmap={true}
          showHelpPoints={true}
          showStreetlights={true}
          interactive={false}
        />
        {/* Floating live map overlay label */}
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 shadow-md flex items-center gap-2 text-white">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wide">Live Safe Corridor</span>
        </div>
        <button
          onClick={() => onNavigate('route_search')}
          className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] font-black shadow-lg shadow-blue-600/40 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <span>{t.expandMap}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Public Gathering & Transit Disruption Live Intelligence Card */}
      <div className="px-4 mt-3.5">
        <div 
          onClick={() => onNavigate('public_gathering_hub')}
          className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/40 text-white shadow-xl hover:border-amber-400 hover:shadow-amber-500/20 transition-all relative overflow-hidden group cursor-pointer active:scale-[0.99]"
        >
          {/* Subtle Ambient Shimmer */}
          <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
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
                  Delhi Metro gate advisories, crowd surge forecaster & safe bypasses
                </p>
              </div>
            </div>

            <span className="p-2 rounded-xl bg-white/10 group-hover:bg-amber-400 group-hover:text-slate-950 text-white transition-all shrink-0 ml-2">
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action & Women Safety Ecosystem Grid */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Safety Services Ecosystem</span>
          </h2>
          <span className="text-[10px] font-black text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
            8 AI Modules
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Action 1: Find Safe Route */}
          <button
            id="btn-quick-find-route"
            onClick={() => onNavigate('route_search')}
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-blue-500/30 hover:border-blue-400 hover:bg-slate-850 transition-all text-left flex items-start gap-3 shadow-lg group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white group-hover:text-blue-300 transition-colors">
                {t.findSafeRoute}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                AI lighting & crowd route
              </div>
            </div>
          </button>

          {/* Action 2: Share Live Location */}
          <button
            id="btn-quick-share-location"
            onClick={() => onNavigate('trusted_contacts')}
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 hover:border-purple-400 hover:bg-slate-850 transition-all text-left flex items-start gap-3 shadow-lg group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-md shadow-purple-500/30 group-hover:scale-105 transition-transform shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white group-hover:text-purple-300 transition-colors">
                {t.shareLiveLocation}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                Live GPS link to family
              </div>
            </div>
          </button>

          {/* Action 3: Emergency SOS */}
          <button
            id="btn-quick-emergency-sos"
            onClick={onOpenSos}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-950/60 to-red-950/80 border border-rose-500/50 hover:border-rose-400 hover:bg-rose-900/40 transition-all text-left flex items-start gap-3 shadow-lg shadow-rose-950/50 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 to-red-600 text-white flex items-center justify-center shadow-md shadow-rose-600/40 group-hover:scale-105 transition-transform shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-rose-200 group-hover:text-white transition-colors flex items-center gap-1">
                <span>{t.emergencySos}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
              </div>
              <div className="text-[10px] text-rose-300/80 mt-0.5 leading-tight">
                112 / 1091 panic alert
              </div>
            </div>
          </button>

          {/* Action 4: Verified Safe Haven Network */}
          <button
            onClick={() => onNavigate('safe_haven_network')}
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 hover:bg-slate-850 transition-all text-left flex items-start gap-3 shadow-lg group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/30 group-hover:scale-105 transition-transform shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors">
                Safe Haven Network
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                5 verified 24/7 refuges
              </div>
            </div>
          </button>

          {/* Action 5: Ride & Public Transit Companion */}
          <button
            onClick={() => onNavigate('transport_companion')}
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-400 hover:bg-slate-850 transition-all text-left flex items-start gap-3 shadow-lg group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white group-hover:text-indigo-300 transition-colors">
                Transit Companion
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                Cab & metro deviation alarm
              </div>
            </div>
          </button>

          {/* Action 6: Community Safe Walk */}
          <button
            onClick={() => onNavigate('community_safe_walk')}
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 hover:bg-slate-850 transition-all text-left flex items-start gap-3 shadow-lg group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white group-hover:text-emerald-300 transition-colors">
                Safe Walk Escort
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                Campus & peer escort
              </div>
            </div>
          </button>

          {/* Action 7: Fix Streetlights & Infrastructure */}
          <button
            onClick={() => onNavigate('infrastructure_reporting')}
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 hover:bg-slate-850 transition-all text-left flex items-start gap-3 shadow-lg group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform shrink-0">
              <SunMedium className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                Dark Spot Reporter
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                Report broken lights
              </div>
            </div>
          </button>

          {/* Action 8: AI Safety Copilot Voice */}
          <button
            onClick={() => onNavigate('copilot_chat')}
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 hover:border-purple-400 hover:bg-slate-850 transition-all text-left flex items-start gap-3 shadow-lg group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-600 text-white flex items-center justify-center shadow-md shadow-purple-500/30 group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white group-hover:text-purple-300 transition-colors">
                AI Copilot Chat
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                Hands-free voice guard
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Safety Overview & SHAP Explainability Card */}
      <div className="px-4 mt-5">
        <div className="p-4 rounded-3xl bg-slate-900/95 border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-400/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white">{t.safetyOverview}</h3>
                <p className="text-[10px] text-slate-400">{t.currentGpsRadius}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black">
              {t.secureZone}
            </span>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Area Safety Score: 86% */}
            <div 
              onClick={() => onNavigate('shap_explain')}
              className="p-3 rounded-2xl bg-slate-800/80 border border-blue-500/20 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
              title="Click to view AI SHAP score breakdown"
            >
              <div className="text-[10px] font-bold text-slate-400">{t.areaSafetyScore}</div>
              <div className="text-2xl font-black text-blue-400 mt-0.5 flex items-baseline gap-1">
                86%
                <span className="text-[10px] font-black text-emerald-400">+4%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full w-[86%]"></div>
              </div>
            </div>

            {/* Street Lighting: Good */}
            <div 
              onClick={() => onNavigate('shap_explain')}
              className="p-3 rounded-2xl bg-slate-800/80 border border-amber-500/20 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all"
              title="Click to view illumination factor"
            >
              <div className="text-[10px] font-bold text-slate-400">{t.streetLighting}</div>
              <div className="text-sm font-black text-amber-300 mt-1 flex items-center gap-1.5">
                <SunMedium className="w-4 h-4 text-amber-400 fill-amber-400" />
                {t.goodLighting}
              </div>
              <p className="text-[9px] text-slate-400 mt-1">{t.smartLeds}</p>
            </div>

            {/* Crowd Activity: Medium */}
            <div 
              onClick={() => onNavigate('safety_analytics')}
              className="p-3 rounded-2xl bg-slate-800/80 border border-purple-500/20 cursor-pointer hover:border-purple-400 hover:shadow-md transition-all"
              title="Click to view crowd activity analytics"
            >
              <div className="text-[10px] font-bold text-slate-400">{t.crowdActivity}</div>
              <div className="text-sm font-black text-purple-300 mt-1 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-purple-400" />
                {t.mediumActivity}
              </div>
              <p className="text-[9px] text-slate-400 mt-1">{t.openShops}</p>
            </div>

            {/* Nearby Help Points: 5 */}
            <div 
              onClick={onOpenSos}
              className="p-3 rounded-2xl bg-slate-800/80 border border-emerald-500/20 cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all"
              title="Click to view nearby emergency help points"
            >
              <div className="text-[10px] font-bold text-slate-400">{t.nearbyHelpPoints}</div>
              <div className="text-sm font-black text-emerald-300 mt-1 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                {t.helpPointsAvailable}
              </div>
              <p className="text-[9px] text-slate-400 mt-1">Police, Metro & 24/7 Booth</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('shap_explain')}
            className="w-full mt-3 py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-white/10 text-slate-200 text-xs font-bold flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.viewShapExplain}</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Recommended Safe Paths Featured Card */}
      <div className="px-4 mt-5">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/40 text-white shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/25 border border-blue-400/40 flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white">Recommended Safe Corridor</h3>
                <p className="text-[10px] text-blue-200">98% Illumination & Verified CCTV</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('route_search')}
              className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold transition-colors"
            >
              All Paths →
            </button>
          </div>

          <div 
            onClick={() => onNavigate('route_comparison')}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white group-hover:text-cyan-200 transition-colors">Grand Blvd Safe Corridor</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black shadow-sm">
                  94% SAFE
                </span>
              </div>
              <p className="text-[10px] text-blue-200 mt-0.5">1.2 km • 14 min walk • 98% Lit</p>
            </div>
            <button className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/30 transition-all group-hover:scale-105">
              Select Path
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
