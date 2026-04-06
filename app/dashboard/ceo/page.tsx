'use client';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreBar } from '@/components/startups/ScoreBar';
import { startupsApi, intelligenceApi } from '@/lib/api/startups';
import { Building2, TrendingUp, AlertTriangle, Zap } from 'lucide-react';

const STAGE_COLORS: Record<string, 'info' | 'success' | 'warning' | 'danger'> = {
  ideation: 'info',
  validation: 'warning',
  early_traction: 'success',
  growth: 'success',
  scale: 'success',
};

export default function CEODashboard() {
  const { data: startupsData } = useQuery({
    queryKey: ['startups'],
    queryFn: () => startupsApi.getAll({ limit: 100 }).then((r) => r.data),
  });

  const currentYear = new Date().getFullYear();
  const { data: cohortReport } = useQuery({
    queryKey: ['cohort-report', currentYear],
    queryFn: () => intelligenceApi.getCohortReport(currentYear).then((r) => r.data),
  });

  const { data: leaderboard } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => startupsApi.getLeaderboard(currentYear).then((r) => r.data),
  });

  const startups = startupsData?.startups ?? [];
  const activeCount = startups.filter((s: any) => s.status === 'active').length;
  const flaggedCount = startups.filter((s: any) => s.isFlagged).length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CEO Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Cohort {currentYear} · Intelligence view</p>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Startups" value={startups.length} icon={<Building2 size={18} />} color="blue" />
          <StatCard label="Active" value={activeCount} icon={<TrendingUp size={18} />} color="green" />
          <StatCard label="Flagged" value={flaggedCount} icon={<AlertTriangle size={18} />} color="red" />
          <StatCard label="Cohort Report" value={`${cohortReport?.length ?? 0} scored`} icon={<Zap size={18} />} color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Startup Leaderboard</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {(leaderboard ?? []).slice(0, 8).map((s: any, i: number) => (
                <div key={s._id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-5 text-right">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-800 truncate">{s.name}</span>
                      <div className="flex items-center gap-2 ml-2">
                        <Badge variant={STAGE_COLORS[s.stage] ?? 'default'}>{s.stage}</Badge>
                        {s.isFlagged && <Badge variant="danger">⚠ Flagged</Badge>}
                      </div>
                    </div>
                    <ScoreBar score={s.latestScore ?? 0} showValue={false} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 w-10 text-right">
                    {s.latestScore ?? 0}
                  </span>
                </div>
              ))}
              {(!leaderboard || leaderboard.length === 0) && (
                <p className="text-slate-400 text-sm text-center py-6">No startups ranked yet</p>
              )}
            </div>
          </Card>

          {/* AI Cohort Insights */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>AI Cohort Insights</CardTitle>
                <Badge variant="info">Mock · v1</Badge>
              </div>
            </CardHeader>
            <div className="space-y-4">
              {(cohortReport ?? []).slice(0, 5).map((item: any) => (
                <div key={item.startup._id} className="border border-slate-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-800">{item.startup.name}</span>
                    <span className={`text-sm font-bold ${item.score >= 70 ? 'text-emerald-600' : item.score >= 45 ? 'text-amber-600' : 'text-red-600'}`}>
                      {item.score}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {item.recommendations.slice(0, 2).map((rec: string, i: number) => (
                      <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
                        <span className="text-violet-400 mt-0.5">→</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {(!cohortReport || cohortReport.length === 0) && (
                <p className="text-slate-400 text-sm text-center py-6">Run cohort analysis to see insights</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
