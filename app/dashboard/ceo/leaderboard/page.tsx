'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreBar } from '@/components/startups/ScoreBar';
import { startupsApi } from '@/lib/api/startups';
import { Trophy, TrendingUp, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

const STAGE_COLOR: Record<string, 'info' | 'warning' | 'success' | 'outline'> = {
  ideation: 'outline',
  validation: 'warning',
  early_traction: 'info',
  growth: 'success',
  scale: 'success',
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

function getRankStyle(rank: number) {
  if (rank === 1) return 'text-amber-500 font-black text-lg';
  if (rank === 2) return 'text-slate-400 font-black text-base';
  if (rank === 3) return 'text-amber-700 font-black text-base';
  return 'text-slate-300 font-bold text-sm';
}

function getRankIcon(rank: number) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return rank;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [cohortYear, setCohortYear] = useState(CURRENT_YEAR);

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard', cohortYear],
    queryFn: () => startupsApi.getLeaderboard(cohortYear).then((r) => r.data),
  });

  const ranked = leaderboard ?? [];
  const topScore = ranked[0]?.latestScore ?? 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Trophy size={22} className="text-amber-500" />
              Startup Leaderboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">Ranked by composite health score</p>
          </div>
          <select
            value={cohortYear}
            onChange={(e) => setCohortYear(+e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>Cohort {y}</option>
            ))}
          </select>
        </div>

        {/* Top 3 podium */}
        {ranked.length >= 3 && (
          <div className="grid grid-cols-3 gap-4">
            {[ranked[1], ranked[0], ranked[2]].map((s: any, idx) => {
              const rank = idx === 1 ? 1 : idx === 0 ? 2 : 3;
              return (
                <div
                  key={s._id}
                  onClick={() => router.push(`/dashboard/ceo/startups/${s._id}`)}
                  className={clsx(
                    'bg-white border rounded-xl p-5 text-center cursor-pointer hover:shadow-md transition-all',
                    rank === 1
                      ? 'border-amber-300 ring-2 ring-amber-100 -mt-3 shadow-sm'
                      : 'border-slate-200',
                  )}
                >
                  <div className="text-3xl mb-2">{getRankIcon(rank)}</div>
                  <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xl font-black mx-auto mb-3">
                    {s.name[0]}
                  </div>
                  <p className="font-bold text-slate-900 text-sm truncate">{s.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.sector?.primary}</p>
                  <p className={clsx('text-2xl font-black mt-3', rank === 1 ? 'text-violet-600' : 'text-slate-700')}>
                    {s.latestScore ?? 0}
                  </p>
                  <p className="text-xs text-slate-400">/ 100</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Full ranked table */}
        <Card padding={false}>
          {isLoading ? (
            <div className="py-16 text-center text-slate-400 text-sm">Loading leaderboard...</div>
          ) : ranked.length === 0 ? (
            <div className="py-16 text-center">
              <TrendingUp size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No startups scored yet for cohort {cohortYear}</p>
              <p className="text-slate-300 text-xs mt-1">Submit evaluations to generate rankings</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide bg-slate-50 rounded-t-xl">
                <span className="col-span-1">#</span>
                <span className="col-span-4">Startup</span>
                <span className="col-span-2">Sector</span>
                <span className="col-span-2">Stage</span>
                <span className="col-span-3">Score</span>
              </div>

              {ranked.map((s: any, i: number) => {
                const rank = i + 1;
                const scorePercent = topScore > 0 ? ((s.latestScore ?? 0) / topScore) * 100 : 0;
                return (
                  <div
                    key={s._id}
                    onClick={() => router.push(`/dashboard/ceo/startups/${s._id}`)}
                    className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className={clsx('col-span-1', getRankStyle(rank))}>
                      {getRankIcon(rank)}
                    </div>
                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {s.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{s.name}</p>
                        {s.isFlagged && (
                          <span className="flex items-center gap-1 text-xs text-red-500">
                            <AlertTriangle size={9} /> Flagged
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 text-sm text-slate-500 truncate">{s.sector?.primary}</div>
                    <div className="col-span-2">
                      <Badge variant={STAGE_COLOR[s.stage] ?? 'outline'}>
                        {s.stage?.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="flex-1">
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={clsx(
                              'h-full rounded-full transition-all',
                              (s.latestScore ?? 0) >= 70
                                ? 'bg-emerald-500'
                                : (s.latestScore ?? 0) >= 45
                                ? 'bg-amber-500'
                                : 'bg-red-400',
                            )}
                            style={{ width: `${scorePercent}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-700 w-8 text-right">
                        {s.latestScore ?? 0}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
