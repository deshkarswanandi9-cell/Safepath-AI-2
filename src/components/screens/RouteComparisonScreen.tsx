import React from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Navigation, 
  Info, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { ScreenId, RouteOption } from '../../types';
import { MOCK_ROUTES } from '../../data/mockData';
import { MapEngine } from '../MapEngine';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

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
    <div className="relative h-full flex flex-col justify-between bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar pb-20">
      {/* Top Map Preview */}
      <div className="relative h-48 w-full shrink-0 border-b border-neutral-200 dark:border-neutral-800">
        <MapEngine
          activeRoute={selectedRoute}
          heightClass="h-full"
          showHeatmap={true}
          showHelpPoints={true}
          interactive={false}
        />
        {/* Floating Top Controls */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          <button
            id="btn-comparison-back"
            type="button"
            onClick={() => onNavigate('route_search')}
            className="p-1.5 rounded-lg bg-white/95 dark:bg-black/95 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white shadow-xs cursor-pointer"
            aria-label="Back to Route Search"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="px-2.5 py-1 rounded-md bg-white/95 dark:bg-black/95 border border-neutral-300 dark:border-neutral-700 text-[10px] font-black text-black dark:text-white shadow-xs">
            Evaluated Corridors
          </span>
          <button
            type="button"
            onClick={() => onNavigate('shap_explain')}
            className="p-1.5 rounded-lg bg-white/95 dark:bg-black/95 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white shadow-xs cursor-pointer"
            title="View SHAP feature explanations"
            aria-label="View SHAP feature explanations"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-white/95 dark:bg-black/95 text-[10px] font-bold border border-neutral-200 dark:border-neutral-800 text-black dark:text-white flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Selected: {selectedRoute.name}</span>
        </div>
      </div>

      {/* Main Route Options List */}
      <div className="p-4 flex-1 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
              AI Trajectory Comparison
            </h2>
            <p className="text-[10px] text-neutral-500">Select optimal corridor for navigation</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('shap_explain')}
            className="text-[10px] font-bold text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            Explain Score →
          </button>
        </div>

        {/* Route Cards */}
        {MOCK_ROUTES.map((r) => {
          const isSelected = selectedRoute.id === r.id;
          const isRec = r.isRecommended;

          let badgeVariant: 'safe' | 'caution' | 'emergency' = 'safe';
          if (r.safetyScore < 65) badgeVariant = 'emergency';
          else if (r.safetyScore < 85) badgeVariant = 'caution';

          return (
            <div
              key={r.id}
              onClick={() => onSelectRoute(r)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-neutral-50 dark:bg-neutral-900 border-black dark:border-white shadow-xs'
                  : 'bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-black dark:border-white bg-black dark:bg-white' : 'border-neutral-400'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-xs font-black text-black dark:text-white truncate">{r.name}</h3>
                      {isRec && (
                        <span className="px-1.5 py-0.2 bg-black text-white dark:bg-white dark:text-black text-[8px] font-black rounded shrink-0">
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-neutral-500 flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 shrink-0"><Clock className="w-3 h-3" /> {r.time} ({r.distance})</span>
                      <span>•</span>
                      <span className="truncate">{r.tagline}</span>
                    </div>
                  </div>
                </div>

                <Badge variant={badgeVariant} size="md" className="shrink-0">
                  {r.safetyScore}%
                </Badge>
              </div>

              {/* Reasons & Features */}
              {r.reasons && (
                <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-1 text-[9px]">
                  {r.reasons.map((reason, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold">
                      ✓ {reason}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Start Navigation CTA */}
      <div className="px-4 pt-1">
        <Button
          id="btn-start-navigation"
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => onNavigate('live_navigation')}
          icon={<Navigation className="w-4 h-4" />}
        >
          Start Safe Navigation ({selectedRoute.safetyScore}% Index)
        </Button>
      </div>
    </div>
  );
};
