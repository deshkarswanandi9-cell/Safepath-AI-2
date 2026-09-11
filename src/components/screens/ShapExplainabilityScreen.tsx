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
  Layers
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
    <div className="relative min-h-[640px] h-full flex flex-col justify-between bg-[#F8FAFC] overflow-y-auto no-scrollbar p-4 pb-28">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pt-2 mb-4">
          <button
            id="btn-shap-back"
            onClick={() => onNavigate('route_comparison')}
            className="p-2 rounded-2xl bg-white shadow-sm border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold">
            <Cpu className="w-3.5 h-3.5 text-purple-600" />
            <span>SHAP Explainable AI</span>
          </div>
          <div className="w-8" />
        </div>

        {/* Title */}
        <div className="mb-4">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Why is this route safer?
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Shapley Additive Explanations (SHAP) attributing relative impact toward the 93% safety score.
          </p>
        </div>

        {/* Interactive SHAP Analysis Card */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-slate-900">Feature Contributions</h3>
                <p className="text-[10px] text-slate-400">Baseline safety threshold: 50%</p>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Net: +55 pts
            </span>
          </div>

          {/* Interactive Feature Contribution Waterfall Bars */}
          <div className="space-y-3">
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
                      ? 'bg-slate-50 border-blue-400 shadow-sm'
                      : 'hover:bg-slate-50/70 border-slate-100'
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
                      <span className="text-slate-800">{item.name}</span>
                    </div>
                    <span
                      className={`font-black ${
                        isPositive ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {item.value > 0 ? `+${item.value}` : item.value}
                    </span>
                  </div>

                  {/* Visual Diverging Bar */}
                  <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden flex items-center">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPositive
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                          : 'bg-gradient-to-r from-rose-500 to-red-500'
                      }`}
                      style={{ width: `${barWidthPct}%` }}
                    />
                  </div>

                  {/* Micro description toggle */}
                  <p className="text-[10px] text-slate-500 mt-1.5 pl-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Explanation Card (Prompt Requirement) */}
        <div className="mt-4 p-4 rounded-3xl bg-gradient-to-br from-blue-50 via-purple-50/60 to-white border border-blue-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span>AI Explanation</span>
                <span className="text-[9px] font-bold text-blue-700 bg-blue-100/80 px-1.5 py-0.2 rounded">
                  SafeRoute Core v2.4
                </span>
              </h4>
              <p className="text-xs text-slate-700 mt-1.5 leading-relaxed font-medium">
                “This route is safer because it has better lighting, higher public activity and multiple nearby emergency support locations.”
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-blue-100/80">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>96% Continuous lux lighting</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>4 CCTV monitored crossings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action to proceed to Live Navigation */}
      <div className="pt-4">
        <button
          id="btn-shap-start-nav"
          onClick={() => onNavigate('live_navigation')}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-xl shadow-blue-500/25 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Proceed with Route C (93% Safe)</span>
        </button>
      </div>
    </div>
  );
};
