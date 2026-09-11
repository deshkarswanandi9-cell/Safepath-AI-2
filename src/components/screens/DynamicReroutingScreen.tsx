import React from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  TrendingUp,
  RotateCw,
  SunMedium,
  Users
} from 'lucide-react';
import { ScreenId, RouteOption } from '../../types';
import { MapEngine } from '../MapEngine';

interface DynamicReroutingScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onConfirmReroute: () => void;
}

export const DynamicReroutingScreen: React.FC<DynamicReroutingScreenProps> = ({
  onNavigate,
  onConfirmReroute
}) => {
  return (
    <div className="relative min-h-[640px] h-full flex flex-col justify-between bg-[#F8FAFC] overflow-y-auto no-scrollbar pb-28">
      {/* Top Map View showing old vs new reroute comparison */}
      <div className="relative h-60 w-full shrink-0 border-b border-slate-200">
        <MapEngine
          rerouteMode={true}
          heightClass="h-full"
          showHeatmap={true}
          showHelpPoints={true}
          interactive={false}
        />
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <button
            id="btn-reroute-back"
            onClick={() => onNavigate('live_navigation')}
            className="p-2 rounded-2xl bg-white/95 backdrop-blur-md shadow-md border border-slate-200 text-slate-700 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <RotateCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            Dynamic Rerouting
          </div>
          <div className="w-8" />
        </div>

        {/* Floating Route Legend */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm text-[11px] font-semibold">
          <div className="flex items-center gap-1.5 text-rose-600">
            <span className="w-3 h-1 bg-rose-500 rounded-full"></span>
            <span>Old Compromised Route</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600">
            <span className="w-3 h-1 bg-emerald-500 rounded-full"></span>
            <span>New Safe Route (+21%)</span>
          </div>
        </div>
      </div>

      {/* Main Comparison Section */}
      <div className="p-4 flex-1 space-y-3.5">
        {/* AI Recommendation Banner */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-lg shadow-blue-500/20">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black tracking-wider text-blue-200">
                AI Recommendation
              </div>
              <p className="text-xs font-bold text-white mt-1 leading-relaxed">
                “A safer route has been found based on updated conditions.”
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Layout (Old Route vs New Route) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Old Route: Safety Score: 70% */}
          <div className="p-3.5 rounded-3xl bg-white border border-rose-200 shadow-sm relative overflow-hidden">
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              Old Route
            </div>
            <div className="mt-2">
              <div className="text-[10px] text-slate-500">Safety Score</div>
              <div className="text-2xl font-black text-rose-600">70%</div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-rose-500 h-1.5 rounded-full w-[70%]" />
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-rose-700 font-semibold space-y-1">
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" />
                <span>Incident near Elm St</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                <span>ETA: 13 min</span>
              </div>
            </div>
          </div>

          {/* New Route: Safety Score: 91% */}
          <div className="p-3.5 rounded-3xl bg-white border-2 border-emerald-500 shadow-lg shadow-emerald-500/10 relative overflow-hidden ring-2 ring-emerald-500/20">
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-xl uppercase tracking-wider">
              Optimal
            </div>
            <div className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">
              New Route
            </div>
            <div className="mt-2">
              <div className="text-[10px] text-slate-500">Safety Score</div>
              <div className="text-2xl font-black text-emerald-600 flex items-center gap-1">
                91%
                <span className="text-[10px] font-bold text-emerald-700">+21%</span>
              </div>
            </div>

            <div className="w-full bg-emerald-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full w-[91%]" />
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-emerald-800 font-semibold space-y-1">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Grand Blvd Corridor</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                <span>ETA: 15 min (+2 min)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Why the change matters */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Safety Gain Breakdown</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Rerouting adds only 2 minutes of walking time while circumventing the unlit side street and routing directly past 2 open cafes and a police kiosk.
          </p>
        </div>
      </div>

      {/* Primary CTA: Switch Route */}
      <div className="p-4 pt-0 space-y-2">
        <button
          id="btn-switch-route"
          onClick={onConfirmReroute}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 text-white font-bold text-xs shadow-xl shadow-emerald-500/25 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCw className="w-4 h-4" />
          <span>Switch Route (91% Safety)</span>
        </button>

        <button
          onClick={() => onNavigate('live_navigation')}
          className="w-full py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors"
        >
          Dismiss & Keep Current Route
        </button>
      </div>
    </div>
  );
};
