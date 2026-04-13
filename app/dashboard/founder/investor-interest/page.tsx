'use client';
import { useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { fundingInterestsApi } from '@/lib/api';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';
import {
  DollarSign, Users, CheckCircle, Clock, XCircle, Building2, TrendingUp,
  Phone, Link2, ExternalLink, PauseCircle, HelpCircle, MessageSquare,
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
  hold:     { label: 'On Hold',        color: 'text-blue-600 bg-blue-50 border-blue-200',          icon: <PauseCircle size={12} /> },
  enquire:  { label: 'Under Enquiry',  color: 'text-violet-600 bg-violet-50 border-violet-200',    icon: <HelpCircle size={12} /> },
};

const FINAL_STATUSES = new Set(['accepted', 'rejected']);

export default function FounderInvestorInterestPage() {
  const { user } = useAuthStore();
  const qc = useQueryClient();

  const { data: startups = [], isLoading: startupsLoading } = useQuery<any[]>({
    queryKey: ['my-startups', user?._id],
    queryFn: () => apiClient.get('/founders/my/startups').then((r) => r.data),
    enabled: !!user?._id,
  });

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
    onSuccess: () => {
      startups.forEach((s: any) => {
        qc.invalidateQueries({ queryKey: ['funding-interests-startup', s._id] });
      });
      qc.invalidateQueries({ queryKey: ['funding-interests-summary'] });
    },
  });

  const isLoading = startupsLoading || interestQueries.some((q) => q.isLoading);

  const groups = interestQueries
    .filter((q) => q.data && (q.data as any).interests?.length > 0)
    .map((q) => q.data as { startup: any; interests: any[] });

  const totalInterests = groups.reduce((s, g) => s + g.interests.length, 0);
  const totalPledged   = groups.reduce((s, g) => s + g.interests.reduce((a: number, i: any) => a + i.amount, 0), 0);
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
                  const investorName  = interest.investorId?.name ?? 'Investor';
                  const investorEmail = interest.investorId?.email ?? '';
                  const isFinal    = FINAL_STATUSES.has(interest.status);
                  const isUpdating = updateMutation.isPending && (updateMutation.variables as any)?.id === String(interest._id);

                  return (
                    <Card key={interest._id}>
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-11 h-11 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-base flex-shrink-0">
                          {investorName?.[0]?.toUpperCase()}
                        </div>

                        {/* Info block */}
                        <div className="flex-1 min-w-0 space-y-2">

                          {/* Name + status */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-800">{investorName}</span>
                            <span className={clsx(
                              'inline-flex items-center gap-1 text-xs font-medium border rounded-full px-2 py-0.5',
                              meta.color,
                            )}>
                              {meta.icon} {meta.label}
                            </span>
                          </div>

                          {/* Amount */}
                          <p className="text-2xl font-black text-violet-700">{fmtAmount(interest.amount)}</p>

                          {/* Contact details */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            {investorEmail && (
                              <a href={`mailto:${investorEmail}`} className="flex items-center gap-1 hover:text-violet-600 transition-colors">
                                <Building2 size={11} /> {investorEmail}
                              </a>
                            )}
                            {interest.phone && (
                              <a href={`tel:${interest.phone}`} className="flex items-center gap-1 hover:text-violet-600 transition-colors">
                                <Phone size={11} /> {interest.phone}
                              </a>
                            )}
                            {interest.contactUrl && (
                              <a
                                href={interest.contactUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-violet-600 transition-colors"
                              >
                                <Link2 size={11} />
                                {interest.contactUrl.replace(/^https?:\/\/(www\.)?/, '').split('/').slice(0, 2).join('/')}
                                <ExternalLink size={9} />
                              </a>
                            )}
                          </div>

                          {/* Note / message */}
                          {interest.message && (
                            <div className="flex items-start gap-1.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5">
                              <MessageSquare size={12} className="text-slate-400 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-slate-600 leading-relaxed">&ldquo;{interest.message}&rdquo;</p>
                            </div>
                          )}

                          {interest.createdAt && (
                            <p className="text-xs text-slate-400">
                              Submitted {new Date(interest.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex-shrink-0">
                          {isFinal ? (
                            /* Accepted / Rejected — read-only icon */
                            interest.status === 'accepted'
                              ? <CheckCircle size={22} className="text-emerald-400" />
                              : <XCircle size={22} className="text-red-400" />
                          ) : (
                            /* Active statuses — show all three actions */
                            <div className="flex flex-col gap-2 min-w-[110px]">
                              <button
                                disabled={interest.status === 'accepted' || isUpdating}
                                onClick={() => updateMutation.mutate({ id: String(interest._id), status: 'accepted' })}
                                className={clsx(
                                  'flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                                  interest.status === 'accepted'
                                    ? 'bg-emerald-100 text-emerald-700 cursor-default'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white',
                                )}
                              >
                                <CheckCircle size={12} /> Accept
                              </button>
                              <button
                                disabled={interest.status === 'hold' || isUpdating}
                                onClick={() => updateMutation.mutate({ id: String(interest._id), status: 'hold' })}
                                className={clsx(
                                  'flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                                  interest.status === 'hold'
                                    ? 'bg-blue-100 text-blue-700 border-blue-200 cursor-default'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600',
                                )}
                              >
                                <PauseCircle size={12} /> Hold
                              </button>
                              <button
                                disabled={interest.status === 'enquire' || isUpdating}
                                onClick={() => updateMutation.mutate({ id: String(interest._id), status: 'enquire' })}
                                className={clsx(
                                  'flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                                  interest.status === 'enquire'
                                    ? 'bg-violet-100 text-violet-700 border-violet-200 cursor-default'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600',
                                )}
                              >
                                <HelpCircle size={12} /> Enquire
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
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
