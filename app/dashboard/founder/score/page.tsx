'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { ScoreBar } from '@/components/startups/ScoreBar';
import { Badge } from '@/components/ui/Badge';
import { intelligenceApi } from '@/lib/api/startups';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';
import { ChevronDown, Users, Zap } from 'lucide-react';

const SCORE_PARAMS: { key: string; label: string; color: string }[] = [
  { key: 'avgSector',           label: 'Sector Fit',          color: 'bg-blue-400' },
  { key: 'avgStage',            label: 'Stage Fit',           color: 'bg-indigo-400' },
  { key: 'avgFounderStrength',  label: 'Founder Strength',    color: 'bg-violet-500' },
  { key: 'avgIncorporation',    label: 'Incorporation',       color: 'bg-purple-400' },
  { key: 'avgProblemMarket',    label: 'Problem-Market Fit',  color: 'bg-pink-400' },
  { key: 'avgGtm',              label: 'GTM Strategy',        color: 'bg-rose-400' },
  { key: 'avgMarketValidation', label: 'Market Validation',   color: 'bg-orange-400' },
];

const WEIGHT_LABELS = [
  { label: 'Investor Evaluations', weight: 40, color: 'bg-violet-500' },
  { label: 'Milestone Completion', weight: 25, color: 'bg-blue-400' },
  { label: 'Financial Health',     weight: 20, color: 'bg-emerald-400' },
  { label: 'Document Completion',  weight: 15, color: 'bg-amber-400' },
];

function scoreColor(score: number) {
  if (score >= 70) return 'text-emerald-600';
  if (score >= 40) return 'text-amber-500';
  return 'text-red-500';
}

export default function ScorePage() {
  const { user } = useAuthStore();
  const [selectedId, setSelectedId] = useState('');

  const { data: startups = [] } = useQuery<any[]>({
    queryKey: ['my-startups', user?._id],
    queryFn: () => apiClient.get('/founders/my/startups').then((r) => r.data),
    enabled: !!user?._id,
  });

  const activeId = selectedId || startups[0]?._id || '';
  const activeStartup = startups.find((s: any) => s._id === activeId) ?? startups[0];

  // Composite health score
  const { data: compositeScore } = useQuery<number>({
    queryKey: ['startup-score', activeId],
    queryFn: () => intelligenceApi.getScore(activeId).then((r) => r.data),
    enabled: !!activeId,
  });

  // Evaluation aggregate (7-param breakdown)
  const { data: aggregate } = useQuery<any>({
    queryKey: ['eval-aggregate', activeId],
    queryFn: () =>
      apiClient.get(`/evaluations/startup/${activeId}/aggregate`).then((r) => r.data),
    enabled: !!activeId,
  });

  // AI recommendations
  const { data: recommendations = [] } = useQuery<string[]>({
    queryKey: ['recommendations', activeId],
    queryFn: () => intelligenceApi.getRecommendations(activeId).then((r) => r.data),
    enabled: !!activeId,
  });

  const displayScore = compositeScore ?? activeStartup?.latestScore ?? 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Score</h1>
            <p className="text-slate-500 text-sm mt-1">
              Health score calculated from investor evaluations, milestones, and financials
            </p>
          </div>

          {startups.length > 1 && (
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-300 cursor-pointer"
                value={activeId}
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

        {!activeId ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">No startup found. Register one first.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Composite score + weight breakdown */}
            <div className="space-y-5">
              {/* Big score card */}
              <Card>
                <div className="text-center py-4">
                  <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">
                    {activeStartup?.name ?? 'Startup'} · Health Score
                  </p>
                  <p className={`text-7xl font-black leading-none ${scoreColor(displayScore)}`}>
                    {displayScore}
                  </p>
                  <p className="text-slate-400 text-sm mt-1">/100</p>
                  <div className="mt-5">
                    <ScoreBar score={displayScore} label="Overall health" />
                  </div>

                  {/* Score interpretation */}
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                    {displayScore >= 70 ? (
                      <Badge variant="success">On Track</Badge>
                    ) : displayScore >= 40 ? (
                      <Badge variant="warning">Needs Attention</Badge>
                    ) : (
                      <Badge variant="danger">At Risk</Badge>
                    )}
                  </div>
                </div>
              </Card>

              {/* Score weight breakdown */}
              <Card>
                <CardHeader><CardTitle>Score Composition</CardTitle></CardHeader>
                <div className="space-y-3">
                  {WEIGHT_LABELS.map(({ label, weight, color }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600">{label}</span>
                        <span className="text-xs font-semibold text-slate-500">{weight}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${color}`}
                          style={{ width: `${weight}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right: Investor eval breakdown + recommendations */}
            <div className="lg:col-span-2 space-y-5">
              {/* Investor evaluation breakdown */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Investor Evaluation Breakdown</CardTitle>
                    {aggregate?.evaluationCount != null && (
                      <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Users size={12} />
                        {aggregate.evaluationCount} reviewer(s)
                      </span>
                    )}
                  </div>
                </CardHeader>

                {!aggregate ? (
                  <div className="text-center py-8">
                    <p className="text-slate-400 text-sm">
                      No investor evaluations yet. Scores will appear here once investors review your startup.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Avg total */}
                    <div className="flex items-center justify-between p-3 bg-violet-50 rounded-xl border border-violet-100">
                      <span className="text-sm font-medium text-violet-800">Average Total Score</span>
                      <span className="text-2xl font-black text-violet-600">
                        {Math.round(aggregate.avgTotal * 10) / 10}
                        <span className="text-sm font-normal text-violet-400">/70</span>
                      </span>
                    </div>

                    {/* 7-param bars */}
                    <div className="space-y-3">
                      {SCORE_PARAMS.map(({ key, label, color }) => {
                        const val = aggregate[key] ?? 0;
                        const rounded = Math.round(val * 10) / 10;
                        const pct = (val / 10) * 100;
                        return (
                          <div key={key} className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 w-40 flex-shrink-0">{label}</span>
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${color} transition-all`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-700 w-10 text-right">
                              {rounded}/10
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>

              {/* AI Recommendations */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>AI Recommendations</CardTitle>
                    <Zap size={14} className="text-violet-400" />
                  </div>
                </CardHeader>
                <ul className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="w-6 h-6 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {rec}
                    </li>
                  ))}
                  {recommendations.length === 0 && (
                    <p className="text-slate-400 text-sm text-center py-4">No recommendations yet</p>
                  )}
                </ul>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
