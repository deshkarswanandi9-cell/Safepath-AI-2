import React from 'react';
import { Shield, Sparkles, ArrowRight, Compass, Lock, ShieldCheck, Radio, SunMedium } from 'lucide-react';
import { ScreenId } from '../../types';

interface SplashScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-[640px] h-full flex flex-col justify-between p-6 bg-[#0b101b] text-slate-100 overflow-hidden">
      {/* Background Animated Gradient Blobs */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-28 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-600/10 blur-3xl pointer-events-none" />

      {/* Top Brand Pill */}
      <div className="pt-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 shadow-lg text-xs font-bold text-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>AI Safety Shield Active</span>
        </div>
        <button
          id="btn-splash-skip"
          onClick={() => onNavigate('dashboard')}
          className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Skip to Home →
        </button>
      </div>

      {/* Hero Visual Area: AI-powered Shield & Animated Route Graphic */}
      <div className="flex-1 flex flex-col items-center justify-center my-4 z-10 text-center">
        {/* Glowing Shield Emblem */}
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 blur-2xl opacity-50 animate-pulse" />
          <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-2xl shadow-blue-500/40 flex items-center justify-center">
            <div className="w-full h-full rounded-[22px] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center">
              <Shield className="w-13 h-13 text-cyan-300 drop-shadow-md stroke-[1.75]" />
              <div className="absolute -bottom-2 px-2.5 py-0.5 bg-emerald-500 text-slate-950 rounded-full text-[10px] font-black tracking-wider uppercase shadow-lg flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> AI Core
              </div>
            </div>
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
          <span>SafeRoute</span>
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            AI
          </span>
        </h1>
        <p className="text-xs font-medium text-slate-400 mt-2 max-w-xs">
          “Predictive Urban Navigation & Women’s Safety Ecosystem”
        </p>

        {/* Animated route path graphic */}
        <div className="mt-6 w-full max-w-xs p-4 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2">
            <span>Dynamic Route Intelligence</span>
            <span className="text-emerald-400 flex items-center gap-1 font-black">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 98% Confidence
            </span>
          </div>

          {/* SVG Animated Route Path */}
          <div className="relative h-14 w-full bg-slate-950/70 rounded-2xl overflow-hidden flex items-center px-4 border border-white/5">
            <svg viewBox="0 0 240 40" className="w-full h-10">
              <path
                d="M 10 20 Q 70 5, 120 25 T 230 15"
                fill="none"
                stroke="#1e293b"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 10 20 Q 70 5, 120 25 T 230 15"
                fill="none"
                stroke="url(#splash-route-grad)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="8 6"
              />
              <defs>
                <linearGradient id="splash-route-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              {/* Pulsing origin and destination nodes */}
              <circle cx="10" cy="20" r="4" fill="#06b6d4" />
              <circle cx="120" cy="25" r="3" fill="#6366f1" />
              <circle cx="230" cy="15" r="5" fill="#10b981" />
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="text-[9px] text-slate-400 font-bold">Lighting</div>
              <div className="text-xs font-black text-amber-300">98% Lux</div>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="text-[9px] text-slate-400 font-bold">Activity</div>
              <div className="text-xs font-black text-emerald-400">Safe Crowd</div>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="text-[9px] text-slate-400 font-bold">Safe Havens</div>
              <div className="text-xs font-black text-cyan-300">5 Nearby</div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="space-y-2.5 z-10 pb-2">
        <button
          id="btn-splash-get-started"
          onClick={() => onNavigate('dashboard')}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-xs shadow-xl shadow-blue-600/30 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          id="btn-splash-sign-in"
          onClick={() => onNavigate('login')}
          className="w-full py-3 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-white/15 shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Lock className="w-4 h-4 text-slate-400" />
          <span>Sign In / Register</span>
        </button>
      </div>
    </div>
  );
};
