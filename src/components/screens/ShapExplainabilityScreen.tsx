import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  SunMedium, 
  Users, 
  Train, 
  AlertTriangle, 
  Ban, 
  Info, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  Zap,
  Activity
} from 'lucide-react';
import { ScreenId } from '../../types';
import { SHAP_FEATURES } from '../../data/mockData';

interface ShapExplainabilityScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const ShapExplainabilityScreen: React.FC<ShapExplainabilityScreenProps> = ({ onNavigate }) => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  // Maximum absolute value for percentage bars
  const maxVal = 40;

  return (
    <div className="relative min-h-[640px] h-full flex flex-col justify-between bg-[#0b101b] text-slate-100 overflow-y-auto no-scrollbar p-4 pb-28">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between pt-2 mb-4">
          <button
            id="btn-shap-back"
            onClick={() => onNavigate('route_comparison')}
            className="p-2 rounded-2xl bg-slate-900 shadow-md border border-white/15 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-black">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>SHAP Explainable AI</span>
          </div>
          <div className="w-8" />
        </div>

        {/* Title */}
        <div className="mb-4">
          <h1 className="text-xl font-black text-white tracking-tight">
            Why is this route safer?
          </h1>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Shapley Additive Explanations (SHAP) mathematically decomposing individual factor weights toward the 94% safety score.
          </p>
        </div>

        {/* Interactive SHAP Analysis Card */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-white/15 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white">Feature Contributions</h3>
                <p className="text-[10px] text-slate-400">Baseline safety threshold: 50%</p>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              Net: +55 pts
            </span>
          </div>

          {/* Interactive Feature Contribution Waterfall Bars */}
          <div className="space-y-2.5">
            {SHAP_FEATURES.map((item, idx) => {
              const isPositive = item.category === 'positive';
              const absVal = Math.abs(item.value);
              const barWidthPct = (absVal / maxVal) * 100;
              const isSelected = activeFeature === item.name;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveFeature(isSelected ? null : item.name)}
                  className={`p-2.5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-slate-800/95 border-cyan-400 shadow-md shadow-cyan-500/10'
                      : 'hover:bg-slate-800/60 border-white/5 bg-slate-850/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] ${
                          isPositive ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      >
                        {item.name === 'Street Lighting' && <SunMedium className="w-3.5 h-3.5" />}
                        {item.name === 'Crowd Activity' && <Users className="w-3.5 h-3.5" />}
                        {item.name === 'Public Transport' && <Train className="w-3.5 h-3.5" />}
                        {item.name === 'Recent Incidents' && <AlertTriangle className="w-3.5 h-3.5" />}
                        {item.name === 'Road Closure' && <Ban className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-white font-black">{item.name}</span>
                    </div>
                    <span
                      className={`font-black ${
                        isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {item.value > 0 ? `+${item.value}` : item.value}
                    </span>
                  </div>

                  {/* Visual Diverging Bar */}
                  <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden flex items-center">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPositive
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                          : 'bg-gradient-to-r from-rose-500 to-red-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                      }`}
                      style={{ width: `${barWidthPct}%` }}
                    />
                  </div>

                  {/* Micro description toggle */}
                  <p className="text-[10px] text-slate-400 mt-1.5 pl-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Explanation Card */}
        <div className="mt-4 p-4 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/30 shadow-xl relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                <span>AI Neural Reasoning</span>
                <span className="text-[9px] font-black text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 px-1.5 py-0.2 rounded">
                  SafeRoute Core v2.4
                </span>
              </h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-medium">
                “This route is safer because it features 98% smart lux illumination, high foot traffic, continuous CCTV coverage, and 5 verified 24/7 Safe Haven refuges.”
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Continuous Lux Lighting</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>4 CCTV Monitored Crossings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action to proceed to Live Navigation */}
      <div className="pt-4 relative z-10">
        <button
          id="btn-shap-start-nav"
          onClick={() => onNavigate('live_navigation')}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-xs shadow-xl shadow-blue-500/30 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Proceed with Grand Blvd Safe Route (94% Safe)</span>
        </button>
      </div>
    </div>
  );
};
