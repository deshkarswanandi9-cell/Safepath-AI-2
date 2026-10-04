import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  SlidersHorizontal,
  Compass,
  CornerDownRight,
  Accessibility,
  Train,
  EyeOff,
  Route,
  CheckCircle2,
  Clock,
  ChevronRight,
  Users,
  Hospital,
  SunMedium,
  Zap,
  Radio
} from 'lucide-react';
import { ScreenId, RouteOption } from '../../types';
import { MOCK_ROUTES } from '../../data/mockData';
import { MapEngine } from '../MapEngine';
import { useLanguage } from '../../context/LanguageContext';

interface RouteSearchScreenProps {
  onNavigate: (screen: ScreenId) => void;
  destination: string;
  setDestination: (dest: string) => void;
  onGenerateRoutes: () => void;
}

export const RouteSearchScreen: React.FC<RouteSearchScreenProps> = ({
  onNavigate,
  destination,
  setDestination,
  onGenerateRoutes
}) => {
  const { t } = useLanguage();
  const [fromLoc, setFromLoc] = useState('Current Location (124 Grand Blvd)');
  const [selectedPathIndex, setSelectedPathIndex] = useState(0);
  const [prioritizeSafety, setPrioritizeSafety] = useState(true);
  const [avoidIsolated, setAvoidIsolated] = useState(true);
  const [preferPublicTransit, setPreferPublicTransit] = useState(true);
  const [wheelchairAccessible, setWheelchairAccessible] = useState(false);
  const [publicGatheringMode, setPublicGatheringMode] = useState(true);
  const [medicalCorridorPriority, setMedicalCorridorPriority] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsCalculating(true);
    setTimeout(() => {
      onGenerateRoutes();
      onNavigate('route_comparison');
    }, 600);
  };

  const handleDirectSelectPath = (routeIdx: number) => {
    setSelectedPathIndex(routeIdx);
    setIsCalculating(true);
    setTimeout(() => {
      onGenerateRoutes();
      onNavigate('route_comparison');
    }, 400);
  };

  return (
    <div className="relative min-h-[640px] h-full flex flex-col bg-[#0b101b] text-slate-100 overflow-y-auto no-scrollbar pb-28">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-60 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Floating Header & Input Card */}
      <div className="p-4 pt-3 relative z-10">
        <div className="p-4 rounded-3xl bg-slate-900/90 backdrop-blur-xl shadow-2xl border border-white/15">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <button
                id="btn-search-back"
                onClick={() => onNavigate('dashboard')}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors border border-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-sm font-black text-white">{t.routePlanner}</h2>
                <p className="text-[10px] text-slate-400">Evaluating 18 safety parameters in real time</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-black">
              AI Powered
            </span>
          </div>

          {/* Form Input Fields */}
          <div className="space-y-2.5">
            {/* From Input */}
            <div className="relative flex items-center p-2.5 rounded-2xl bg-white/5 border border-white/10 focus-within:border-blue-500 transition-colors">
              <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mr-2.5 border border-blue-400/30">
                <Navigation className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">{t.fromLabel}</label>
                <input
                  id="input-route-from"
                  type="text"
                  value={fromLoc}
                  onChange={(e) => setFromLoc(e.target.value)}
                  className="w-full text-xs font-bold text-white bg-transparent focus:outline-none"
                  placeholder="Start location"
                />
              </div>
            </div>

            {/* To Input */}
            <div className="relative flex items-center p-2.5 rounded-2xl bg-white/5 border border-white/10 focus-within:border-rose-500 transition-colors">
              <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mr-2.5 border border-rose-400/30">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">{t.toLabel}</label>
                <input
                  id="input-route-to"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-xs font-bold text-white bg-transparent focus:outline-none placeholder:text-slate-500"
                  placeholder="Where to? (e.g. Westwood Residence)"
                />
              </div>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex gap-2 mt-3 pt-3 border-t border-white/10 overflow-x-auto no-scrollbar">
            {[
              { label: 'Westwood Res.', full: 'Westwood Residence, 88 Parkview' },
              { label: 'Central Station', full: 'Central Metro Concourse' },
              { label: 'University Hall', full: 'City University Campus' }
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setDestination(preset.full)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-blue-600/30 hover:text-blue-300 text-slate-300 text-[10px] font-bold whitespace-nowrap transition-colors border border-white/10"
              >
                📍 {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded Live Map Section */}
      <div className="mx-4 rounded-3xl overflow-hidden shadow-2xl border border-white/15 relative shrink-0">
        <MapEngine
          heightClass="h-44"
          showHeatmap={true}
          showHelpPoints={true}
          showStreetlights={true}
          interactive={true}
        />
        <div className="absolute top-2.5 left-3 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-[10px] font-black text-white flex items-center gap-1.5 shadow-md border border-white/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-emerald-300">Live AI Vector Corridors</span>
        </div>
      </div>

      {/* Select Safe Path / Trajectories Section */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Route className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Select Path / Trajectory
            </h3>
          </div>
          <span className="text-[10px] font-black text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
            3 Evaluated
          </span>
        </div>

        {/* 3 Selectable Path Cards */}
        <div className="space-y-2">
          {MOCK_ROUTES.map((route, idx) => {
            const isSelected = selectedPathIndex === idx;
            const isRec = route.isRecommended;

            return (
              <div
                key={route.id}
                id={`btn-select-path-${idx}`}
                onClick={() => handleDirectSelectPath(idx)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-lg ${
                  isSelected
                    ? 'bg-slate-800/95 border-blue-500 ring-2 ring-blue-500/30 shadow-blue-500/10'
                    : 'bg-slate-900/90 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-md ${
                    isRec ? 'bg-emerald-500 shadow-emerald-500/30' : route.safetyScore > 70 ? 'bg-amber-500 shadow-amber-500/30' : 'bg-rose-500 shadow-rose-500/30'
                  }`}>
                    {route.name.replace('ROUTE ', '')}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-white">{route.name}</span>
                      {isRec && (
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[9px] font-black uppercase">
                          Safe Pick
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                      <span>{route.distance}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5 text-slate-400" /> {route.time}
                      </span>
                      <span>•</span>
                      <span className="text-amber-300 flex items-center gap-0.5">
                        <SunMedium className="w-2.5 h-2.5" /> 98% Lit
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-[9px] uppercase font-bold text-slate-400">Safety</div>
                    <div className={`text-base font-black ${
                      route.safetyScore >= 90 ? 'text-emerald-400' : route.safetyScore >= 70 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {route.safetyScore}%
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Preferences & Constraints */}
      <div className="px-4 mt-4">
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-white flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
              {t.safetyPreferences}
            </span>
            <span className="text-[10px] font-black text-purple-300 bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded-full">
              SHAP Active
            </span>
          </div>

          {/* Safety Checkbox Toggles */}
          <div className="space-y-2 mb-4">
            {/* Option 1: Prioritize Safety */}
            <label className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 cursor-pointer hover:bg-emerald-950/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-200">{t.prioritizeSafety}</span>
                  <p className="text-[9px] text-emerald-400/80">{t.prioritizeSafetyDesc}</p>
                </div>
              </div>
              <input
                id="chk-prioritize-safety"
                type="checkbox"
                checked={prioritizeSafety}
                onChange={(e) => setPrioritizeSafety(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
              />
            </label>

            {/* Option 2: Avoid Isolated Roads */}
            <label className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-400/30">
                  <EyeOff className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200">{t.avoidIsolated}</span>
                  <p className="text-[9px] text-slate-400">{t.avoidIsolatedDesc}</p>
                </div>
              </div>
              <input
                id="chk-avoid-isolated"
                type="checkbox"
                checked={avoidIsolated}
                onChange={(e) => setAvoidIsolated(e.target.checked)}
                className="w-4 h-4 rounded text-blue-500 accent-blue-500 cursor-pointer"
              />
            </label>

            {/* Option 3: Prefer Public Transport */}
            <label className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-400/30">
                  <Train className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200">{t.preferPublic}</span>
                  <p className="text-[9px] text-slate-400">{t.preferPublicDesc}</p>
                </div>
              </div>
              <input
                id="chk-prefer-public"
                type="checkbox"
                checked={preferPublicTransit}
                onChange={(e) => setPreferPublicTransit(e.target.checked)}
                className="w-4 h-4 rounded text-purple-500 accent-purple-500 cursor-pointer"
              />
            </label>

            {/* Option 4: Wheelchair Accessible */}
            <label className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                  <Accessibility className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200">{t.wheelchair}</span>
                  <p className="text-[9px] text-slate-400">{t.wheelchairDesc}</p>
                </div>
              </div>
              <input
                id="chk-wheelchair"
                type="checkbox"
                checked={wheelchairAccessible}
                onChange={(e) => setWheelchairAccessible(e.target.checked)}
                className="w-4 h-4 rounded text-blue-500 accent-blue-500 cursor-pointer"
              />
            </label>

            {/* Option 5: Public Gathering & Protest Aware Mode */}
            <label className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 cursor-pointer hover:bg-amber-950/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-200">Public Gathering & Protest Aware</span>
                  <p className="text-[9px] text-amber-400/80">Avoid active bottlenecks, barricades & congested gates</p>
                </div>
              </div>
              <input
                id="chk-gathering-aware"
                type="checkbox"
                checked={publicGatheringMode}
                onChange={(e) => setPublicGatheringMode(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
              />
            </label>

            {/* Option 6: Emergency Medical Access Priority */}
            <label className="flex items-center justify-between p-2.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 cursor-pointer hover:bg-cyan-950/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-400/30">
                  <Hospital className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-cyan-200">Prioritize Medical Corridors</span>
                  <p className="text-[9px] text-cyan-400/80">Guide along green hospital & first-aid ambulance lanes</p>
                </div>
              </div>
              <input
                id="chk-medical-corridor"
                type="checkbox"
                checked={medicalCorridorPriority}
                onChange={(e) => setMedicalCorridorPriority(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 accent-cyan-500 cursor-pointer"
              />
            </label>
          </div>

          {/* Primary CTA: Generate & Select Safe Routes */}
          <button
            id="btn-generate-routes"
            onClick={() => handleGenerate()}
            disabled={isCalculating}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-xs shadow-xl shadow-blue-500/30 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
          >
            <Sparkles className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
            <span>{isCalculating ? t.computingRoutes : 'Select Safe Path & Compare (AI Evaluated)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
