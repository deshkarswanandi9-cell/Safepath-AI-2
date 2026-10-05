import React from 'react';
import { 
  ArrowLeft, 
  RotateCw, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { ScreenId } from '../../types';
import { MapEngine } from '../MapEngine';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface DynamicReroutingScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onConfirmReroute: () => void;
}

export const DynamicReroutingScreen: React.FC<DynamicReroutingScreenProps> = ({
  onNavigate,
  onConfirmReroute
}) => {
  return (
    <div className="relative h-full flex flex-col justify-between bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar pb-20">
      {/* Top Map Preview */}
      <div className="relative h-48 w-full shrink-0 border-b border-neutral-200 dark:border-neutral-800">
        <MapEngine
          rerouteMode={true}
          heightClass="h-full"
          showHeatmap={true}
          showHelpPoints={true}
          interactive={false}
        />
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
            <RotateCw className="w-3 h-3 animate-spin" />
            <span>Dynamic Rerouting</span>
          </span>
          <div className="w-7" />
        </div>

        {/* Legend */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between px-2.5 py-1 rounded-lg bg-white/95 dark:bg-black/95 border border-neutral-200 dark:border-neutral-800 text-[9px] font-bold">
          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
            <span className="w-2.5 h-1 bg-red-500 rounded-full" />
            <span>Old Compromised Route</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-1 bg-emerald-500 rounded-full" />
            <span>New Safe Route (+21%)</span>
          </div>
        </div>
      </div>

      {/* Main Comparison Section */}
      <div className="p-4 flex-1 space-y-3">
        {/* Recommendation Header */}
        <Card variant="subtle" padding="sm" className="space-y-1">
          <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
            AI Advisory
          </div>
          <p className="text-xs font-bold text-black dark:text-white leading-relaxed">
            A safer detour has been calculated to circumvent a reported bottleneck ahead.
          </p>
        </Card>

        {/* Comparison Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Old Route */}
          <Card variant="default" padding="sm" className="border-red-200 dark:border-red-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
                Old Route
              </span>
              <Badge variant="emergency" size="sm">
                70%
              </Badge>
            </div>
            <div className="text-[10px] text-red-600 dark:text-red-400 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>Blockade near Elm St</span>
            </div>
            <div className="text-[10px] text-neutral-500 flex items-center gap-1">
              <Clock className="w-3 h-3 shrink-0" />
              <span>ETA: 13 min</span>
            </div>
          </Card>

          {/* New Route */}
          <Card variant="default" padding="sm" className="border-emerald-300 dark:border-emerald-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                New Route
              </span>
              <Badge variant="safe" size="sm">
                91%
              </Badge>
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>Grand Blvd Corridor</span>
            </div>
            <div className="text-[10px] text-neutral-500 flex items-center gap-1">
              <Clock className="w-3 h-3 shrink-0" />
              <span>ETA: 15 min (+2m)</span>
            </div>
          </Card>
        </div>

        {/* Safety Gain Details */}
        <Card variant="default" padding="sm" className="text-[10px] text-neutral-600 dark:text-neutral-400 space-y-1">
          <div className="font-bold text-black dark:text-white flex items-center gap-1.5 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Safety Gain Breakdown</span>
          </div>
          <p className="leading-relaxed">
            Rerouting adds only 2 minutes while bypassing unlit alleys and routing directly past 2 open verified safe havens and a police kiosk.
          </p>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="px-4 space-y-2">
        <Button
          id="btn-switch-route"
          variant="primary"
          size="lg"
          fullWidth
          onClick={onConfirmReroute}
          icon={<RotateCw className="w-4 h-4" />}
        >
          Switch Route (91% Safety Index)
        </Button>

        <Button
          variant="outline"
          size="md"
          fullWidth
          onClick={() => onNavigate('live_navigation')}
        >
          Keep Current Route
        </Button>
      </div>
    </div>
  );
};
