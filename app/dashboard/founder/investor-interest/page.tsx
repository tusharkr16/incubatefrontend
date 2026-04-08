'use client';
import { useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { fundingInterestsApi } from '@/lib/api';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';
import {
  DollarSign, Users, CheckCircle, Clock, XCircle, Building2, TrendingUp,
} from 'lucide-react';
import { clsx } from 'clsx';

function fmtAmount(n: number) {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)} L`;
  if (n >= 1_000)      return `₹${(n / 1_000).toFixed(1)} K`;
  return `₹${n.toLocaleString()}`;
}

const STATUS_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:  { label: 'Pending Review', color: 'text-amber-600 bg-amber-50 border-amber-200',       icon: <Clock size={12} /> },
  accepted: { label: 'Accepted',       color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: <CheckCircle size={12} /> },
  rejected: { label: 'Rejected',       color: 'text-red-500 bg-red-50 border-red-200',             icon: <XCircle size={12} /> },
};

export default function FounderInvestorInterestPage() {
  const { user } = useAuthStore();
  const qc = useQueryClient();

  // Fetch all founder's startups
  const { data: startups = [], isLoading: startupsLoading } = useQuery<any[]>({
    queryKey: ['my-startups', user?._id],
    queryFn: () => apiClient.get('/founders/my/startups').then((r) => r.data),
    enabled: !!user?._id,
  });

  // Fetch interests for each startup in parallel
  const interestQueries = useQueries({
    queries: startups.map((s: any) => ({
      queryKey: ['funding-interests-startup', s._id],
      queryFn: () =>
        fundingInterestsApi.getByStartup(s._id).then((r) => ({
          startup: s,
          interests: r.data as any[],
        })),
      enabled: !!s._id,
    })),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      fundingInterestsApi.updateStatus(id, status as any),
    onSuccess: (_d, vars) => {
      startups.forEach((s: any) => {
        qc.invalidateQueries({ queryKey: ['funding-interests-startup', s._id] });
      });
      qc.invalidateQueries({ queryKey: ['funding-interests-summary'] });
    },
  });

  const isLoading = startupsLoading || interestQueries.some((q) => q.isLoading);

  // Flatten: array of { startup, interests[] }
  const groups = interestQueries
    .filter((q) => q.data && (q.data as any).interests?.length > 0)
    .map((q) => q.data as { startup: any; interests: any[] });

  const totalInterests = groups.reduce((s, g) => s + g.interests.length, 0);
  const totalPledged   = groups.reduce(
    (s, g) => s + g.interests.reduce((a: number, i: any) => a + i.amount, 0), 0,
  );
  const totalAccepted  = groups.reduce(
    (s, g) => s + g.interests.filter((i: any) => i.status === 'accepted').reduce((a: number, i: any) => a + i.amount, 0), 0,
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp size={20} className="text-violet-500" />
            Investor Interest
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Investors who have expressed funding interest in your startup(s)
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center gap-2 mb-1">
              <Users size={14} className="text-violet-400" />
              <p className="text-xs text-slate-400">Total Expressions</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{totalInterests}</p>
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
          <div className="space-y-4">
            {[1, 2].map((i) => <div key={i} className="h-40 rounded-xl bg-slate-100 animate-pulse" />)}
          </div>
        )}

        {/* No interests */}
        {!isLoading && groups.length === 0 && (
          <Card>
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <DollarSign size={32} className="text-slate-200" />
              <p className="text-slate-500 font-medium">No investor interest yet</p>
              <p className="text-slate-400 text-sm text-center">
                When investors express funding interest in your startup, they will appear here.
              </p>
            </div>
          </Card>
        )}

        {/* Grouped by startup */}
        {groups.map(({ startup, interests }) => {
          const pledged  = interests.reduce((a, i) => a + i.amount, 0);
          const accepted = interests.filter((i) => i.status === 'accepted').reduce((a, i) => a + i.amount, 0);
          const pending  = interests.filter((i) => i.status === 'pending').length;

          return (
            <div key={startup._id}>
              {/* Startup header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {startup.name?.[0]}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">{startup.name}</h2>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{interests.length} investor{interests.length !== 1 ? 's' : ''}</span>
                    <span>·</span>
                    <span className="text-violet-600 font-medium">{fmtAmount(pledged)} total pledged</span>
                    {accepted > 0 && (
                      <>
                        <span>·</span>
                        <span className="text-emerald-600 font-medium">{fmtAmount(accepted)} accepted</span>
                      </>
                    )}
                    {pending > 0 && (
                      <>
                        <span>·</span>
                        <span className="text-amber-600">{pending} pending</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Interest cards */}
              <div className="space-y-3">
                {interests.map((interest: any) => {
                  const meta = STATUS_META[interest.status] ?? STATUS_META['pending'];
                  const investorName = interest.investorId?.name ?? 'Investor';
                  const investorEmail = interest.investorId?.email ?? '';
                  const isPending = interest.status === 'pending';
                  const isUpdating = updateMutation.isPending && (updateMutation.variables as any)?.id === String(interest._id);

                  return (
                    <Card key={interest._id} className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-base flex-shrink-0">
                        {investorName?.[0]?.toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-800 text-sm">{investorName}</span>
                          {investorEmail && (
                            <span className="text-xs text-slate-400">{investorEmail}</span>
                          )}
                          <span className={clsx(
                            'inline-flex items-center gap-1 text-xs font-medium border rounded-full px-2 py-0.5',
                            meta.color,
                          )}>
                            {meta.icon} {meta.label}
                          </span>
                        </div>

                        <p className="text-xl font-black text-violet-700 mt-1">{fmtAmount(interest.amount)}</p>

                        {interest.message && (
                          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                            &ldquo;{interest.message}&rdquo;
                          </p>
                        )}

                        {interest.createdAt && (
                          <p className="text-xs text-slate-400 mt-1.5">
                            Submitted on {new Date(interest.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        )}
                      </div>

                      {/* Actions — only for pending */}
                      {isPending && (
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            loading={isUpdating}
                            onClick={() => updateMutation.mutate({ id: String(interest._id), status: 'accepted' })}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <CheckCircle size={13} className="mr-1" /> Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            loading={isUpdating}
                            onClick={() => updateMutation.mutate({ id: String(interest._id), status: 'rejected' })}
                            className="text-red-500 hover:bg-red-50"
                          >
                            <XCircle size={13} className="mr-1" /> Reject
                          </Button>
                        </div>
                      )}

                      {/* Accepted / Rejected icon */}
                      {!isPending && (
                        <div className="flex-shrink-0">
                          {interest.status === 'accepted'
                            ? <CheckCircle size={20} className="text-emerald-400" />
                            : <XCircle size={20} className="text-red-400" />}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
