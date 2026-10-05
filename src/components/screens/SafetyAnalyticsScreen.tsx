import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BarChart2, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle,
  Clock
} from 'lucide-react';
import { ScreenId } from '../../types';
import { ANALYTICS_DATA } from '../../data/mockData';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface SafetyAnalyticsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const SafetyAnalyticsScreen: React.FC<SafetyAnalyticsScreenProps> = ({ onNavigate }) => {
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
          <span className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
            Safety Telemetry
          </span>
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
              7 Days
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
              30 Days
            </button>
          </div>
        </div>

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
      </div>
    </div>
  );
};
