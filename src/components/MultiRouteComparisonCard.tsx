import React, { useState } from 'react';
import { 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Lightbulb, 
  LightbulbOff, 
  Users, 
  Shield, 
  CheckCircle2, 
  Check, 
  X, 
  ArrowRight, 
  SlidersHorizontal, 
  Sparkles,
  RotateCw,
  TrendingUp,
  MapPin,
  Building2,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { RouteOption } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface MultiRouteComparisonCardProps {
  routes: RouteOption[];
  selectedRouteId: string;
  onSelectRoute: (route: RouteOption) => void;
  onConfirmRoute: (route: RouteOption) => void;
  currentCompromisedScore?: number;
  compact?: boolean;
}

export const MultiRouteComparisonCard: React.FC<MultiRouteComparisonCardProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  onConfirmRoute,
  currentCompromisedScore,
  compact = false
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');
  const [filterPriority, setFilterPriority] = useState<'all' | 'safety' | 'time'>('all');
  const shouldReduceMotion = useReducedMotion();

  const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  // Filter routes based on user preference
  const filteredRoutes = [...routes].sort((a, b) => {
    if (filterPriority === 'safety') return b.safetyScore - a.safetyScore;
    if (filterPriority === 'time') {
      const timeA = parseInt(a.time.replace(/[^\d]/g, ''), 10) || 0;
      const timeB = parseInt(b.time.replace(/[^\d]/g, ''), 10) || 0;
      return timeA - timeB;
    }
    return 0;
  });

  return (
    <div className="w-full space-y-3 font-sans select-none">
      {/* View Mode & Filter Switcher */}
      <div className="flex items-center justify-between gap-2 px-1">
        {/* Priority Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setFilterPriority('all')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
              filterPriority === 'all'
                ? 'bg-black text-white dark:bg-white dark:text-black font-black'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800'
            }`}
          >
            All Alternatives ({routes.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterPriority('safety')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              filterPriority === 'safety'
                ? 'bg-emerald-600 text-white font-black'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Highest Safety</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterPriority('time')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              filterPriority === 'time'
                ? 'bg-amber-600 text-white font-black'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Fastest ETA</span>
          </button>
        </div>

        {/* View Mode Toggle (Cards vs Matrix) */}
        <div className="inline-flex rounded-lg border border-neutral-200 dark:border-neutral-800 p-0.5 bg-neutral-100 dark:bg-neutral-900 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs font-black'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Cards
          </button>
          <button
            type="button"
            onClick={() => setViewMode('matrix')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
              viewMode === 'matrix'
                ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs font-black'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Trade-offs
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE CARDS LIST */}
      {viewMode === 'cards' && (
        <div className="space-y-2">
          {filteredRoutes.map((r) => {
            const isSelected = selectedRouteId === r.id;
            const isCompromised = r.routeType === 'fastest_compromised' || r.safetyScore < 60;
            const isRec = r.isRecommended || r.routeType === 'max_safety';

            // Safety Gain relative to compromised route
            const baselineCompromised = currentCompromisedScore || 54;
            const safetyDelta = r.safetyScore - baselineCompromised;

            return (
              <motion.div
                key={r.id}
                whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                onClick={() => onSelectRoute(r)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-50 dark:bg-neutral-900/90 border-black dark:border-white shadow-md ring-1 ring-black dark:ring-white'
                    : 'bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
              >
                {/* Card Top Line */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    {/* Color dot / radio */}
                    <div 
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                      style={{ borderColor: r.color }}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-black text-black dark:text-white truncate">
                          {r.name}
                        </h4>
                        {isRec && (
                          <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[8px] font-black rounded shrink-0 uppercase tracking-wider">
                            Recommended
                          </span>
                        )}
                        {isCompromised && (
                          <span className="px-1.5 py-0.2 bg-red-600 text-white text-[8px] font-black rounded shrink-0 uppercase tracking-wider">
                            Compromised
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="font-bold flex items-center gap-1 text-black dark:text-white">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          {r.time} ({r.distance})
                        </span>
                        <span>•</span>
                        <span className="truncate">{r.tagline}</span>
                      </div>
                    </div>
                  </div>

                  {/* Safety Score Badge */}
                  <div className="flex flex-col items-end shrink-0">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-black ${
                      r.safetyScore >= 85
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : r.safetyScore >= 70
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800'
                    }`}>
                      {r.safetyScore}%
                    </span>
                    {safetyDelta > 0 && (
                      <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        +{safetyDelta}% gain
                      </span>
                    )}
                  </div>
                </div>

                {/* 5-Factor Feature Strip */}
                <div className="grid grid-cols-4 gap-1 mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-850 text-[9px]">
                  <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                    <Lightbulb className={`w-3 h-3 ${r.lightingScore > 80 ? 'text-amber-500' : 'text-neutral-400'}`} />
                    <span className="font-bold truncate">{r.lightingScore} Lux</span>
                  </div>
                  <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                    <Users className="w-3 h-3 text-blue-500" />
                    <span className="font-bold truncate">{r.crowdDensity} Footfall</span>
                  </div>
                  <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                    <Shield className="w-3 h-3 text-emerald-500" />
                    <span className="font-bold truncate">{r.safeHavenCount ?? 1} Havens</span>
                  </div>
                  <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                    <CheckCircle2 className={`w-3 h-3 ${r.protestBypass ? 'text-emerald-500' : 'text-neutral-400'}`} />
                    <span className="font-bold truncate">{r.protestBypass ? 'No Blockade' : 'Direct'}</span>
                  </div>
                </div>

                {/* Expanded Pros & Cons if Selected */}
                {isSelected && (
                  <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                    animate={shouldReduceMotion ? false : { opacity: 1, height: 'auto' }}
                    className="mt-2.5 pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-1.5"
                  >
                    {/* Advantages */}
                    {r.pros && r.pros.length > 0 && (
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          Advantages:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {r.pros.map((p, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium">
                              ✓ {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trade-offs */}
                    {r.cons && r.cons.length > 0 && (
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          Trade-offs:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {r.cons.map((c, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-medium">
                              ⚠ {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: DIRECT MULTI-ROUTE TRADE-OFF MATRIX TABLE */}
      {viewMode === 'matrix' && (
        <div className="rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black overflow-hidden shadow-sm">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-[9px] uppercase font-black tracking-wider text-neutral-500">
                  <th className="p-2.5">Route Option</th>
                  <th className="p-2.5 text-center">Safety Score</th>
                  <th className="p-2.5 text-center">Travel Time</th>
                  <th className="p-2.5 text-center">Lighting</th>
                  <th className="p-2.5 text-center">Footfall</th>
                  <th className="p-2.5 text-center">Safe Havens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-[10px]">
                {filteredRoutes.map((r) => {
                  const isSelected = selectedRouteId === r.id;
                  return (
                    <tr
                      key={r.id}
                      onClick={() => onSelectRoute(r)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-neutral-100/80 dark:bg-neutral-900/80 font-bold'
                          : 'hover:bg-neutral-50 dark:hover:bg-neutral-950'
                      }`}
                    >
                      <td className="p-2.5 font-bold">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                          <span className="truncate max-w-[110px]">{r.name.split('(')[0]}</span>
                        </div>
                      </td>
                      <td className="p-2.5 text-center font-black">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          r.safetyScore >= 85 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950' : r.safetyScore >= 70 ? 'text-amber-600 bg-amber-50 dark:bg-amber-950' : 'text-red-600 bg-red-50 dark:bg-red-950'
                        }`}>
                          {r.safetyScore}%
                        </span>
                      </td>
                      <td className="p-2.5 text-center font-bold">{r.time}</td>
                      <td className="p-2.5 text-center">{r.lightingScore} Lux</td>
                      <td className="p-2.5 text-center">{r.crowdDensity}</td>
                      <td className="p-2.5 text-center">{r.safeHavenCount ?? 1} 24/7</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Active Selected Route Action Bar */}
      <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="text-[9px] uppercase font-black tracking-wider text-neutral-500 block">
            Selected Alternative
          </span>
          <span className="text-xs font-black text-black dark:text-white truncate block">
            {activeRoute.name} ({activeRoute.safetyScore}% Safe • {activeRoute.time})
          </span>
        </div>

        <Button
          id="btn-confirm-selected-route"
          variant="primary"
          size="md"
          onClick={() => onConfirmRoute(activeRoute)}
          icon={<Navigation className="w-3.5 h-3.5" />}
          className="shrink-0"
        >
          Confirm Route
        </Button>
      </div>
    </div>
  );
};
