import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  Train, 
  Compass, 
  Hospital, 
  Radio, 
  CheckCircle2, 
  Clock, 
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import { ScreenId, RouteOption } from '../../types';
import { 
  MOCK_GATHERING_INCIDENTS, 
  MOCK_TRANSIT_DISRUPTIONS, 
  MOCK_CROWD_PREDICTIONS, 
  MOCK_SAFE_EXITS, 
  MOCK_COMMUNITY_REPORTS,
  MOCK_ROUTES 
} from '../../data/mockData';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface PublicGatheringHubScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectRoute?: (route: RouteOption) => void;
}

export const PublicGatheringHubScreen: React.FC<PublicGatheringHubScreenProps> = ({
  onNavigate,
  onSelectRoute
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'metro' | 'crowd_forecast' | 'safe_exits' | 'reports'>('overview');
  const [corroboratedReports, setCorroboratedReports] = useState<Record<string, number>>({
    'cr-1': 34,
    'cr-2': 19,
    'cr-3': 26,
    'cr-4': 12
  });

  const handleCorroborate = (id: string) => {
    setCorroboratedReports(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleStartBypassRoute = () => {
    const routeD = MOCK_ROUTES.find(r => r.id === 'route_d') || MOCK_ROUTES[2];
    if (onSelectRoute) {
      onSelectRoute(routeD);
    }
    onNavigate('live_navigation');
  };

  return (
    <div className="relative h-full flex flex-col justify-between bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar p-4 pb-6">
      <div>
        {/* Header */}
        <div className="pt-1 flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Back to Dashboard"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
                Gathering & Disruption Hub
              </h1>
              <p className="text-[10px] text-neutral-500">Live civic event advisory & bypass routes</p>
            </div>
          </div>
          <Badge variant="caution" size="sm">
            Advisory Live
          </Badge>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1 mb-3 border-b border-neutral-200 dark:border-neutral-800">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'metro', label: 'Metro Status' },
            { id: 'crowd_forecast', label: 'Crowd Waves' },
            { id: 'safe_exits', label: 'Safe Exits' },
            { id: 'reports', label: 'Feed' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-neutral-500 hover:text-black dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            {/* Bypass CTA Card */}
            <Card variant="default" padding="sm" className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  Recommended Detour
                </span>
                <Badge variant="safe" size="sm">
                  97% Safety Index
                </Badge>
              </div>
              <h3 className="text-xs font-black text-black dark:text-white">
                Route D (Bypass Central Blockade)
              </h3>
              <p className="text-[10px] text-neutral-500 leading-relaxed">
                Routes around closed intersections via Baba Kharak Singh Marg. Continuous 100-lux smart lighting and open Janpath Metro access.
              </p>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={handleStartBypassRoute}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Activate Bypass Route D
              </Button>
            </Card>

            {/* Active Civic Incidents */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
                Active Civic Advisories
              </span>
              {MOCK_GATHERING_INCIDENTS.map((inc) => (
                <Card key={inc.id} variant="default" padding="sm" className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-black dark:text-white">{inc.title}</h4>
                    <Badge variant={inc.severity === 'critical' || inc.severity === 'high' ? 'emergency' : 'caution'} size="sm">
                      {inc.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-[10px] text-neutral-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Reported {inc.reportedAt} • {inc.locationName}</span>
                  </div>
                  <p className="text-[10px] text-neutral-600 dark:text-neutral-400 leading-relaxed pt-1">
                    {inc.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Metro Status */}
        {activeTab === 'metro' && (
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
              Station & Gate Disruptions
            </span>
            {MOCK_TRANSIT_DISRUPTIONS.map((td) => (
              <Card key={td.id} variant="default" padding="sm" className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Train className="w-3.5 h-3.5 text-black dark:text-white" />
                    <h4 className="text-xs font-bold text-black dark:text-white">{td.stationName}</h4>
                  </div>
                  <Badge variant={td.status === 'Open' ? 'safe' : 'caution'} size="sm">
                    {td.status}
                  </Badge>
                </div>
                <p className="text-[10px] text-neutral-500 leading-relaxed">
                  {td.advisoryNote}
                </p>
                <div className="text-[10px] text-neutral-700 dark:text-neutral-300 font-bold pt-1 border-t border-neutral-200 dark:border-neutral-800">
                  Alternative: {td.recommendedAlternative} (+{td.extraWalkMins}m walk)
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 3: Crowd Predictions */}
        {activeTab === 'crowd_forecast' && (
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
              15–30 Min Crowd Forecast
            </span>
            {MOCK_CROWD_PREDICTIONS.map((cp) => (
              <Card key={cp.id} variant="default" padding="sm" className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-black dark:text-white">{cp.areaName}</h4>
                  <Badge variant={cp.surgeRisk === 'Low' ? 'safe' : 'caution'} size="sm">
                    {cp.surgeRisk} Surge Risk
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center pt-1">
                  <div className="p-1 rounded bg-neutral-100 dark:bg-neutral-900">
                    <div className="text-[9px] text-neutral-400 font-bold">Current Density</div>
                    <div className="text-xs font-black text-black dark:text-white">{cp.currentDensity}%</div>
                  </div>
                  <div className="p-1 rounded bg-neutral-100 dark:bg-neutral-900">
                    <div className="text-[9px] text-neutral-400 font-bold">Forecast Density</div>
                    <div className="text-xs font-black text-black dark:text-white">{cp.forecastedDensity}%</div>
                  </div>
                </div>
                <p className="text-[10px] text-neutral-500 pt-1">
                  Bottleneck: {cp.bottleneckLocation}
                </p>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 4: Safe Exits */}
        {activeTab === 'safe_exits' && (
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
              Unobstructed Emergency Exits
            </span>
            {MOCK_SAFE_EXITS.map((se) => (
              <Card key={se.id} variant="default" padding="sm" className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-black dark:text-white">{se.name}</h4>
                  <Badge variant="safe" size="sm">
                    {se.status}
                  </Badge>
                </div>
                <div className="text-[10px] text-neutral-500">
                  Distance: {se.distance} • Walk: {se.eta} • Flow: {se.crowdCongestion}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 5: Community Reports Feed */}
        {activeTab === 'reports' && (
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
              Verified Community Telemetry
            </span>
            {MOCK_COMMUNITY_REPORTS.map((cr) => (
              <Card key={cr.id} variant="default" padding="sm" className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-black dark:text-white">{cr.title}</h4>
                  <span className="text-[10px] text-neutral-400">{cr.timestamp}</span>
                </div>
                <p className="text-[10px] text-neutral-500">{cr.location}</p>
                <div className="pt-1 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500">
                    {corroboratedReports[cr.id] || cr.corroborations} confirmations
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCorroborate(cr.id)}
                    className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] font-bold text-black dark:text-white hover:border-black dark:hover:border-white transition-colors cursor-pointer"
                  >
                    +1 Confirm
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
