'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';
import {
  Users, ThumbsUp, ThumbsDown, Minus, Star, MessageSquare,
  TrendingUp, ChevronDown,
} from 'lucide-react';

const REC_META: Record<string, { label: string; variant: any; icon: React.ReactNode }> = {
  strongly_recommend: { label: 'Strongly Recommend', variant: 'success', icon: <ThumbsUp size={13} /> },
  recommend:          { label: 'Recommend',           variant: 'info',    icon: <ThumbsUp size={13} /> },
  neutral:            { label: 'Neutral',             variant: 'warning', icon: <Minus size={13} /> },
  not_recommend:      { label: 'Not Recommend',       variant: 'danger',  icon: <ThumbsDown size={13} /> },
};

const SCORE_PARAMS = [
  { key: 'sector',           label: 'Sector Fit' },
  { key: 'stage',            label: 'Stage Fit' },
  { key: 'founderStrength',  label: 'Founder Strength' },
  { key: 'incorporation',    label: 'Incorporation' },
  { key: 'problemMarket',    label: 'Problem-Market Fit' },
  { key: 'gtm',              label: 'GTM Strategy' },
  { key: 'marketValidation', label: 'Market Validation' },
];

export default function InvestorInterestPage() {
  const { user } = useAuthStore();
  const [selectedId, setSelectedId] = useState<string>('');

  // All startups for this founder
  const { data: startups = [] } = useQuery<any[]>({
    queryKey: ['my-startups', user?._id],
    queryFn: () => apiClient.get('/founders/my/startups').then((r) => r.data),
    enabled: !!user?._id,
  });

  const activeStartupId = selectedId || startups[0]?._id || '';
  const activeStartup = startups.find((s: any) => s._id === activeStartupId) ?? startups[0];

  // Evaluations for the selected startup
  const { data: evaluations = [], isLoading } = useQuery<any[]>({
    queryKey: ['evaluations', activeStartupId],
    queryFn: () =>
      apiClient.get(`/evaluations/startup/${activeStartupId}`).then((r) => r.data),
    enabled: !!activeStartupId,
  });

  // Recommendation breakdown
  const recCounts = evaluations.reduce<Record<string, number>>((acc, e) => {
    const k = e.recommendation ?? 'neutral';
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

  const avgScore =
    evaluations.length > 0
      ? Math.round((evaluations.reduce((s: number, e: any) => s + e.totalScore, 0) / evaluations.length) * 10) / 10
      : 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Investor Interest</h1>
            <p className="text-slate-500 text-sm mt-1">
              Investors who have reviewed and evaluated your startup
            </p>
          </div>

          {/* Startup selector */}
          {startups.length > 1 && (
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-300 cursor-pointer"
                value={activeStartupId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                {startups.map((s: any) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          )}
        </div>

        {!activeStartupId ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">No startup found. Register one first.</p>
            </div>
          </Card>
        ) : isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* KPI stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Reviewers"
                value={evaluations.length}
                icon={<Users size={16} />}
                color="blue"
              />
              <StatCard
                label="Avg Score"
                value={`${avgScore}/70`}
                icon={<Star size={16} />}
                color="amber"
              />
              <StatCard
                label="Recommend"
                value={(recCounts['strongly_recommend'] ?? 0) + (recCounts['recommend'] ?? 0)}
                icon={<ThumbsUp size={16} />}
                color="green"
              />
              <StatCard
                label="Not Recommend"
                value={recCounts['not_recommend'] ?? 0}
                icon={<ThumbsDown size={16} />}
                color="red"
              />
            </div>

            {evaluations.length === 0 ? (
              <Card>
                <div className="text-center py-12 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                    <Users size={24} className="text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">No investors have reviewed yet</p>
                  <p className="text-slate-400 text-sm">
                    Once investors evaluate your startup, their interest will appear here.
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recommendation breakdown */}
                <Card>
                  <CardHeader><CardTitle>Recommendation Breakdown</CardTitle></CardHeader>
                  <div className="space-y-3">
                    {Object.entries(REC_META).map(([key, meta]) => {
                      const count = recCounts[key] ?? 0;
                      const pct = evaluations.length > 0 ? Math.round((count / evaluations.length) * 100) : 0;
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="flex items-center gap-1.5 text-xs text-slate-600">
                              {meta.icon} {meta.label}
                            </span>
                            <span className="text-xs font-semibold text-slate-700">
                              {count} <span className="text-slate-400 font-normal">({pct}%)</span>
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={[
                                'h-full rounded-full transition-all',
                                key === 'strongly_recommend' || key === 'recommend'
                                  ? 'bg-emerald-400'
                                  : key === 'neutral'
                                  ? 'bg-amber-400'
                                  : 'bg-red-400',
                              ].join(' ')}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Individual evaluations */}
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    Individual Reviews ({evaluations.length})
                  </h2>
                  {evaluations.map((ev: any) => (
                    <EvalCard key={ev._id} ev={ev} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function EvalCard({ ev }: { ev: any }) {
  const [expanded, setExpanded] = useState(false);
  const meta = REC_META[ev.recommendation] ?? REC_META.neutral;
  const reviewer = ev.reviewerId;
  const initial = reviewer?.name?.[0]?.toUpperCase() ?? 'I';

  return (
    <Card>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm flex-shrink-0">
          {initial}
        </div>

        <div className="flex-1 min-w-0">
          {/* Reviewer + meta */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <p className="font-semibold text-slate-800 text-sm">
                {reviewer?.name ?? 'Anonymous Investor'}
              </p>
              <p className="text-xs text-slate-400">
                {new Date(ev.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 bg-slate-100 rounded-md px-2.5 py-1">
                {ev.totalScore}/70
              </span>
              <Badge variant={meta.variant}>
                <span className="flex items-center gap-1">{meta.icon} {meta.label}</span>
              </Badge>
            </div>
          </div>

          {/* Score bars — collapsed by default */}
          <button
            onClick={() => setExpanded((x) => !x)}
            className="flex items-center gap-1 text-xs text-violet-500 hover:text-violet-700 mt-2 transition-colors"
          >
            <TrendingUp size={12} />
            {expanded ? 'Hide' : 'View'} score breakdown
          </button>

          {expanded && (
            <div className="mt-3 space-y-2">
              {SCORE_PARAMS.map(({ key, label }) => {
                const val = ev.scores?.[key] ?? 0;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-36 flex-shrink-0">{label}</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-400 rounded-full"
                        style={{ width: `${(val / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 w-8 text-right">
                      {val}/10
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Notes */}
          {ev.notes && (
            <div className="mt-3 flex items-start gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
              <MessageSquare size={12} className="flex-shrink-0 mt-0.5 text-slate-400" />
              <p className="leading-relaxed">{ev.notes}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
