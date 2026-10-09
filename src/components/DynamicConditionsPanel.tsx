import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Lightbulb, 
  LightbulbOff, 
  Users, 
  UserMinus, 
  AlertOctagon, 
  Building2, 
  Shield, 
  RotateCw, 
  Sliders, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Info,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { 
  EnvironmentalConditionsState, 
  DynamicSafetyCalculation, 
  ScenarioPresetId 
} from '../types';
import { 
  CONDITION_SCENARIO_PRESETS, 
  DEFAULT_OPTIMAL_CONDITIONS,
  calculateDynamicSafety 
} from '../data/conditionSimulator';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface DynamicConditionsPanelProps {
  conditions: EnvironmentalConditionsState;
  onUpdateConditions: (newConditions: EnvironmentalConditionsState) => void;
  calculation: DynamicSafetyCalculation;
  onTriggerReroute: () => void;
  autoSimulate: boolean;
  onToggleAutoSimulate: (enabled: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const DynamicConditionsPanel: React.FC<DynamicConditionsPanelProps> = ({
  conditions,
  onUpdateConditions,
  calculation,
  onTriggerReroute,
  autoSimulate,
  onToggleAutoSimulate,
  isOpen = false,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'controls' | 'factors'>('presets');
  const [activePresetId, setActivePresetId] = useState<ScenarioPresetId>('optimal');
  const shouldReduceMotion = useReducedMotion();

  // Apply scenario preset
  const handleApplyPreset = (presetId: ScenarioPresetId) => {
    setActivePresetId(presetId);
    const preset = CONDITION_SCENARIO_PRESETS.find(p => p.id === presetId);
    if (preset) {
      onUpdateConditions({ ...preset.conditions });
    }
  };

  // Manual update helpers
  const handleLightingChange = (status: 'optimal' | 'moderate' | 'failed') => {
    let luxLevel = 96;
    let delta = 0;
    let label = '96 Lux LED Illumination';
    let details = 'Smart Municipal LED streetlights active with 99% uptime.';

    if (status === 'moderate') {
      luxLevel = 58;
      delta = -8;
      label = '58 Lux (Dimmed Stretch)';
      details = 'Partial lighting — alternate lamps functional.';
    } else if (status === 'failed') {
      luxLevel = 18;
      delta = -18;
      label = '18 Lux (Power Grid Outage)';
      details = 'Transformer outage reported across 350m corridor. Dark spot alert.';
    }

    onUpdateConditions({
      ...conditions,
      lighting: {
        status,
        luxLevel,
        label,
        details,
        scoreDelta: delta
      }
    });
  };

  const handlePedestrianChange = (density: 'High' | 'Medium' | 'Low' | 'Deserted') => {
    let status: 'high' | 'moderate' | 'low' | 'deserted' = 'high';
    let footfall = 52;
    let delta = 0;
    let label = 'High Pedestrian Footfall';
    let details = 'Active evening footfall with verified late-night storefronts.';

    if (density === 'Medium') {
      status = 'moderate';
      footfall = 26;
      delta = -5;
      label = 'Moderate Footfall (26/min)';
      details = 'Normal street traffic with some open commercial shops.';
    } else if (density === 'Low') {
      status = 'low';
      footfall = 11;
      delta = -10;
      label = 'Low Activity (11/min)';
      details = 'Decreased pedestrian flow — few commuters visible.';
    } else if (density === 'Deserted') {
      status = 'deserted';
      footfall = 3;
      delta = -16;
      label = 'Deserted Stretch (3/min)';
      details = 'Isolated segment after late store closures. High risk vulnerability.';
    }

    onUpdateConditions({
      ...conditions,
      pedestrian: {
        status,
        footfallPerMin: footfall,
        density,
        label,
        details,
        scoreDelta: delta
      }
    });
  };

  const handleGatheringChange = (status: 'none' | 'peaceful_march' | 'road_blockage') => {
    let delta = 0;
    let label = 'No Disruption Reported';
    let details = 'Clear passage, unobstructed sidewalks, normal transit.';

    if (status === 'peaceful_march') {
      delta = -7;
      label = 'Peaceful Civic March Ahead';
      details = 'Moderate crowd gathering moving along adjacent avenue.';
    } else if (status === 'road_blockage') {
      delta = -19;
      label = 'Barricaded Intersection (200m Ahead)';
      details = 'Police barricades restrict road width. Pedestrian detour needed.';
    }

    onUpdateConditions({
      ...conditions,
      gathering: {
        status,
        label,
        locationName: 'Sansad Marg & Patel Chowk Crossing',
        details,
        scoreDelta: delta
      }
    });
  };

  const isDegraded = calculation.currentScore < 80;

  return (
    <div className="w-full flex flex-col bg-white dark:bg-black text-black dark:text-white rounded-2xl border border-neutral-300 dark:border-neutral-800 shadow-2xl overflow-hidden font-sans transition-colors">
      {/* Header with Challenge 1 Branding & Live Score Gauge */}
      <div className="p-3 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black shrink-0 ${
            calculation.statusLevel === 'optimal' 
              ? 'bg-emerald-600 text-white' 
              : calculation.statusLevel === 'moderate' 
              ? 'bg-amber-500 text-black' 
              : 'bg-red-600 text-white'
          }`}>
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Challenge 1
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Real-Time Condition Monitor
              </span>
            </div>
            <h3 className="text-xs font-black text-black dark:text-white">
              Dynamic Safety Status Engine
            </h3>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            aria-label="Close Condition Panel"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Real-time Dynamic Score Bar */}
      <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="text-left">
            <span className="text-[9px] uppercase font-bold text-neutral-500 block">
              Route Safety Index
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-black tracking-tight ${
                calculation.statusLevel === 'optimal' 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : calculation.statusLevel === 'moderate' 
                  ? 'text-amber-500 dark:text-amber-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {calculation.currentScore}%
              </span>
              <span className="text-xs text-neutral-400 font-bold">
                / 100
              </span>
              {calculation.scoreDelta !== 0 && (
                <span className={`text-[11px] font-black flex items-center gap-0.5 ${
                  calculation.scoreDelta < 0 ? 'text-red-500' : 'text-emerald-500'
                }`}>
                  {calculation.scoreDelta < 0 ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <TrendingUp className="w-3 h-3" />
                  )}
                  <span>{calculation.scoreDelta > 0 ? `+${calculation.scoreDelta}` : calculation.scoreDelta} pts</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="text-right">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
            calculation.statusLevel === 'optimal'
              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
              : calculation.statusLevel === 'moderate'
              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
              : 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              calculation.statusLevel === 'optimal' ? 'bg-emerald-500' : calculation.statusLevel === 'moderate' ? 'bg-amber-500' : 'bg-red-500'
            } animate-pulse`} />
            <span>{calculation.statusLabel}</span>
          </span>
          <p className="text-[9px] text-neutral-500 dark:text-neutral-400 mt-1 max-w-[170px] truncate">
            {calculation.summaryMessage}
          </p>
        </div>
      </div>

      {/* Reroute Alert Prompt if Score is Compromised */}
      {isDegraded && (
        <motion.div 
          initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
          animate={shouldReduceMotion ? false : { opacity: 1, height: 'auto' }}
          className="p-2.5 bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-900/60 flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-black text-red-700 dark:text-red-300 block truncate">
                Safer Alternative Available (+{calculation.alternativeGain}% Gain)
              </span>
              <p className="text-[9px] text-red-600 dark:text-red-400 truncate">
                Grand Blvd Corridor bypasses unlit and disrupted stretch.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onTriggerReroute}
            className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-black text-[10px] flex items-center gap-1 shrink-0 transition-colors cursor-pointer shadow-xs"
          >
            <span>Reroute</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </motion.div>
      )}

      {/* Tabs: Presets | Manual Controls | Factor Breakdown */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-1.5 text-[11px] font-bold text-center border-b-2 transition-colors cursor-pointer ${
            activeTab === 'presets'
              ? 'border-black dark:border-white text-black dark:text-white bg-white dark:bg-black font-black'
              : 'border-transparent text-neutral-500 hover:text-black dark:hover:text-white'
          }`}
        >
          Scenarios
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('controls')}
          className={`flex-1 py-1.5 text-[11px] font-bold text-center border-b-2 transition-colors cursor-pointer ${
            activeTab === 'controls'
              ? 'border-black dark:border-white text-black dark:text-white bg-white dark:bg-black font-black'
              : 'border-transparent text-neutral-500 hover:text-black dark:hover:text-white'
          }`}
        >
          Live Factors
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('factors')}
          className={`flex-1 py-1.5 text-[11px] font-bold text-center border-b-2 transition-colors cursor-pointer ${
            activeTab === 'factors'
              ? 'border-black dark:border-white text-black dark:text-white bg-white dark:bg-black font-black'
              : 'border-transparent text-neutral-500 hover:text-black dark:hover:text-white'
          }`}
        >
          Impact Breakdown
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="p-3 max-h-56 overflow-y-auto no-scrollbar space-y-2.5">
        {/* TAB 1: SCENARIO PRESETS */}
        {activeTab === 'presets' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] text-neutral-500 font-bold">
              <span>Select Challenge 1 Scenario:</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSimulate}
                  onChange={(e) => onToggleAutoSimulate(e.target.checked)}
                  className="rounded border-neutral-300 dark:border-neutral-700 text-black dark:text-white focus:ring-0 cursor-pointer"
                />
                <span className="text-[10px] text-black dark:text-white font-black">
                  Auto-Trigger along Route
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {CONDITION_SCENARIO_PRESETS.map((preset) => {
                const isSelected = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset.id)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-sm'
                        : 'bg-neutral-50 dark:bg-neutral-900/70 border-neutral-200 dark:border-neutral-800 text-black dark:text-white hover:border-neutral-400 dark:hover:border-neutral-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-black truncate max-w-[160px]">
                        {preset.name}
                      </span>
                      <span className={`text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded ${
                        isSelected 
                          ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black' 
                          : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}>
                        {preset.expectedScore}%
                      </span>
                    </div>
                    <p className={`text-[9px] leading-tight ${
                      isSelected ? 'text-neutral-300 dark:text-neutral-700' : 'text-neutral-500 dark:text-neutral-400'
                    }`}>
                      {preset.tagline}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MANUAL LIVE FACTORS CONTROLS */}
        {activeTab === 'controls' && (
          <div className="space-y-2.5 text-xs">
            {/* 1. Street Lighting Control */}
            <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[11px] font-bold">Street Lighting (Lux Level)</span>
                </div>
                <span className="text-[10px] font-extrabold text-neutral-500">
                  {conditions.lighting.luxLevel} Lux
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(['optimal', 'moderate', 'failed'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleLightingChange(mode)}
                    className={`py-1 rounded-lg text-[10px] font-black capitalize transition-colors cursor-pointer ${
                      conditions.lighting.status === mode
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300'
                    }`}
                  >
                    {mode === 'optimal' ? 'Optimal (96L)' : mode === 'moderate' ? 'Dim (58L)' : 'Outage (18L)'}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Pedestrian Crowd Density Control */}
            <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[11px] font-bold">Pedestrian Footfall Activity</span>
                </div>
                <span className="text-[10px] font-extrabold text-neutral-500">
                  {conditions.pedestrian.footfallPerMin} / min
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {(['High', 'Medium', 'Low', 'Deserted'] as const).map((density) => (
                  <button
                    key={density}
                    type="button"
                    onClick={() => handlePedestrianChange(density)}
                    className={`py-1 rounded-lg text-[9px] font-black transition-colors cursor-pointer ${
                      conditions.pedestrian.density === density
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300'
                    }`}
                  >
                    {density}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Gathering & Road Blockade Control */}
            <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-[11px] font-bold">Public Gathering / Barricade</span>
                </div>
                <span className="text-[10px] font-extrabold text-neutral-500">
                  {conditions.gathering.status === 'none' ? 'Clear' : 'Disrupted'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(['none', 'peaceful_march', 'road_blockage'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleGatheringChange(st)}
                    className={`py-1 rounded-lg text-[9px] font-black capitalize transition-colors cursor-pointer ${
                      conditions.gathering.status === st
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300'
                    }`}
                  >
                    {st === 'none' ? 'Clear' : st === 'peaceful_march' ? 'Assembly' : 'Blockade'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FACTOR IMPACT BREAKDOWN (SHAP-STYLE) */}
        {activeTab === 'factors' && (
          <div className="space-y-1.5">
            {calculation.factorBreakdown.map((factor) => (
              <div
                key={factor.id}
                className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black text-black dark:text-white">
                      {factor.name}
                    </span>
                    <span className="text-[9px] text-neutral-500 font-bold truncate">
                      • {factor.status}
                    </span>
                  </div>
                  <p className="text-[9px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-tight">
                    {factor.description}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black shrink-0 ${
                  factor.scoreDelta > 0
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : factor.scoreDelta < 0
                    ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                    : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                }`}>
                  {factor.scoreDelta > 0 ? `+${factor.scoreDelta}` : factor.scoreDelta} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Reset & Quick Reroute Action */}
      <div className="p-2.5 bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => handleApplyPreset('optimal')}
          className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          Reset Optimal
        </button>

        <div className="flex items-center gap-1.5">
          <Button
            variant={isDegraded ? 'primary' : 'outline'}
            size="sm"
            onClick={onTriggerReroute}
            icon={<RotateCw className="w-3.5 h-3.5" />}
          >
            {isDegraded ? 'Reroute to Grand Blvd' : 'View Detour Options'}
          </Button>
        </div>
      </div>
    </div>
  );
};
