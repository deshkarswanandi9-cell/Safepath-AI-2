import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  ArrowRight, 
  SlidersHorizontal,
  Compass,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { ScreenId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Input } from '../ui/Input';
import { Switch } from '../ui/Switch';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

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
  const [publicGatheringMode, setPublicGatheringMode] = useState(true);
  const [medicalCorridorPriority, setMedicalCorridorPriority] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsCalculating(true);
    setTimeout(() => {
      onGenerateRoutes();
      onNavigate('route_comparison');
    }, 450);
  };

  const handleQuickDest = (dest: string) => {
    setDestination(dest);
    setIsCalculating(true);
    setTimeout(() => {
      onGenerateRoutes();
      onNavigate('route_comparison');
    }, 350);
  };

  return (
    <div className="relative h-full flex flex-col justify-between bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar p-4 pb-20">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pt-1 mb-3">
          <div className="flex items-center gap-2">
            <button
              id="btn-search-back"
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
                {t.routePlanner}
              </h2>
              <p className="text-[10px] text-neutral-500">18 safety telemetry parameters</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] font-black">
            AI Core
          </span>
        </div>

        {/* Origin and Destination Card */}
        <Card variant="default" padding="sm" className="mb-3 space-y-2.5 shadow-xs">
          <Input
            id="input-route-from"
            label={t.fromLabel}
            type="text"
            value={fromLoc}
            onChange={(e) => setFromLoc(e.target.value)}
            icon={<Navigation className="w-3.5 h-3.5" />}
          />

          <Input
            id="input-route-to"
            label={t.toLabel}
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            icon={<MapPin className="w-3.5 h-3.5" />}
          />
        </Card>

        {/* Quick Recent Saved Destinations */}
        <div className="mb-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5 block">
            Recent Destinations
          </span>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {[
              'Westwood Residence, 88 Parkview',
              'Connaught Place Metro Gate 6',
              'South Campus Library, Arts Block',
              'City General Hospital Emergency'
            ].map((dest, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickDest(dest)}
                className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 hover:border-black dark:hover:border-white border border-neutral-200 dark:border-neutral-800 text-[10px] font-bold text-neutral-700 dark:text-neutral-300 whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {dest}
              </button>
            ))}
          </div>
        </div>

        {/* Safety Preferences & Toggles */}
        <Card variant="default" padding="sm" className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
              Navigation Constraints
            </span>
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
          </div>

          <Switch
            id="toggle-safety"
            label={t.prioritizeSafety}
            description="Maximizes street lighting & open commercial corridors"
            checked={prioritizeSafety}
            onChange={setPrioritizeSafety}
          />

          <Switch
            id="toggle-isolated"
            label={t.avoidIsolated}
            description="Restricts routes passing unmonitored alleys"
            checked={avoidIsolated}
            onChange={setAvoidIsolated}
          />

          <Switch
            id="toggle-transit"
            label={t.preferPublic}
            description="Aligns trajectory with operational metro & transit"
            checked={preferPublicTransit}
            onChange={setPreferPublicTransit}
          />

          <Switch
            id="toggle-gathering"
            label="Gathering & Blockade Bypass"
            description="Proactively routes around civic assemblies"
            checked={publicGatheringMode}
            onChange={setPublicGatheringMode}
          />

          <Switch
            id="toggle-medical"
            label="Medical Corridor Access"
            description="Maintains priority access to hospital emergency ramps"
            checked={medicalCorridorPriority}
            onChange={setMedicalCorridorPriority}
          />
        </Card>
      </div>

      {/* Primary CTA */}
      <div className="mt-4 pt-1">
        <Button
          id="btn-generate-routes"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isCalculating}
          onClick={handleGenerate}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          {isCalculating ? 'Evaluating 18 Safety Parameters...' : 'Generate Evaluated Routes'}
        </Button>
      </div>
    </div>
  );
};
