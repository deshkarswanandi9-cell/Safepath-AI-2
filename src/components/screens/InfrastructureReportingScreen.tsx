import React, { useState } from 'react';
import { 
  SunMedium, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ThumbsUp, 
  ChevronLeft, 
  Camera, 
  Plus, 
  Building2, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Send
} from 'lucide-react';
import { ScreenId, InfrastructureIssue } from '../../types';
import { MOCK_INFRASTRUCTURE_ISSUES } from '../../data/mockData';

interface InfrastructureReportingScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const InfrastructureReportingScreen: React.FC<InfrastructureReportingScreenProps> = ({
  onNavigate
}) => {
  const [issues, setIssues] = useState<InfrastructureIssue[]>(MOCK_INFRASTRUCTURE_ISSUES);
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('Radial Road 4 (GPS Auto-Tagged)');
  const [newType, setNewType] = useState<InfrastructureIssue['type']>('broken_streetlight');
  const [submittedToast, setSubmittedToast] = useState<boolean>(false);

  const handleUpvote = (id: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id ? { ...issue, upvotes: issue.upvotes + 1 } : issue
    ));
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newIssue: InfrastructureIssue = {
      id: `inf-${Date.now()}`,
      type: newType,
      title: newTitle,
      location: newLocation,
      reportedAt: 'Just now',
      status: 'reported',
      municipalWard: 'NDMC Central Ward (Dispatched)',
      upvotes: 1,
      impactScore: 'High Concern'
    };

    setIssues([newIssue, ...issues]);
    setNewTitle('');
    setShowNewModal(false);
    setSubmittedToast(true);
    setTimeout(() => setSubmittedToast(false), 3500);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-y-auto no-scrollbar pb-28 select-none">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-xl text-white px-4 pt-3 pb-3.5 border-b border-slate-800 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="p-1.5 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-1">
                  Streetlight & Safety Infrastructure Hub
                </h1>
              </div>
              <p className="text-[10px] text-slate-400">
                Fix dark spots, broken streetlights & CCTV blind zones
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow-md shadow-amber-500/20 transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Report Issue
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {submittedToast && (
        <div className="mx-4 mt-3 p-3 rounded-2xl bg-emerald-600 text-white shadow-lg flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold">Report logged and dispatched to NDMC Municipal Division!</span>
          </div>
        </div>
      )}

      {/* Municipal Impact Stats Card */}
      <div className="p-4">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-lg border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
                Municipal Action Dashboard
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              84% Resolved Rate
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2 border-t border-slate-800 text-center text-xs">
            <div>
              <div className="text-[10px] text-slate-400">Active Dark Spots</div>
              <div className="text-base font-black text-amber-400">3 Fixed Today</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Avg Resolution</div>
              <div className="text-base font-black text-slate-100">18 Hours</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Community Votes</div>
              <div className="text-base font-black text-emerald-400">133 Upvotes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Issues Feed */}
      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">
            Verified Infrastructure Issues & Status
          </h3>
          <span className="text-[10px] text-slate-400 font-semibold">{issues.length} records</span>
        </div>

        {issues.map((issue) => (
          <div 
            key={issue.id}
            className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                <div className={`p-2 rounded-2xl text-white shrink-0 shadow-md ${
                  issue.status === 'resolved' 
                    ? 'bg-emerald-600' 
                    : issue.type === 'broken_streetlight' 
                    ? 'bg-amber-500' 
                    : 'bg-indigo-600'
                }`}>
                  <SunMedium className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{issue.title}</h4>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {issue.location} • <Clock className="w-3 h-3 ml-1 text-slate-400" /> {issue.reportedAt}
                  </p>
                </div>
              </div>

              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                issue.status === 'resolved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : issue.status === 'work_in_progress'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {issue.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between">
              <span>🏛️ <strong>{issue.municipalWard}</strong></span>
              {issue.resolvedDate && (
                <span className="text-emerald-700 font-bold">✓ Fixed on {issue.resolvedDate}</span>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
              <span className="text-slate-500 font-semibold">
                <strong>{issue.upvotes}</strong> commuters confirmed this hazard
              </span>

              <button
                onClick={() => handleUpvote(issue.id)}
                className="px-3 py-1 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 rounded-xl font-bold flex items-center gap-1 transition active:scale-95 shadow-xs"
              >
                <ThumbsUp className="w-3 h-3 text-amber-600" />
                Upvote (+1)
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Report Modal Dialog */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-3.5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <SunMedium className="w-4 h-4 text-amber-500" />
                Report Dark Spot / Infrastructure Issue
              </h3>
              <button 
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Issue Category</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
                >
                  <option value="broken_streetlight">Broken / Dim Streetlight</option>
                  <option value="dark_bus_stop">Dark / Unlit Bus Shelter</option>
                  <option value="blind_spot_cctv">Obstructed / Broken CCTV</option>
                  <option value="damaged_footpath">Damaged Footpath / Obstruction</option>
                  <option value="isolated_subway">Unsafe Pedestrian Subway</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 2 dead streetlights near Metro Gate 3 alley..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">GPS Geotagged Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md flex items-center justify-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
