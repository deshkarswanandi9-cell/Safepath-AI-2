import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X, 
  HelpCircle,
  TrendingUp,
  MapPin,
  ExternalLink,
  ShieldAlert,
  SunMedium,
  Users,
  Building2
} from 'lucide-react';
import { RouteOption, AdaptiveRecommendationState } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface AdaptiveRecommendationBannerProps {
  recommendationState: AdaptiveRecommendationState;
  onAcceptRecommendation: (recommendedRouteId: string) => void;
  onOpenDetailedComparison: () => void;
  onDismiss: () => void;
  compact?: boolean;
}

export const AdaptiveRecommendationBanner: React.FC<AdaptiveRecommendationBannerProps> = ({
  recommendationState,
  onAcceptRecommendation,
  onOpenDetailedComparison,
  onDismiss,
  compact = false
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [showExplanationModal, setShowExplanationModal] = useState(false);

  if (!recommendationState.hasRecommendationChanged) {
    return null;
  }

  return (
    <>
      <div 
        id="adaptive-recommendation-banner"
        className="w-full rounded-2xl border-2 border-emerald-500/80 bg-linear-to-b from-emerald-950/90 via-neutral-900/95 to-black p-3.5 text-white shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-3 duration-300"
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-black tracking-wider uppercase text-emerald-300">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>AI Recommendation Updated</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Dismiss recommendation banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Core Value Proposition & Comparison */}
        <div className="mt-2.5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                Switch to {recommendationState.recommendedRouteName.split('(')[0]}
              </h3>
              <p className="text-[10px] text-neutral-300 line-clamp-1 mt-0.5">
                {recommendationState.triggerCause}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="text-right">
                <span className="text-[9px] font-bold text-red-400 block line-through">
                  {recommendationState.currentRouteScore}%
                </span>
                <span className="text-xs font-black text-emerald-400 block">
                  {recommendationState.recommendedRouteScore}%
                </span>
              </div>
              <Badge variant="safe" size="sm" className="font-black text-[10px] bg-emerald-500/20 border-emerald-500/50 text-emerald-300">
                +{recommendationState.scoreGain}%
              </Badge>
            </div>
          </div>

          {/* Quick Trade-off Metrics */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <div className="p-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-center">
              <span className="text-[8px] text-neutral-400 uppercase font-black block">Safety Boost</span>
              <span className="text-[11px] font-black text-emerald-400 flex items-center justify-center gap-0.5 mt-0.5">
                <TrendingUp className="w-3 h-3" /> +{recommendationState.scoreGain} pts
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-center">
              <span className="text-[8px] text-neutral-400 uppercase font-black block">Time Cost</span>
              <span className="text-[11px] font-black text-amber-300 flex items-center justify-center gap-0.5 mt-0.5">
                <Clock className="w-3 h-3" /> {recommendationState.timeDelta}
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-center">
              <span className="text-[8px] text-neutral-400 uppercase font-black block">Safe Havens</span>
              <span className="text-[11px] font-black text-cyan-300 flex items-center justify-center gap-0.5 mt-0.5">
                <ShieldCheck className="w-3 h-3" /> 4 Verified
              </span>
            </div>
          </div>

          {/* Expandable Natural Language XAI Reason */}
          {isExpanded && (
            <div className="mt-2 p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-[10px] space-y-2">
              <div className="flex items-center justify-between text-neutral-300">
                <span className="font-black text-emerald-300 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3" /> Why AI changed recommendation:
                </span>
                <span className="text-[9px] text-neutral-400">96% confidence</span>
              </div>
              <p className="text-neutral-300 leading-relaxed">
                {recommendationState.whyRecommendationChanged}
              </p>

              {/* Key Protections List */}
              <div className="space-y-1 pt-1 border-t border-neutral-800">
                {recommendationState.keyProtections.slice(0, 3).map((prot, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[9px] text-emerald-300">
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{prot}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              id="btn-accept-recommended-reroute"
              variant="primary"
              size="sm"
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs py-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              onClick={() => onAcceptRecommendation(recommendationState.recommendedRouteId)}
              icon={<Check className="w-3.5 h-3.5" />}
            >
              Accept Route (+4m, {recommendationState.recommendedRouteScore}%)
            </Button>
            <button
              id="btn-why-recommendation-changed"
              type="button"
              onClick={() => setShowExplanationModal(true)}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="View full AI explanation"
            >
              <span>Explain</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle details"
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Full XAI Explanation Modal */}
      {showExplanationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm max-h-[85vh] overflow-y-auto no-scrollbar rounded-3xl bg-neutral-900 border border-neutral-700 p-4 text-white shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-white">
                    Adaptive Recommendation Logic
                  </h2>
                  <p className="text-[10px] text-neutral-400">Continuous AI Corridor Reassessment</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExplanationModal(false)}
                className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                aria-label="Close explain modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Score Migration Card */}
            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold text-neutral-400 uppercase block">Active Trajectory</span>
                <span className="text-xs font-bold text-red-400 line-through">
                  {recommendationState.initialRouteName.split('(')[0]}
                </span>
                <span className="text-sm font-black text-red-400 block">
                  {recommendationState.currentRouteScore}% Safety
                </span>
              </div>
              <div className="flex flex-col items-center">
                <ArrowRight className="w-5 h-5 text-emerald-400" />
                <span className="text-[8px] font-black text-emerald-400 uppercase">Replaced</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold text-emerald-400 uppercase block">New Recommendation</span>
                <span className="text-xs font-bold text-white">
                  {recommendationState.recommendedRouteName.split('(')[0]}
                </span>
                <span className="text-sm font-black text-emerald-400 block">
                  {recommendationState.recommendedRouteScore}% Safety
                </span>
              </div>
            </div>

            {/* Natural Language Narrative */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-neutral-300 uppercase tracking-wider">
                Why SafeRoute AI Updated Recommendation
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                {recommendationState.whyRecommendationChanged}
              </p>
            </div>

            {/* Factor Comparison Table */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-neutral-300 uppercase tracking-wider">
                Factor-by-Factor Impact Breakdown
              </span>
              <div className="space-y-1.5">
                {recommendationState.factorComparison.map((f, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-[10px] space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-white">{f.factorName}</span>
                      <span className={f.isAdvantage ? 'text-emerald-400' : 'text-neutral-400'}>
                        {f.scoreImpact}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[9px] pt-1 border-t border-neutral-900">
                      <div>
                        <span className="text-neutral-500 block">Current Route:</span>
                        <span className="text-red-300 font-medium">{f.currentRouteValue}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-neutral-500 block">Recommended Alt:</span>
                        <span className="text-emerald-300 font-medium">{f.recommendedRouteValue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tradeoff Conclusion */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[10px] space-y-1 text-neutral-300">
              <span className="text-xs font-black text-emerald-300 block">Decision Summary:</span>
              <p>
                <strong>Safety Gain:</strong> {recommendationState.tradeoffSummary.safetyAdvantage}
              </p>
              <p>
                <strong>Time Investment:</strong> {recommendationState.tradeoffSummary.timeCost}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <Button
                variant="primary"
                size="md"
                fullWidth
                className="bg-emerald-500 text-black font-black"
                onClick={() => {
                  setShowExplanationModal(false);
                  onAcceptRecommendation(recommendationState.recommendedRouteId);
                }}
              >
                Accept Recommended Route
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
