import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Cpu, 
  Info, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck
} from 'lucide-react';
import { ScreenId } from '../../types';
import { SHAP_FEATURES } from '../../data/mockData';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ShapExplainabilityScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const ShapExplainabilityScreen: React.FC<ShapExplainabilityScreenProps> = ({ onNavigate }) => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const maxVal = 40;

  return (
    <div className="relative h-full flex flex-col justify-between bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar p-4 pb-6">
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
            <span>SHAP Explainability</span>
          </div>
          <div className="w-7" />
        </div>

        {/* Title & Explanation */}
        <div className="mb-3">
          <h1 className="text-base font-black tracking-tight text-black dark:text-white">
            Why is this route scored 94%?
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

      <div className="text-center pt-2">
        <p className="text-[10px] text-neutral-400 font-medium">
          Transparent algorithmic safety validation powered by municipal sensors
        </p>
      </div>
    </div>
  );
};
