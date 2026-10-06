import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BarChart2, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle,
  Clock,
  ShieldAlert,
  MapPin,
  Flame,
  Activity
} from 'lucide-react';
import { ScreenId } from '../../types';
import { ANALYTICS_DATA } from '../../data/mockData';
import { 
  REAL_CRIME_STATS_DELHI_2024, 
  REAL_DELHI_AREA_SAFETY, 
  DELHI_SAFETY_INITIATIVES, 
  REAL_DELHI_DARK_SPOTS 
} from '../../data/realData';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface SafetyAnalyticsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const SafetyAnalyticsScreen: React.FC<SafetyAnalyticsScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'official_delhi'>('personal');
  const [activeRange, setActiveRange] = useState<'week' | 'month'>('week');
  const trendScores = ANALYTICS_DATA.trendScores;

  const linePoints = trendScores
    .map((item, idx) => {
      const x = 25 + idx * 46;
      const y = 130 - ((item.score - 60) / 40) * 90;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="relative h-full flex flex-col justify-between bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar p-4 pb-20">
      <div>
        {/* Header */}
        <div className="pt-1 flex items-center justify-between mb-3">
          <button
            id="btn-analytics-back"
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          {/* Main Top Tab Switcher */}
          <div className="bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded-lg flex text-[10px] font-bold border border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setActiveTab('personal')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                activeTab === 'personal'
                  ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs font-black'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              My Telemetry
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('official_delhi')}
              className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'official_delhi'
                  ? 'bg-red-600 text-white shadow-xs font-black'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3 h-3" />
              <span>NCRB Delhi 2024</span>
            </button>
          </div>

          {/* Time range switcher */}
          <div className="bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded-lg flex text-[10px] font-bold border border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setActiveRange('week')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activeRange === 'week'
                  ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              7D
            </button>
            <button
              type="button"
              onClick={() => setActiveRange('month')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activeRange === 'month'
                  ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              30D
            </button>
          </div>
        </div>

        {activeTab === 'personal' ? (
          <>
            {/* Title */}
            <div className="mb-3">
              <h1 className="text-base font-black tracking-tight text-black dark:text-white">
                Safety Analytics
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Aggregated historical risk telemetry from your night journeys.
              </p>
            </div>

            {/* AI Insight Card */}
            <Card variant="subtle" padding="sm" className="mb-3 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-neutral-500">
                <Sparkles className="w-3.5 h-3.5 text-black dark:text-white" />
                <span>AI Risk Intelligence</span>
              </div>
              <p className="text-xs font-bold text-black dark:text-white leading-relaxed">
                “Most reported risks occurred in poorly lit areas after 10 PM.”
              </p>
              <p className="text-[10px] text-neutral-500">
                Recommendation: Prioritize Metro transit corridors past 10 PM.
              </p>
            </Card>

            {/* Trend Graph Card */}
            <Card variant="default" padding="sm" className="mb-3 space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  Weekly Safety Index (%)
                </span>
                <Badge variant="safe" size="sm">
                  Avg: 91%
                </Badge>
              </div>

              {/* SVG Trend Line */}
              <div className="w-full h-36 relative">
                <svg viewBox="0 0 320 140" className="w-full h-full">
                  {/* Grid Lines */}
                  <line x1="20" y1="20" x2="310" y2="20" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" strokeDasharray="3 3" />
                  <line x1="20" y1="65" x2="310" y2="65" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" strokeDasharray="3 3" />
                  <line x1="20" y1="110" x2="310" y2="110" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" strokeDasharray="3 3" />

                  {/* Line path */}
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    className="text-black dark:text-white"
                    strokeWidth="2.5"
                    points={linePoints}
                  />

                  {/* Data points */}
                  {trendScores.map((item, idx) => {
                    const x = 25 + idx * 46;
                    const y = 130 - ((item.score - 60) / 40) * 90;
                    return (
                      <g key={idx}>
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          className="fill-white dark:fill-black stroke-black dark:stroke-white"
                          strokeWidth="2"
                        />
                        <text
                          x={x}
                          y={136}
                          textAnchor="middle"
                          className="text-[9px] font-bold fill-neutral-400"
                        >
                          {item.time}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </Card>

            {/* Risk Factors Breakdown Cards */}
            <div className="grid grid-cols-2 gap-2">
              <Card variant="default" padding="sm">
                <div className="text-[9px] font-bold text-neutral-400 uppercase">Lighting Index</div>
                <div className="text-base font-black text-black dark:text-white mt-0.5">96% Lux</div>
                <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">✓ High illumination</div>
              </Card>

              <Card variant="default" padding="sm">
                <div className="text-[9px] font-bold text-neutral-400 uppercase">Police Presence</div>
                <div className="text-base font-black text-black dark:text-white mt-0.5">14 Patrols</div>
                <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">✓ Active verification</div>
              </Card>
            </div>
          </>
        ) : (
          /* ======================================================= */
          /* OFFICIAL NCRB 2024 & DELHI PUBLIC SAFETY DATASET VIEW  */
          /* ======================================================= */
          <div className="space-y-3">
            {/* Header info banner */}
            <Card variant="default" padding="sm" className="space-y-2 bg-neutral-900 text-white border-neutral-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-white">
                      NCRB 2024 Delhi Metropolitan Crime Report
                    </h2>
                    <p className="text-[9px] text-neutral-400">
                      Ministry of Home Affairs — Official Public Safety Benchmark
                    </p>
                  </div>
                </div>
                <Badge variant="danger" size="sm">
                  Metros #1
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-neutral-800">
                <div className="p-2 rounded-lg bg-neutral-800/60 text-center">
                  <div className="text-sm font-black text-red-400 leading-tight">
                    {REAL_CRIME_STATS_DELHI_2024.totalCrimesAgainstWomen.toLocaleString()}
                  </div>
                  <div className="text-[8px] text-neutral-400 font-bold mt-0.5">Crimes (Women)</div>
                </div>
                <div className="p-2 rounded-lg bg-neutral-800/60 text-center">
                  <div className="text-sm font-black text-amber-400 leading-tight">
                    {REAL_CRIME_STATS_DELHI_2024.crimeRatePer1LakhFemale}
                  </div>
                  <div className="text-[8px] text-neutral-400 font-bold mt-0.5">Rate / 100k Women</div>
                </div>
                <div className="p-2 rounded-lg bg-neutral-800/60 text-center">
                  <div className="text-sm font-black text-emerald-400 leading-tight">35</div>
                  <div className="text-[8px] text-neutral-400 font-bold mt-0.5">Pink Force Units</div>
                </div>
              </div>
            </Card>

            {/* Crime Category Breakdown (Official Data) */}
            <Card variant="default" padding="sm" className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="text-xs font-black text-black dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-red-600" />
                  <span>Reported Incidents Breakdown (2024)</span>
                </h3>
                <span className="text-[9px] text-neutral-500 font-bold">Delhi Police Record</span>
              </div>

              <div className="space-y-1.5">
                {[
                  { label: 'Cruelty & Domestic Infringements', count: REAL_CRIME_STATS_DELHI_2024.crueltyByHusband, color: 'bg-red-500' },
                  { label: 'Kidnapping & Abduction', count: REAL_CRIME_STATS_DELHI_2024.kidnappingAbduction, color: 'bg-amber-500' },
                  { label: 'Sexual Assault & Rape', count: REAL_CRIME_STATS_DELHI_2024.rapeCase, color: 'bg-rose-600' },
                  { label: 'Public Assault & Modesty Infringement', count: REAL_CRIME_STATS_DELHI_2024.assaultOutrageModesty, color: 'bg-purple-600' },
                  { label: 'Public Sexual Harassment (Section 509)', count: REAL_CRIME_STATS_DELHI_2024.sexualHarassment, color: 'bg-indigo-600' },
                  { label: 'Stalking & Cyber Harassment (Section 354D)', count: REAL_CRIME_STATS_DELHI_2024.stalking, color: 'bg-blue-600' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-neutral-700 dark:text-neutral-300">
                      <span>{item.label}</span>
                      <span className="font-black text-black dark:text-white">{item.count.toLocaleString()} cases</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${Math.min(100, (item.count / 4647) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Real Delhi Areas Night Safety Index */}
            <Card variant="default" padding="sm" className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="text-xs font-black text-black dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Delhi Hotspots Night Safety</span>
                </h3>
                <span className="text-[9px] text-neutral-500 font-bold">Safe City Survey</span>
              </div>

              <div className="space-y-2">
                {REAL_DELHI_AREA_SAFETY.map((area) => (
                  <div
                    key={area.id}
                    className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-extrabold text-xs text-black dark:text-white">{area.name}</div>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                        area.safetyScore >= 80 
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : area.safetyScore >= 60
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                          : 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/30'
                      }`}>
                        {area.safetyScore}/100 Safety
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 text-[9px] text-neutral-600 dark:text-neutral-400 font-medium">
                      <div>💡 Light: <strong>{area.lightingScore}%</strong></div>
                      <div>📹 CCTV: <strong>{area.cctvDensity}</strong></div>
                      <div>👮 Police: <strong>{area.policePresence}</strong></div>
                    </div>

                    <p className="text-[9px] text-neutral-500 italic">
                      {area.note}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* NDMC & Police Verified Dark Spots Audit */}
            <Card variant="default" padding="sm" className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>NDMC & Police Dark Spots</span>
                </h3>
                <Badge variant="danger" size="sm">
                  Under Audit
                </Badge>
              </div>

              <div className="space-y-1.5">
                {REAL_DELHI_DARK_SPOTS.map((ds) => (
                  <div key={ds.id} className="p-2 rounded-lg bg-red-500/5 border border-red-500/20 text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-black dark:text-white">{ds.name}</span>
                      <span className="text-[8px] font-black text-red-600 dark:text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/30">
                        {ds.riskLevel} Risk
                      </span>
                    </div>
                    <div className="text-[9px] text-neutral-500 flex items-center gap-2">
                      <span>💡 {ds.lighting}</span>
                      <span>•</span>
                      <span>⚠️ {ds.incidents}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Nirbhaya Fund Active Initiatives */}
            <Card variant="default" padding="sm" className="space-y-2 bg-neutral-900 text-white border-neutral-800">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-800">
                <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-neutral-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Nirbhaya Fund Deployments</span>
                </h3>
                <span className="text-[9px] font-black bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-400/30">
                  Govt. Monitored
                </span>
              </div>

              <div className="space-y-1.5">
                {DELHI_SAFETY_INITIATIVES.map((init) => (
                  <div key={init.id} className="p-2 rounded-lg bg-neutral-800/60 border border-neutral-700/50 text-xs">
                    <div className="flex items-center justify-between font-black text-white">
                      <span>{init.name}</span>
                      <span className="text-[8px] text-neutral-400">{init.fundedBy}</span>
                    </div>
                    <p className="text-[9px] text-neutral-300 mt-0.5">{init.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
