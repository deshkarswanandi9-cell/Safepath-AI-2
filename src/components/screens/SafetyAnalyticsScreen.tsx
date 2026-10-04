import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  BarChart2, 
  TrendingUp, 
  PieChart as PieIcon, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle,
  Clock,
  ChevronRight,
  Building,
  ShieldAlert,
  CheckCircle2,
  MapPin,
  Flame,
  Eye,
  Info,
  Layers,
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

interface SafetyAnalyticsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const SafetyAnalyticsScreen: React.FC<SafetyAnalyticsScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'official_delhi'>('personal');
  const [activeRange, setActiveRange] = useState<'week' | 'month'>('week');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // SVG Line Chart coordinates calculation for Safety Trends
  const trendScores = ANALYTICS_DATA.trendScores;
  const linePoints = trendScores
    .map((item, idx) => {
      const x = 30 + idx * 45;
      const y = 140 - ((item.score - 60) / 40) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="relative min-h-[640px] h-full flex flex-col justify-between bg-[#F8FAFC] overflow-y-auto no-scrollbar p-4 pb-24 select-none">
      <div>
        {/* Top Header */}
        <div className="pt-2 flex items-center justify-between mb-3">
          <button
            id="btn-analytics-back"
            onClick={() => onNavigate('dashboard')}
            className="p-2 rounded-2xl bg-white shadow-sm border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          {/* Main Top Tab Switcher */}
          <div className="bg-slate-200/90 p-1 rounded-2xl flex text-xs font-bold shadow-inner">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'personal'
                  ? 'bg-white text-indigo-700 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Telemetry
            </button>
            <button
              onClick={() => setActiveTab('official_delhi')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === 'official_delhi'
                  ? 'bg-rose-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>NCRB Delhi 2024</span>
            </button>
          </div>

          <div className="w-8" />
        </div>

        {activeTab === 'personal' ? (
          <>
            {/* Title & Summary */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Safety Analytics
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Aggregated telemetry & incident risk indicators
                </p>
              </div>
              {/* Time range pills */}
              <div className="bg-slate-200/80 p-0.5 rounded-xl flex text-[10px] font-bold">
                <button
                  onClick={() => setActiveRange('week')}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    activeRange === 'week' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setActiveRange('month')}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    activeRange === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  30 Days
                </button>
              </div>
            </div>

            {/* AI Insight Card */}
            <div className="mb-4 p-4 rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white shadow-xl shadow-purple-600/20 relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-purple-200">
                    AI Insight Card
                  </div>
                  <p className="text-xs font-bold text-white mt-1 leading-relaxed">
                    “Most reported risks occurred in poorly lit areas after 10 PM.”
                  </p>
                  <div className="mt-2.5 flex items-center gap-2 text-[10px] text-purple-100 font-medium">
                    <span className="px-2 py-0.5 rounded-full bg-white/15">
                      Recommendation: Prioritize Metro corridors past 10 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart 1: Bar Chart – Weekly Safe Trips */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900">Weekly Safe Trips</h3>
                    <p className="text-[10px] text-slate-400">Total 20 trips completed</p>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  93.4% Avg Safety
                </span>
              </div>

              {/* SVG Bar Chart */}
              <div className="relative h-40 w-full pt-4">
                <svg viewBox="0 0 280 130" className="w-full h-full">
                  <line x1="20" y1="20" x2="260" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="20" y1="60" x2="260" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="20" y1="100" x2="260" y2="100" stroke="#E2E8F0" strokeWidth="1" />

                  {ANALYTICS_DATA.weeklyTrips.map((item, idx) => {
                    const barWidth = 22;
                    const x = 30 + idx * 34;
                    const maxTrips = 5;
                    const barHeight = (item.trips / maxTrips) * 80;
                    const y = 100 - barHeight;
                    const isHovered = hoveredBar === idx;

                    return (
                      <g
                        key={idx}
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setHoveredBar(idx)}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={barHeight}
                          rx="6"
                          fill={isHovered ? '#1D4ED8' : '#2563EB'}
                          className="transition-colors"
                        />
                        <text
                          x={x + barWidth / 2}
                          y={y - 5}
                          textAnchor="middle"
                          fill="#64748B"
                          fontSize="9"
                          fontWeight="700"
                        >
                          {item.trips}
                        </text>
                        <text
                          x={x + barWidth / 2}
                          y="116"
                          textAnchor="middle"
                          fill="#475569"
                          fontSize="10"
                          fontWeight="600"
                        >
                          {item.day}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Chart 2: Line Chart – Safety Trends */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900">Safety Trends by Hour</h3>
                    <p className="text-[10px] text-slate-400">Night safety index vs hour of transit</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500">8 PM – 1 AM</span>
              </div>

              <div className="relative h-36 w-full">
                <svg viewBox="0 0 280 150" className="w-full h-full">
                  <defs>
                    <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <polygon
                    points={`30,135 ${linePoints} ${30 + (trendScores.length - 1) * 45},135`}
                    fill="url(#area-grad)"
                  />

                  <polyline
                    fill="none"
                    stroke="#7C3AED"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={linePoints}
                  />

                  {trendScores.map((item, idx) => {
                    const x = 30 + idx * 45;
                    const y = 140 - ((item.score - 60) / 40) * 100;

                    return (
                      <g key={idx}>
                        <circle cx={x} cy={y} r="4" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="2.5" />
                        <text x={x} y={y - 8} textAnchor="middle" fill="#7C3AED" fontSize="9" fontWeight="800">
                          {item.score}%
                        </text>
                        <text x={x} y="148" textAnchor="middle" fill="#64748B" fontSize="9" fontWeight="600">
                          {item.time}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Chart 3: Donut Chart – Risk Factors Encountered */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                    <PieIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900">Risk Factors Encountered</h3>
                    <p className="text-[10px] text-slate-400">Distribution of avoided hazards</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  4 Categories
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-28 h-28 shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#EF4444"
                      strokeWidth="16"
                      strokeDasharray="238.7"
                      strokeDashoffset="128.9"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#F59E0B"
                      strokeWidth="16"
                      strokeDasharray="238.7"
                      strokeDashoffset="171.8"
                      style={{ transform: 'rotate(165.6deg)', transformOrigin: '50% 50%' }}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#6366F1"
                      strokeWidth="16"
                      strokeDasharray="238.7"
                      strokeDashoffset="205.2"
                      style={{ transform: 'rotate(266.4deg)', transformOrigin: '50% 50%' }}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#8B5CF6"
                      strokeWidth="16"
                      strokeDasharray="238.7"
                      strokeDashoffset="210"
                      style={{ transform: 'rotate(316.8deg)', transformOrigin: '50% 50%' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-black text-slate-800">46%</span>
                    <span className="text-[8px] uppercase font-bold text-slate-400">Lighting</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  {ANALYTICS_DATA.riskFactors.map((rf, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: rf.color }}
                        />
                        <span className="font-semibold text-slate-700">{rf.factor}</span>
                      </div>
                      <span className="font-bold text-slate-900">{rf.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ======================================================= */
          /* OFFICIAL NCRB 2024 & DELHI PUBLIC SAFETY DATASET VIEW  */
          /* ======================================================= */
          <div className="space-y-4">
            {/* Header info banner */}
            <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-xl space-y-2 border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white">
                      NCRB 2024 Delhi Metropolitan Crime Report
                    </h2>
                    <p className="text-[10px] text-slate-400">
                      Ministry of Home Affairs — Official Public Safety Benchmark
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Rank #1 Metros
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="text-lg font-black text-rose-400 leading-tight">
                    {REAL_CRIME_STATS_DELHI_2024.totalCrimesAgainstWomen.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-slate-400 font-bold mt-0.5">Total Crimes (Women)</div>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="text-lg font-black text-amber-400 leading-tight">
                    {REAL_CRIME_STATS_DELHI_2024.crimeRatePer1LakhFemale}
                  </div>
                  <div className="text-[9px] text-slate-400 font-bold mt-0.5">Rate / 100k Women</div>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="text-lg font-black text-emerald-400 leading-tight">35</div>
                  <div className="text-[9px] text-slate-400 font-bold mt-0.5">Pink Force Units</div>
                </div>
              </div>
            </div>

            {/* Crime Category Breakdown (Official Data) */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-rose-600" />
                  <span>Reported Incidents Breakdown (2024)</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-bold">Delhi Police Annual Record</span>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Cruelty & Domestic Infringements', count: REAL_CRIME_STATS_DELHI_2024.crueltyByHusband, color: 'bg-rose-500' },
                  { label: 'Kidnapping & Abduction', count: REAL_CRIME_STATS_DELHI_2024.kidnappingAbduction, color: 'bg-amber-500' },
                  { label: 'Sexual Assault & Rape', count: REAL_CRIME_STATS_DELHI_2024.rapeCase, color: 'bg-red-600' },
                  { label: 'Public Assault & Modesty Infringement', count: REAL_CRIME_STATS_DELHI_2024.assaultOutrageModesty, color: 'bg-purple-600' },
                  { label: 'Public Sexual Harassment (Section 509)', count: REAL_CRIME_STATS_DELHI_2024.sexualHarassment, color: 'bg-indigo-600' },
                  { label: 'Stalking & Cyber Harassment (Section 354D)', count: REAL_CRIME_STATS_DELHI_2024.stalking, color: 'bg-blue-600' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>{item.label}</span>
                      <span className="font-black text-slate-900">{item.count.toLocaleString()} cases</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${Math.min(100, (item.count / 4647) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real Delhi Areas Night Safety Index */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Delhi Hotspots Night Safety Matrix</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-bold">Delhi Safe City Survey</span>
              </div>

              <div className="space-y-2.5">
                {REAL_DELHI_AREA_SAFETY.map((area) => (
                  <div
                    key={area.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-extrabold text-xs text-slate-900">{area.name}</div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        area.safetyScore >= 80 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : area.safetyScore >= 60
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {area.safetyScore}/100 Safety
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-600 font-medium">
                      <div>💡 Lighting: <strong className="text-slate-800">{area.lightingScore}%</strong></div>
                      <div>📹 CCTV: <strong className="text-slate-800">{area.cctvDensity}</strong></div>
                      <div>👮 Police: <strong className="text-slate-800">{area.policePresence}</strong></div>
                    </div>

                    <p className="text-[10px] text-slate-500 italic mt-0.5">
                      {area.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* NDMC & Police Verified Dark Spots Audit */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-600" />
                  <span>NDMC & Police Verified Dark Spots</span>
                </h3>
                <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  Under Audit
                </span>
              </div>

              <div className="space-y-2">
                {REAL_DELHI_DARK_SPOTS.map((ds) => (
                  <div key={ds.id} className="p-2.5 rounded-2xl bg-rose-50/60 border border-rose-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900">{ds.name}</span>
                      <span className="text-[9px] font-black text-rose-700 bg-white px-2 py-0.5 rounded-full border border-rose-300">
                        {ds.riskLevel} Risk
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-600 flex items-center gap-2">
                      <span>💡 {ds.lighting}</span>
                      <span>•</span>
                      <span>⚠️ {ds.incidents}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nirbhaya Fund Active Initiatives */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-900 to-purple-950 text-white shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-indigo-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Nirbhaya Fund Active Deployments</span>
                </h3>
                <span className="text-[10px] font-black bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Govt. Monitored
                </span>
              </div>

              <div className="space-y-2">
                {DELHI_SAFETY_INITIATIVES.map((init) => (
                  <div key={init.id} className="p-2.5 rounded-2xl bg-white/10 border border-white/10 text-xs">
                    <div className="flex items-center justify-between font-black text-white">
                      <span>{init.name}</span>
                      <span className="text-[9px] text-indigo-200">{init.fundedBy}</span>
                    </div>
                    <p className="text-[10px] text-slate-300 mt-1">{init.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
