import React, { useState } from 'react';
import { 
  SunMedium, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ThumbsUp, 
  ChevronLeft, 
  Plus, 
  Building2, 
  AlertTriangle,
  X
} from 'lucide-react';
import { ScreenId, InfrastructureIssue } from '../../types';
import { MOCK_INFRASTRUCTURE_ISSUES } from '../../data/mockData';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface InfrastructureReportingScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const InfrastructureReportingScreen: React.FC<InfrastructureReportingScreenProps> = ({
  onNavigate
}) => {
  const [issues, setIssues] = useState<InfrastructureIssue[]>(MOCK_INFRASTRUCTURE_ISSUES);
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('Radial Road 4 (GPS Geotagged)');
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
    setTimeout(() => setSubmittedToast(false), 3000);
  };

  return (
    <div className="relative h-full flex flex-col justify-between bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar p-4 pb-20">
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
                Infrastructure Hub
              </h1>
              <p className="text-[10px] text-neutral-500">Fix dark spots, streetlights & CCTV blind zones</p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowNewModal(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Report
          </Button>
        </div>

        {/* Feedback Toast */}
        {submittedToast && (
          <div className="mb-3 p-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold shadow-md flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>Hazard reported and dispatched to Municipal Maintenance Ward</span>
          </div>
        )}

        {/* Summary Card */}
        <Card variant="subtle" padding="sm" className="mb-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-black dark:text-white">Municipal Accountability</span>
              <p className="text-[10px] text-neutral-500">Reports are escalated directly to NDMC/PWD wards</p>
            </div>
            <Badge variant="safe" size="sm">
              92% Solved
            </Badge>
          </div>
        </Card>

        {/* Issue Feed */}
        <div className="space-y-2">
          {issues.map((issue) => (
            <Card key={issue.id} variant="default" padding="sm" className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-black text-black dark:text-white">{issue.title}</h3>
                  </div>
                  <div className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-neutral-400" />
                    <span>{issue.location}</span>
                  </div>
                  <div className="text-[9px] text-neutral-400 mt-0.5 font-medium">
                    Reported {issue.reportedAt} • {issue.municipalWard}
                  </div>
                </div>

                <Badge
                  variant={
                    issue.status === 'resolved'
                      ? 'safe'
                      : issue.status === 'work_in_progress'
                      ? 'caution'
                      : 'subtle'
                  }
                  size="sm"
                >
                  {issue.status.replace(/_/g, ' ').toUpperCase()}
                </Badge>
              </div>

              {/* Upvote Footer */}
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[10px]">
                <span className="text-neutral-500 font-medium">Concern: {issue.impactScore}</span>

                <button
                  type="button"
                  onClick={() => handleUpvote(issue.id)}
                  className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>+{issue.upvotes} Confirm</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* New Report Modal (Bounded) */}
      {showNewModal && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs rounded-2xl bg-white dark:bg-black text-black dark:text-white p-4 border border-neutral-300 dark:border-neutral-800 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
                Report Dark Spot or Hazard
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="p-1 text-neutral-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Hazard Category
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white text-xs font-bold rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="broken_streetlight">Broken / Dark Streetlight</option>
                  <option value="dark_bus_stop">Unlit Public Bus Stop</option>
                  <option value="blind_spot_cctv">CCTV Blind Spot</option>
                  <option value="damaged_footpath">Damaged Footpath / Pavement</option>
                </select>
              </div>

              <Input
                label="Issue Description"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. 3 consecutive lights broken near gate"
                required
              />

              <Input
                label="Location Tag"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                required
              />

              <div className="pt-2 flex gap-2">
                <Button type="submit" variant="primary" fullWidth size="md">
                  Submit to Ward
                </Button>
                <Button type="button" variant="outline" size="md" onClick={() => setShowNewModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
