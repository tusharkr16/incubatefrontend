'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreBar } from '@/components/startups/ScoreBar';
import { fundingInterestsApi } from '@/lib/api';
import {
  DollarSign, CheckCircle, Clock, XCircle, Building2,
  TrendingUp, Globe, ExternalLink, Calendar,
} from 'lucide-react';
import { clsx } from 'clsx';

function fmtAmount(n: number) {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)} L`;
  if (n >= 1_000)      return `₹${(n / 1_000).toFixed(1)} K`;
  return `₹${n.toLocaleString()}`;
}

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:  { label: 'Pending Review', color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',   icon: <Clock size={13} /> },
  accepted: { label: 'Accepted',       color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: <CheckCircle size={13} /> },
  rejected: { label: 'Rejected',       color: 'text-red-600',     bg: 'bg-red-50 border-red-200',       icon: <XCircle size={13} /> },
};

const STATUS_VARIANT: Record<string, any> = {
  active: 'success', inactive: 'warning', graduated: 'info', suspended: 'danger',
};

export default function InvestorMyFundedPage() {
  const { data: myInterests = [], isLoading } = useQuery({
    queryKey: ['my-funding-interests'],
    queryFn: () => fundingInterestsApi.getMy().then((r) => r.data as any[]),
    staleTime: 30_000,
  });

  const totalPledged  = myInterests.reduce((s: number, i: any) => s + i.amount, 0);
  const totalAccepted = myInterests
    .filter((i: any) => i.status === 'accepted')
    .reduce((s: number, i: any) => s + i.amount, 0);
  const totalPending  = myInterests.filter((i: any) => i.status === 'pending').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp size={20} className="text-violet-500" />
            My Funded Startups
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Startups you have expressed funding interest in
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={14} className="text-violet-400" />
              <p className="text-xs text-slate-400">Startups Funded</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{myInterests.length}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={14} className="text-violet-400" />
              <p className="text-xs text-slate-400">Total Pledged</p>
            </div>
            <p className="text-2xl font-bold text-violet-600">{fmtAmount(totalPledged)}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={14} className="text-emerald-400" />
              <p className="text-xs text-slate-400">Accepted</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{fmtAmount(totalAccepted)}</p>
          </Card>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-52 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && myInterests.length === 0 && (
          <Card>
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <DollarSign size={36} className="text-slate-200" />
              <p className="text-slate-500 font-medium">No funded startups yet</p>
              <p className="text-slate-400 text-sm text-center">
                Go to <strong>Portfolio</strong> and click a startup card to express funding interest.
              </p>
            </div>
          </Card>
        )}

        {/* Cards */}
        {!isLoading && myInterests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {myInterests.map((interest: any) => {
              const startup = interest.startupId;
              const meta    = STATUS_META[interest.status] ?? STATUS_META['pending'];
              const score   = startup?.latestScore ?? 0;

              return (
                <Card key={String(interest._id)} className="flex flex-col gap-4">
                  {/* Status banner */}
                  <div className={clsx(
                    'flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border -mx-0',
                    meta.color, meta.bg,
                  )}>
                    {meta.icon}
                    {meta.label}
                    <span className="ml-auto font-black text-base">{fmtAmount(interest.amount)}</span>
                  </div>

                  {/* Startup info */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-black text-lg flex-shrink-0">
                      {startup?.name?.[0] ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
                        {startup?.name ?? 'Unknown Startup'}
                      </h3>
                      {startup?.schemeName && (
                        <p className="text-xs text-slate-400 mt-0.5">{startup.schemeName}</p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {startup?.sector?.primary && (
                          <Badge variant="info">{startup.sector.primary}</Badge>
                        )}
                        {startup?.stage && (
                          <Badge variant="outline">{startup.stage.replace('_', ' ')}</Badge>
                        )}
                        {startup?.status && (
                          <Badge variant={STATUS_VARIANT[startup.status] ?? 'default'}>
                            {startup.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-slate-400">Score</p>
                      <p className="text-2xl font-black text-violet-600 leading-none">{score}</p>
                      <p className="text-xs text-slate-400">/100</p>
                    </div>
                  </div>

                  <ScoreBar score={score} label="" />

                  {startup?.description && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 -mt-1">
                      {startup.description}
                    </p>
                  )}

                  {/* Message */}
                  {interest.message && (
                    <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5">
                      <p className="text-xs text-slate-400 mb-1">Your message</p>
                      <p className="text-sm text-slate-600 leading-relaxed">&ldquo;{interest.message}&rdquo;</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center gap-3 text-xs text-slate-400 pt-1 border-t border-slate-50">
                    {startup?.cohortYear && (
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {startup.cohortYear}
                      </span>
                    )}
                    {startup?.website && (
                      <a
                        href={startup.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-violet-500 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe size={11} /> Website <ExternalLink size={9} />
                      </a>
                    )}
                    {interest.createdAt && (
                      <span className="ml-auto">
                        Submitted {new Date(interest.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pending note */}
        {totalPending > 0 && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
            <Clock size={12} className="inline mr-1.5" />
            {totalPending} of your interest{totalPending > 1 ? 's are' : ' is'} pending review by the startup founder.
          </p>
        )}

      </div>
    </DashboardLayout>
  );
}
