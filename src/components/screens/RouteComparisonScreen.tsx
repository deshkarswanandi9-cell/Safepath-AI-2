import React from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Navigation, 
  Info, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { ScreenId, RouteOption } from '../../types';
import { MOCK_ROUTES } from '../../data/mockData';
import { MapEngine } from '../MapEngine';
import { MultiRouteComparisonCard } from '../MultiRouteComparisonCard';
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
    <div className="relative h-full flex flex-col justify-between bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar pb-20 font-sans">
      {/* Top Map Preview */}
      <div className="relative h-52 w-full shrink-0 border-b border-neutral-200 dark:border-neutral-800">
        <MapEngine
          activeRoute={selectedRoute}
          routesToCompare={MOCK_ROUTES}
          heightClass="h-full"
          showHeatmap={true}
          showHelpPoints={true}
          interactive={true}
          onSelectRoute={(id) => {
            const match = MOCK_ROUTES.find(r => r.id === id);
            if (match) onSelectRoute(match);
          }}
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
            Evaluated Corridors ({MOCK_ROUTES.length})
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

        <div className="absolute bottom-2 left-2.5 px-2.5 py-1 rounded-lg bg-white/95 dark:bg-black/95 text-[10px] font-bold border border-neutral-200 dark:border-neutral-800 text-black dark:text-white flex items-center gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedRoute.color }} />
          <span>Active: {selectedRoute.name.split('(')[0]} ({selectedRoute.safetyScore}%)</span>
        </div>
      </div>

      {/* Main Multi-Route Options & Comparison Section */}
      <div className="p-4 flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                Challenge 2
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-extrabold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-800">
                Multi-Route Intelligence
              </span>
            </div>
            <h2 className="text-xs font-black tracking-tight text-black dark:text-white">
              Alternative Route Comparison
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('shap_explain')}
            className="text-[10px] font-bold text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            Explain Score →
          </button>
        </div>

        {/* MultiRouteComparisonCard Component */}
        <MultiRouteComparisonCard
          routes={MOCK_ROUTES}
          selectedRouteId={selectedRoute.id}
          onSelectRoute={onSelectRoute}
          onConfirmRoute={(r) => {
            onSelectRoute(r);
            onNavigate('live_navigation');
          }}
        />
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
          Start Safe Navigation with {selectedRoute.name.split('(')[0]} ({selectedRoute.safetyScore}% Index)
        </Button>
      </div>
    </div>
  );
};

