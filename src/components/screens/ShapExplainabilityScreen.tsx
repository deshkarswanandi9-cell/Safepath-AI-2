import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Cpu, 
  Info, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Sparkles,
  RotateCw,
  SunMedium,
  Users,
  AlertTriangle,
  Building2,
  Clock,
  Check
} from 'lucide-react';
import { ScreenId } from '../../types';
import { SHAP_FEATURES, MOCK_ROUTES } from '../../data/mockData';
import { CONDITION_SCENARIO_PRESETS, evaluateAdaptiveRecommendation, calculateDynamicSafety } from '../../data/conditionSimulator';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ShapExplainabilityScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const ShapExplainabilityScreen: React.FC<ShapExplainabilityScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'static_shap' | 'dynamic_recommendation'>('dynamic_recommendation');
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState<number>(4); // Compound risk preset by default

  const currentPreset = CONDITION_SCENARIO_PRESETS[selectedScenarioIdx] || CONDITION_SCENARIO_PRESETS[4];
  const dynamicCalc = calculateDynamicSafety(85, currentPreset.conditions);
  const adaptiveRec = evaluateAdaptiveRecommendation(
    MOCK_ROUTES[0], // Active route (85 -> 54%)
    MOCK_ROUTES,
    currentPreset.conditions,
    dynamicCalc
  );

  const maxVal = 40;

  return (
    <div className="relative h-full flex flex-col justify-between bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar p-4 pb-20">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pt-1 mb-3">
          <button
            id="btn-shap-back"
            type="button"
            onClick={() => onNavigate('route_comparison')}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Back to Route Comparison"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] font-black text-black dark:text-white">
            <Cpu className="w-3.5 h-3.5" />
            <span>XAI Decision Engine</span>
          </div>
          <div className="w-7" />
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 mb-3 text-[11px] font-black">
          <button
            type="button"
            onClick={() => setActiveTab('dynamic_recommendation')}
            className={`py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'dynamic_recommendation'
                ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs border border-neutral-300 dark:border-neutral-700'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Adaptive Reroute XAI
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('static_shap')}
            className={`py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'static_shap'
                ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs border border-neutral-300 dark:border-neutral-700'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Static SHAP Weights
          </button>
        </div>

        {/* Tab 1: Challenge 3 Dynamic Recommendation Shift Reasoner */}
        {activeTab === 'dynamic_recommendation' ? (
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <h1 className="text-sm font-black tracking-tight text-black dark:text-white">
                  Why Recommendation Changed
                </h1>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed mt-0.5">
                SafeRoute AI recalculates available corridor scores when sensor conditions degrade and explains why it recommended an alternative path.
              </p>
            </div>

            {/* Scenario Selector */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                Simulate Condition Shift Event:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {CONDITION_SCENARIO_PRESETS.slice(0, 4).map((preset, idx) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedScenarioIdx(idx)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedScenarioIdx === idx
                        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-bold'
                        : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    <div className="text-[10px] font-black truncate">{preset.name}</div>
                    <div className="text-[8px] opacity-80 mt-0.5">{preset.tagline}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Score Migration Card */}
            <Card variant="default" padding="sm" className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                  Corridor Reassessment
                </span>
                <Badge variant={adaptiveRec.hasRecommendationChanged ? 'emergency' : 'safe'} size="sm">
                  {adaptiveRec.hasRecommendationChanged ? 'Recommendation Updated' : 'Current Optimal'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60">
                  <span className="text-[9px] font-black uppercase text-red-700 dark:text-red-400 block">
                    Current Active Route
                  </span>
                  <span className="text-sm font-black text-red-600 dark:text-red-400 mt-0.5 block">
                    {dynamicCalc.currentScore}% Safety
                  </span>
                  <span className="text-[9px] text-neutral-500 line-through">
                    Initial: {dynamicCalc.baselineScore}%
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
                  <span className="text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-400 block">
                    Recommended Alternative
                  </span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    {adaptiveRec.recommendedRouteScore}% Safety
                  </span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">
                    +{adaptiveRec.scoreGain}% Advantage
                  </span>
                </div>
              </div>

              {/* Natural Language Reason */}
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] space-y-1.5">
                <span className="font-black text-black dark:text-white block">
                  AI Decision Rationale:
                </span>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
                  {adaptiveRec.whyRecommendationChanged}
                </p>
              </div>
            </Card>

            {/* Factor Comparison Breakdown */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                Factor Shift Comparison
              </span>
              <div className="space-y-1.5">
                {adaptiveRec.factorComparison.map((f, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 text-[10px] space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-black dark:text-white">{f.factorName}</span>
                      <span className={f.isAdvantage ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-500'}>
                        {f.scoreImpact}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[9px] pt-1 border-t border-neutral-100 dark:border-neutral-900">
                      <div>
                        <span className="text-neutral-500 block">Current Route:</span>
                        <span className="text-red-600 dark:text-red-400 font-semibold">{f.currentRouteValue}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-neutral-500 block">Recommended Alternative:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{f.recommendedRouteValue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Tab 2: Static SHAP Waterfall */
          <div>
            <div className="mb-3">
              <h1 className="text-sm font-black tracking-tight text-black dark:text-white">
                Base SHAP Factor Contributions
              </h1>
              <p className="text-xs text-neutral-500 leading-relaxed mt-0.5">
                Shapley Additive Explanations (SHAP) mathematically decomposing individual factor weights toward the total safety confidence.
              </p>
            </div>

            {/* Feature Contribution Waterfall */}
            <Card variant="default" padding="sm" className="mb-3 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <div>
                  <span className="text-xs font-black text-black dark:text-white">Factor Contributions</span>
                  <p className="text-[10px] text-neutral-500">Baseline safety threshold: 50%</p>
                </div>
                <Badge variant="safe" size="sm">
                  Net: +44 pts
                </Badge>
              </div>

              <div className="space-y-1.5 pt-1">
                {SHAP_FEATURES.map((item, idx) => {
                  const isPositive = item.category === 'positive';
                  const absVal = Math.abs(item.value);
                  const barWidthPct = (absVal / maxVal) * 100;
                  const isSelected = activeFeature === item.name;

                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveFeature(isSelected ? null : item.name)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-neutral-100 dark:bg-neutral-900 border-black dark:border-white shadow-xs'
                          : 'bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded-md ${
                            isPositive 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                              : 'bg-red-500/10 text-red-600 dark:text-red-400'
                          }`}>
                            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          </div>
                          <span className="text-xs font-bold text-black dark:text-white">{item.name}</span>
                        </div>

                        <span className={`text-xs font-black ${
                          isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {isPositive ? `+${item.value} pts` : `${item.value} pts`}
                        </span>
                      </div>

                      {/* Horizontal Bar */}
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            isPositive ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${barWidthPct}%` }}
                        />
                      </div>

                      {/* Detailed Explanation on Click */}
                      {isSelected && (
                        <p className="text-[10px] text-neutral-600 dark:text-neutral-400 mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-800 leading-relaxed font-medium">
                          {item.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="text-center pt-2">
        <p className="text-[10px] text-neutral-400 font-medium">
          Transparent algorithmic safety validation powered by municipal sensors
        </p>
      </div>
    </div>
  );
};

