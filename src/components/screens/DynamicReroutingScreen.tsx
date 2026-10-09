import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RotateCw, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  LightbulbOff, 
  Users, 
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { ScreenId, RouteOption, DynamicSafetyCalculation, EnvironmentalConditionsState, StoppedWaypointState } from '../../types';
import { MOCK_ROUTES } from '../../data/mockData';
import { MapEngine } from '../MapEngine';
import { MultiRouteComparisonCard } from '../MultiRouteComparisonCard';
import { 
  generateEmergencyReroutesFromStoppedPoint, 
  createStoppedWaypointSnapshot, 
  getNearestHavenFromLocation 
} from '../../utils/dynamicRerouting';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface DynamicReroutingScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onConfirmReroute: () => void;
  onSelectAndNavigateRoute?: (route: RouteOption, resumeProgress?: number) => void;
  calculation?: DynamicSafetyCalculation;
  conditions?: EnvironmentalConditionsState;
  stoppedWaypoint?: StoppedWaypointState | null;
  activeRoute?: RouteOption;
}

export const DynamicReroutingScreen: React.FC<DynamicReroutingScreenProps> = ({
  onNavigate,
  onConfirmReroute,
  onSelectAndNavigateRoute,
  calculation,
  conditions,
  stoppedWaypoint: externalStoppedWaypoint,
  activeRoute = MOCK_ROUTES[2]
}) => {
  // Create or use stopped waypoint snapshot
  const stoppedWaypoint = externalStoppedWaypoint || createStoppedWaypointSnapshot(
    activeRoute,
    45, // default simulation stop at 45% if none passed
    conditions,
    'emergency_alert'
  );

  const oldScore = stoppedWaypoint.calculatedRiskScore || calculation?.currentScore || 54;
  
  // Dynamically generate routes starting from the EXACT stopped location
  const dynamicRoutes: RouteOption[] = generateEmergencyReroutesFromStoppedPoint(
    stoppedWaypoint,
    conditions || activeRoute ? { ...conditions! } : undefined as any
  );

  const [previewRoute, setPreviewRoute] = useState<RouteOption>(dynamicRoutes[2] || dynamicRoutes[0]);
  const safetyGain = Math.max(15, previewRoute.safetyScore - oldScore);

  const handleConfirm = (route: RouteOption) => {
    if (onSelectAndNavigateRoute) {
      onSelectAndNavigateRoute(route, stoppedWaypoint.progress);
    } else {
      onConfirmReroute();
    }
  };

  return (
    <div className="relative h-full flex flex-col justify-between bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar pb-20 font-sans">
      {/* Top Map Preview */}
      <div className="relative h-52 w-full shrink-0 border-b border-neutral-200 dark:border-neutral-800">
        <MapEngine
          activeRoute={previewRoute}
          routesToCompare={dynamicRoutes}
          lastStoppedLocation={{ x: stoppedWaypoint.coords.x, y: stoppedWaypoint.coords.y, label: stoppedWaypoint.locationName }}
          rerouteMode={true}
          heightClass="h-full"
          showHeatmap={true}
          showHelpPoints={true}
          interactive={true}
          onSelectRoute={(id) => {
            const match = dynamicRoutes.find(r => r.id === id);
            if (match) setPreviewRoute(match);
          }}
          lightingStatus={conditions?.lighting.status}
          luxLevel={conditions?.lighting.luxLevel}
          disruptionLabel={conditions?.gathering.status !== 'none' ? conditions?.gathering.label : undefined}
        />

        {/* Top Overlay Controls */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          <button
            id="btn-reroute-back"
            type="button"
            onClick={() => onNavigate('live_navigation')}
            className="p-1.5 rounded-lg bg-white/95 dark:bg-black/95 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white shadow-xs cursor-pointer"
            aria-label="Back to Navigation"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="px-2.5 py-0.5 rounded-md bg-white/95 dark:bg-black/95 border border-neutral-300 dark:border-neutral-700 text-[10px] font-black text-black dark:text-white flex items-center gap-1.5 shadow-xs">
            <RotateCw className="w-3 h-3 animate-spin text-emerald-500" />
            <span>Dynamic Reroute from Last Location</span>
          </span>
          <div className="w-7" />
        </div>

        {/* Legend */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between px-2.5 py-1 rounded-lg bg-white/95 dark:bg-black/95 border border-neutral-200 dark:border-neutral-800 text-[9px] font-bold">
          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
            <span className="w-2.5 h-1 bg-red-500 rounded-full" />
            <span>Stopped Risk ({oldScore}%)</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-1 bg-emerald-500 rounded-full" />
            <span>Escape: {previewRoute.name.split('(')[0]} (+{safetyGain}%)</span>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="p-4 flex-1 space-y-3">
        {/* Stopped Origin Location Info Banner */}
        <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-black dark:text-white flex items-center justify-between text-xs shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/40 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="min-w-0 truncate">
              <span className="text-[9px] text-neutral-500 font-bold uppercase block">Reroute Origin: Stopped Location</span>
              <span className="font-black text-black dark:text-white text-xs truncate block">{stoppedWaypoint.locationName}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold font-mono">Stopped @ {stoppedWaypoint.progress}%</span>
            <span className="text-[9px] text-neutral-500 block">{stoppedWaypoint.remainingDistanceKm} km left</span>
          </div>
        </div>

        {/* Header Advisory */}
        <Card variant="subtle" padding="sm" className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
              AI Route Comparison Engine
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
              +{safetyGain}% Safety Gain
            </span>
          </div>
          <p className="text-xs font-bold text-black dark:text-white leading-relaxed">
            Due to changing conditions on your current path, SafeRoute AI evaluated 3 alternative corridors. Compare safety scores, illumination, and travel times below:
          </p>
        </Card>

        {/* Challenge 3: Why Recommendation Changed Explainability Banner */}
        <div className="p-3.5 rounded-2xl bg-linear-to-b from-emerald-950/40 via-neutral-900/60 to-neutral-950/80 border border-emerald-500/40 text-black dark:text-white space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Challenge 3: Recommendation Evolution
              </span>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Score Gain: +{safetyGain}%
            </span>
          </div>

          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
            <strong>Why Recommendation Changed:</strong> Municipal sensors recorded a sudden illumination drop to <strong>{conditions?.lighting.luxLevel ?? 16} Lux</strong> and pedestrian footfall decreased to <strong>{conditions?.pedestrian.footfallPerMin ?? 3} people/min</strong> on your active corridor. SafeRoute AI automatically reassessed alternative routes and promotes <strong>{previewRoute.name}</strong> as the optimal balance of safety ({previewRoute.safetyScore}%) and travel time ({previewRoute.time}).
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-200 dark:border-neutral-800 text-[10px]">
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500 text-[9px] font-bold block">Current Route (Compromised)</span>
              <span className="text-red-600 dark:text-red-400 font-extrabold text-xs">{oldScore}% Safety Index</span>
              <span className="text-neutral-500 text-[9px] block mt-0.5">High hazard & dark spot</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800">
              <span className="text-emerald-700 dark:text-emerald-400 text-[9px] font-bold block">New Recommendation</span>
              <span className="text-emerald-600 dark:text-emerald-300 font-extrabold text-xs">{previewRoute.safetyScore}% Safety Index</span>
              <span className="text-emerald-700 dark:text-emerald-400 text-[9px] block mt-0.5">96 Lux + 4 Safe Havens</span>
            </div>
          </div>
        </div>

        {/* Multi-Route Interactive Comparison Component */}
        <MultiRouteComparisonCard
          routes={dynamicRoutes}
          selectedRouteId={previewRoute.id}
          onSelectRoute={(r) => setPreviewRoute(r)}
          onConfirmRoute={handleConfirm}
          currentCompromisedScore={oldScore}
        />
      </div>

      {/* Sticky Bottom Switch Action Bar */}
      <div className="px-4 space-y-2">
        <Button
          id="btn-switch-route"
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => handleConfirm(previewRoute)}
          icon={<RotateCw className="w-4 h-4" />}
        >
          Switch to {previewRoute.name.split('(')[0]} ({previewRoute.safetyScore}% Index)
        </Button>

        <Button
          variant="outline"
          size="md"
          fullWidth
          onClick={() => onNavigate('live_navigation')}
        >
          Keep Current Path Anyway
        </Button>
      </div>
    </div>
  );
};
