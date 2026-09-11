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
  EyeOff
} from 'lucide-react';
import { ScreenId } from '../../types';
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
  const [prioritizeSafety, setPrioritizeSafety] = useState(true);
  const [avoidIsolated, setAvoidIsolated] = useState(true);
  const [preferPublicTransit, setPreferPublicTransit] = useState(true);
  const [wheelchairAccessible, setWheelchairAccessible] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setTimeout(() => {
      onGenerateRoutes();
      onNavigate('route_comparison');
    }, 800);
  };

  return (
    <div className="relative min-h-[640px] h-full flex flex-col justify-between bg-[#F8FAFC] overflow-hidden">
      {/* Background Interactive Live Map */}
      <div className="absolute inset-0 z-0">
        <MapEngine
          heightClass="h-full"
          showHeatmap={true}
          showHelpPoints={true}
          showStreetlights={true}
          interactive={true}
        />
      </div>

      {/* Top Floating Header & Input Card */}
      <div className="relative z-10 p-4 pt-3">
        <div className="p-4 rounded-3xl bg-white/95 backdrop-blur-xl shadow-xl border border-slate-200/80">
          <div className="flex items-center gap-2 mb-3">
            <button
              id="btn-search-back"
              onClick={() => onNavigate('dashboard')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">{t.routePlanner}</h2>
              <p className="text-[10px] text-slate-500">AI evaluates illumination & density</p>
            </div>
          </div>

          {/* Form Input Fields */}
          <div className="space-y-2.5">
            {/* From Input */}
            <div className="relative flex items-center">
              <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mr-2.5">
                <Navigation className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">{t.fromLabel}</label>
                <input
                  id="input-route-from"
                  type="text"
                  value={fromLoc}
                  onChange={(e) => setFromLoc(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none"
                  placeholder="Start location"
                />
              </div>
            </div>

            <div className="ml-3.5 h-3 border-l-2 border-dashed border-slate-200"></div>

            {/* To Input */}
            <div className="relative flex items-center">
              <div className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 mr-2.5 shadow-sm">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">{t.toLabel}</label>
                <input
                  id="input-route-to"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
                  placeholder="Where to? (e.g. Westwood Residence)"
                />
              </div>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex gap-2 mt-3 pt-2.5 border-t border-slate-100 overflow-x-auto no-scrollbar">
            {[
              { label: 'Westwood Res.', full: 'Westwood Residence, 88 Parkview' },
              { label: 'Central Station', full: 'Central Metro Concourse' },
              { label: 'University Hall', full: 'City University Campus' }
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setDestination(preset.full)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 text-[10px] font-semibold whitespace-nowrap transition-colors"
              >
                📍 {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Floating Options & Primary CTA Card */}
      <div className="relative z-10 p-4 pb-6">
        <div className="p-4 rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" />
              {t.safetyPreferences}
            </span>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              SHAP Active
            </span>
          </div>

          {/* Safety Checkbox Toggles */}
          <div className="space-y-2 mb-4">
            {/* Option 1: Prioritize Safety */}
            <label className="flex items-center justify-between p-2 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 cursor-pointer hover:bg-emerald-50 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-950">{t.prioritizeSafety}</span>
                  <p className="text-[9px] text-emerald-700">{t.prioritizeSafetyDesc}</p>
                </div>
              </div>
              <input
                id="chk-prioritize-safety"
                type="checkbox"
                checked={prioritizeSafety}
                onChange={(e) => setPrioritizeSafety(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
              />
            </label>

            {/* Option 2: Avoid Isolated Roads */}
            <label className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <EyeOff className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800">{t.avoidIsolated}</span>
                  <p className="text-[9px] text-slate-500">{t.avoidIsolatedDesc}</p>
                </div>
              </div>
              <input
                id="chk-avoid-isolated"
                type="checkbox"
                checked={avoidIsolated}
                onChange={(e) => setAvoidIsolated(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
              />
            </label>

            {/* Option 3: Prefer Public Transport */}
            <label className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Train className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800">{t.preferPublic}</span>
                  <p className="text-[9px] text-slate-500">{t.preferPublicDesc}</p>
                </div>
              </div>
              <input
                id="chk-prefer-public"
                type="checkbox"
                checked={preferPublicTransit}
                onChange={(e) => setPreferPublicTransit(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
              />
            </label>

            {/* Option 4: Wheelchair Accessible */}
            <label className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Accessibility className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800">{t.wheelchair}</span>
                  <p className="text-[9px] text-slate-500">{t.wheelchairDesc}</p>
                </div>
              </div>
              <input
                id="chk-wheelchair"
                type="checkbox"
                checked={wheelchairAccessible}
                onChange={(e) => setWheelchairAccessible(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
              />
            </label>
          </div>

          {/* Primary CTA: Generate Routes */}
          <button
            id="btn-generate-routes"
            onClick={handleGenerate}
            disabled={isCalculating}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-xl shadow-blue-500/25 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
          >
            <Sparkles className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
            <span>{isCalculating ? t.computingRoutes : t.generateRoutesBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
