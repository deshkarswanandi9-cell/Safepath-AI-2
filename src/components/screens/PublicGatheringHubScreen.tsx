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
  Share2, 
  Eye, 
  Zap, 
  ArrowRight, 
  TrendingUp, 
  Flame, 
  Sliders, 
  WifiOff, 
  ShieldCheck, 
  ChevronRight, 
  Info, 
  Activity,
  PhoneCall,
  Sparkles,
  MapPin,
  ExternalLink
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
import { useLanguage } from '../../context/LanguageContext';
import { MapEngine } from '../MapEngine';

interface PublicGatheringHubScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectRoute?: (route: RouteOption) => void;
}

export const PublicGatheringHubScreen: React.FC<PublicGatheringHubScreenProps> = ({
  onNavigate,
  onSelectRoute
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'metro' | 'crowd_forecast' | 'safe_exits' | 'reports'>('overview');
  const [gatheringModeActive, setGatheringModeActive] = useState<boolean>(true);
  const [journalistMode, setJournalistMode] = useState<boolean>(false);
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
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
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-y-auto pb-24 text-slate-900 select-none">
      {/* Top Banner Header with Status Pulse */}
      <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md text-white px-4 pt-3 pb-3 border-b border-slate-800 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="p-1.5 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1">
                  Public Gathering & Disruption Hub
                </h1>
              </div>
              <p className="text-[10px] text-slate-400">
                Live Central Delhi Event Advisory & Safe Corridor Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setOfflineMode(!offlineMode)}
              className={`px-2 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 transition ${
                offlineMode 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              <WifiOff className="w-3 h-3" />
              {offlineMode ? 'Cached Map Active' : 'Live Data'}
            </button>
          </div>
        </div>

        {/* Dynamic Mode Switches */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setGatheringModeActive(!gatheringModeActive)}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              gatheringModeActive 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                : 'bg-slate-800/60 text-slate-400 border border-slate-700'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              Gathering Mode
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${gatheringModeActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-400'}`}>
              {gatheringModeActive ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            onClick={() => setJournalistMode(!journalistMode)}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              journalistMode 
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' 
                : 'bg-slate-800/60 text-slate-400 border border-slate-700'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Journalist/Solo Mode
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${journalistMode ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
              {journalistMode ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-1 mt-3 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'overview', label: 'Overview', icon: Compass },
            { id: 'metro', label: 'Metro Tracker', icon: Train },
            { id: 'crowd_forecast', label: 'Surge Forecast', icon: TrendingUp },
            { id: 'safe_exits', label: 'Safe Exits', icon: ArrowRight },
            { id: 'reports', label: 'Verified Feed', icon: CheckCircle2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3 h-3" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Embedded Live Map Section with Event Overlays */}
      <div className="relative w-full h-[220px] bg-slate-200 border-b border-slate-300">
        <MapEngine
          activeRoute={MOCK_ROUTES[3]}
          selectedRouteId="route_d"
          showHeatmap={true}
          showHelpPoints={true}
          heightClass="h-full"
          userProgress={30}
        />

        {/* Floating Mini Overlay Pill */}
        <div className="absolute top-2 left-2 z-20 bg-slate-900/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-2 border border-slate-700 shadow-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="font-semibold text-cyan-300">Route D: Safe Gathering Bypass (97% Safe)</span>
        </div>

        <button
          onClick={handleStartBypassRoute}
          className="absolute bottom-2 right-2 z-20 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition"
        >
          <Zap className="w-3.5 h-3.5" />
          Navigate Bypass
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="p-4 space-y-4">
        {/* TAB 1: OVERVIEW & ACTIVE INCIDENTS */}
        {activeTab === 'overview' && (
          <>
            {/* Urgent Advisory Card */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3.5 shadow-sm">
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold text-amber-900">
                      Active Demonstration & Road Diversion Alert
                    </h2>
                    <span className="text-[10px] font-semibold bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded">
                      Live Notice
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                    Peaceful public assembly along Janpath & Jantar Mantar. Traffic Police have initiated diversions at Ashoka Rd. Safe transit corridors and medical access avenues remain fully operational.
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-amber-900 font-medium">
                    <span>⏱️ Updated 3m ago</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">✓ Verified by Police Feed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Adaptive Routing Action Card */}
            <div className="bg-slate-900 text-white rounded-xl p-4 shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Recommended Adaptive Action
                  </h3>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  +39% Safer
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                Take <strong className="text-cyan-300">Route D (Gathering Bypass)</strong> via Baba Kharak Singh Marg. Completely avoids barricaded intersections while keeping you inside 100-lux illuminated avenues.
              </p>

              <div className="grid grid-cols-3 gap-2 py-2 border-t border-slate-800 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">ETA</div>
                  <div className="font-bold text-slate-100">19 mins</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Barricades</div>
                  <div className="font-bold text-emerald-400">0 Ahead</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Safety Index</div>
                  <div className="font-bold text-cyan-400">97% Max</div>
                </div>
              </div>

              <button
                onClick={handleStartBypassRoute}
                className="w-full mt-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2 shadow-md transition"
              >
                Start Guided Bypass Commute
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Active Incident List */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Verified Gathering Incidents & Corridors</span>
                <span className="text-[10px] text-slate-400 lowercase font-normal">{MOCK_GATHERING_INCIDENTS.length} active</span>
              </h3>

              <div className="space-y-2.5">
                {MOCK_GATHERING_INCIDENTS.map((inc) => (
                  <div 
                    key={inc.id}
                    className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:border-slate-300 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-lg text-white ${
                          inc.category === 'medical_corridor' 
                            ? 'bg-emerald-600' 
                            : inc.severity === 'high' 
                            ? 'bg-rose-600' 
                            : 'bg-amber-600'
                        }`}>
                          {inc.category === 'medical_corridor' ? <Hospital className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{inc.title}</h4>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" />
                            {inc.locationName}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inc.severity === 'high' 
                          ? 'bg-rose-100 text-rose-800' 
                          : inc.severity === 'moderate' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {inc.severity.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                      {inc.description}
                    </p>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          {inc.verificationStatus.replace('_', ' ').toUpperCase()}
                        </span>
                        <span>•</span>
                        <span>{inc.corroborationCount} confirmations</span>
                      </div>
                      <span>Expires in {inc.expiresInMinutes}m</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: LIVE METRO & TRANSIT DISRUPTIONS */}
        {activeTab === 'metro' && (
          <div className="space-y-3">
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-start gap-2.5">
              <Train className="w-4 h-4 text-indigo-700 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-indigo-900">Delhi Metro Public Gathering Advisory</h3>
                <p className="text-[11px] text-indigo-800 mt-0.5">
                  Interchange hubs remain active with crowd marshals. Specific perimeter gates are restricted to manage surge flows safely.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {MOCK_TRANSIT_DISRUPTIONS.map((td) => (
                <div key={td.id} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: td.lineColor }}></span>
                        <h4 className="text-xs font-bold text-slate-900">{td.stationName}</h4>
                      </div>
                      <span className="text-[10px] text-slate-500">{td.line}</span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      td.status === 'Open' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : td.status === 'Partial Closure' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {td.status}
                    </span>
                  </div>

                  {/* Gate Status Pill Badges */}
                  <div className="flex flex-wrap gap-1.5 my-2">
                    {td.affectedGates.map((gate, i) => (
                      <span 
                        key={i} 
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          gate.includes('Closed')
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : gate.includes('Exit Only') || gate.includes('Hold')
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {gate}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-600 my-2 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                    💡 {td.advisoryNote}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500 text-[10px]">
                      Alt: <strong className="text-slate-800">{td.recommendedAlternative}</strong>
                    </span>
                    {td.extraWalkMins > 0 && (
                      <span className="text-amber-700 font-semibold text-[10px]">
                        +{td.extraWalkMins} min walk
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: 15-30 MIN PREDICTIVE CROWD SURGE & BOTTLE-NECK FORECASTER */}
        {activeTab === 'crowd_forecast' && (
          <div className="space-y-3">
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-start gap-2.5">
              <TrendingUp className="w-4 h-4 text-purple-700 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-purple-900">AI Predictive Crowd Surge Forecaster</h3>
                <p className="text-[11px] text-purple-800 mt-0.5">
                  Estimates short-term congestion shifts over the next 15–30 minutes based on historical event dispersal patterns and live footfall sensors.
                </p>
              </div>
            </div>

            {MOCK_CROWD_PREDICTIONS.map((csp) => (
              <div key={csp.id} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{csp.areaName}</h4>
                    <span className="text-[10px] text-slate-500">
                      Forecast Horizon: Next {csp.horizonMinutes} mins
                    </span>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      csp.surgeRisk === 'High' 
                        ? 'bg-rose-100 text-rose-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {csp.surgeRisk} Surge Risk
                    </span>
                    <div className="text-[9px] text-slate-400 mt-0.5">
                      {csp.confidenceScore}% Model Confidence
                    </div>
                  </div>
                </div>

                {/* Surge Meter Progress Comparison */}
                <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Current Density: <strong>{csp.currentDensity}%</strong></span>
                    <span className="text-purple-700 font-bold">Predicted (in {csp.horizonMinutes}m): <strong>{csp.forecastedDensity}%</strong></span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-slate-400 h-full transition-all" 
                      style={{ width: `${csp.currentDensity}%` }}
                    />
                    <div 
                      className={`h-full transition-all ${csp.forecastedDensity > csp.currentDensity ? 'bg-purple-600' : 'bg-emerald-500'}`} 
                      style={{ width: `${Math.abs(csp.forecastedDensity - csp.currentDensity)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-600 pt-1">
                    ⚠️ <strong>Identified Bottleneck:</strong> {csp.bottleneckLocation}
                  </div>
                </div>

                {/* SHAP Factor Weights Breakdown */}
                <div>
                  <h5 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    SHAP Factor Contributions
                  </h5>
                  <div className="space-y-1">
                    {csp.contributingFactors.map((cf, i) => (
                      <div key={i} className="flex items-center justify-between text-[10px] py-0.5">
                        <span className="text-slate-700">{cf.factor}</span>
                        <span className={`font-bold ${cf.impact === 'increase' ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {cf.weight > 0 ? `+${cf.weight}%` : `${cf.weight}%`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: AI SAFE EXITS & EVACUATION PATHFINDER */}
        {activeTab === 'safe_exits' && (
          <div className="space-y-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-emerald-900">Emergency Safe Exits & Evacuation Corridors</h3>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Verified unobstructed avenues and designated safe civilian shelters with clear police and medical access.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {MOCK_SAFE_EXITS.map((exit) => (
                <div key={exit.id} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex items-center justify-between hover:border-slate-300 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="p-1 bg-emerald-100 text-emerald-700 rounded">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{exit.name}</h4>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span>📏 {exit.distance}</span>
                      <span>⏱️ {exit.eta}</span>
                      <span className="font-semibold text-emerald-600">✓ {exit.status}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleStartBypassRoute}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition active:scale-95"
                  >
                    Exit Path
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: VERIFIED COMMUNITY FEED & CORROBORATIONS */}
        {activeTab === 'reports' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Live Corroborated Reports
              </h3>
              <button 
                onClick={() => onNavigate('safety_analytics')}
                className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
              >
                + Submit Report
              </button>
            </div>

            <div className="space-y-2.5">
              {MOCK_COMMUNITY_REPORTS.map((rep) => {
                const count = corroboratedReports[rep.id] || rep.corroborations;
                return (
                  <div key={rep.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{rep.title}</h4>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5" />
                          {rep.location} • <Clock className="w-2.5 h-2.5 ml-1" /> {rep.timestamp}
                        </p>
                      </div>

                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        rep.status === 'verified_official'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {rep.status === 'verified_official' ? 'Official' : 'Corroborated'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                      <span className="text-slate-500 font-medium">
                        👥 <strong>{count}</strong> commuters confirmed
                      </span>

                      <button
                        onClick={() => handleCorroborate(rep.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded text-[10px] font-bold transition flex items-center gap-1 active:scale-95"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Confirm (+1)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
