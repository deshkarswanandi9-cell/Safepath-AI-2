import React from 'react';
import { 
  ArrowLeft, 
  Shield, 
  ShieldCheck, 
  Clock, 
  Navigation, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  SunMedium,
  Users,
  Train,
  SlidersHorizontal,
  Info,
  Radio,
  Zap
} from 'lucide-react';
import { ScreenId, RouteOption } from '../../types';
import { MOCK_ROUTES } from '../../data/mockData';
import { MapEngine } from '../MapEngine';

interface RouteComparisonScreenProps {
  onNavigate: (screen: ScreenId) => void;
  selectedRoute: RouteOption;
  onSelectRoute: (route: RouteOption) => void;
}

export const RouteComparisonScreen: React.FC<RouteComparisonScreenProps> = ({
  onNavigate,
  selectedRoute,
  onSelectRoute
}) => {
  return (
    <div className="relative min-h-[640px] h-full flex flex-col justify-between bg-[#0b101b] text-slate-100 overflow-y-auto no-scrollbar pb-28">
      {/* Top Map Preview showing comparison */}
      <div className="relative h-56 w-full shrink-0 border-b border-white/15">
        <MapEngine
          activeRoute={selectedRoute}
          heightClass="h-full"
          showHeatmap={true}
          showHelpPoints={true}
          interactive={false}
        />
        {/* Back and Title Header */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <button
            id="btn-comparison-back"
            onClick={() => onNavigate('route_search')}
            className="p-2 rounded-2xl bg-slate-900/90 backdrop-blur-md shadow-md border border-white/20 text-slate-200 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-white/20 shadow-md text-xs font-black text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            AI Route Evaluation
          </div>
          <button
            onClick={() => onNavigate('shap_explain')}
            className="p-2 rounded-2xl bg-slate-900/90 backdrop-blur-md shadow-md border border-white/20 text-purple-400 hover:text-purple-300 text-xs font-bold flex items-center gap-1"
            title="Explain SHAP"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-2 left-3 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1.5 border border-white/15">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Corridor: {selectedRoute.name}</span>
        </div>
      </div>

      {/* Main Container: 3 Route Options */}
      <div className="p-4 flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-white tracking-tight">
              AI Route Comparison
            </h2>
            <p className="text-[11px] text-slate-400">
              Evaluated 18 risk parameters across 3 distinct trajectories
            </p>
          </div>
          <button
            onClick={() => onNavigate('shap_explain')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5"
          >
            SHAP Analytics →
          </button>
        </div>

        {/* Route Cards */}
        {MOCK_ROUTES.map((r) => {
          const isSelected = selectedRoute.id === r.id;
          const isRec = r.isRecommended;

          return (
            <div
              key={r.id}
              onClick={() => onSelectRoute(r)}
              className={`p-3.5 rounded-3xl transition-all cursor-pointer relative border ${
                isSelected
                  ? 'bg-slate-850/95 border-emerald-500 shadow-xl shadow-emerald-500/15 ring-2 ring-emerald-500/30'
                  : 'bg-slate-900/90 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Recommended / Bypass Badge */}
              {isRec && (
                <div className="absolute -top-2.5 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Recommended Safe Corridor
                </div>
              )}

              {r.protestBypass && (
                <div className="absolute -top-2.5 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Gathering & Medical Bypass
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black shadow-md ${
                      isRec
                        ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                        : r.safetyScore > 70
                        ? 'bg-amber-500 text-slate-950 shadow-amber-500/30'
                        : 'bg-rose-500 text-white shadow-rose-500/30'
                    }`}
                  >
                    {r.name.replace('ROUTE ', '')}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white">{r.name}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mt-0.5">
                      <span>{r.distance}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {r.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Safety Score Meter */}
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Safety Score</div>
                  <div
                    className={`text-lg font-black tracking-tight ${
                      r.safetyScore >= 90
                        ? 'text-emerald-400'
                        : r.safetyScore >= 70
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {r.safetyScore}%
                  </div>
                </div>
              </div>

              {/* Progress bar visual */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${
                    r.safetyScore >= 90
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                      : r.safetyScore >= 70
                      ? 'bg-amber-400'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${r.safetyScore}%` }}
                />
              </div>

              {/* Specific Reasons or Risk Factors */}
              {isRec && r.reasons && (
                <div className="mt-2.5 pt-2 border-t border-white/10 grid grid-cols-2 gap-1.5 text-[11px] font-semibold text-emerald-300">
                  {r.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{reason}</span>
                    </div>
                  ))}
                </div>
              )}

              {r.riskFactors && (
                <div className="mt-2.5 pt-2 border-t border-white/10">
                  <div className="text-[10px] font-bold text-rose-300 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>Risk Factors: {r.riskFactors.join(', ')}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Primary CTA: Select Safe Route */}
      <div className="p-4 pt-0 space-y-2">
        <button
          id="btn-select-safe-route"
          onClick={() => onNavigate('live_navigation')}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/25 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-slate-950" />
          <span>Select Safe Route ({selectedRoute.safetyScore}% Safety)</span>
        </button>

        <button
          id="btn-explain-route-shap"
          onClick={() => onNavigate('shap_explain')}
          className="w-full py-2.5 rounded-2xl bg-slate-900 border border-white/15 text-slate-300 hover:bg-slate-850 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Explain AI Safety Model (SHAP Card)</span>
        </button>
      </div>
    </div>
  );
};
