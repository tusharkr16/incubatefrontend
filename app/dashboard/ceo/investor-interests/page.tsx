'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { fundingInterestsApi } from '@/lib/api';
import {
  DollarSign, Users, CheckCircle, Clock, XCircle,
  Building2, TrendingUp, ChevronDown, ChevronRight, Search,
} from 'lucide-react';
import { clsx } from 'clsx';

function fmtAmount(n: number) {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)} L`;
  if (n >= 1_000)      return `₹${(n / 1_000).toFixed(1)} K`;
  return `₹${n.toLocaleString()}`;
}

const STATUS_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:  { label: 'Pending',  color: 'text-amber-600 bg-amber-50 border-amber-200',       icon: <Clock size={11} /> },
  accepted: { label: 'Accepted', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: <CheckCircle size={11} /> },
  rejected: { label: 'Rejected', color: 'text-red-500 bg-red-50 border-red-200',             icon: <XCircle size={11} /> },
};

const STATUS_VARIANT: Record<string, any> = {
  active: 'success', inactive: 'warning', graduated: 'info', suspended: 'danger',
};

export default function CeoInvestorInterestsPage() {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch]     = useState('');

  const { data: raw = [], isLoading } = useQuery({
    queryKey: ['funding-interests-summary'],
    queryFn: () => fundingInterestsApi.getSummary().then((r) => r.data as any[]),
    staleTime: 30_000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      fundingInterestsApi.updateStatus(id, status as any),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['funding-interests-summary'] }),
  });

  const data = raw.filter((item: any) =>
    !search || item.startupName?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalStartups  = raw.length;
  const totalPledged   = raw.reduce((s: number, r: any) => s + r.totalAmount, 0);
  const totalAccepted  = raw.reduce((s: number, r: any) => s + r.acceptedAmount, 0);
  const totalPending   = raw.reduce((s: number, r: any) => s + r.pendingAmount, 0);

  function resolveInvestorName(item: any, investorId: string) {
    const found = item.investorUsers?.find((u: any) => String(u._id) === String(investorId));
    return found?.name ?? found?.email ?? 'Investor';
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp size={20} className="text-violet-500" />
            Investor Funding Interests
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            All funding interest expressed by investors across every startup
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <p className="text-xs text-slate-400 mb-1">Startups with Interest</p>
            <p className="text-2xl font-bold text-slate-900">{totalStartups}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign size={12} className="text-violet-400" />
              <p className="text-xs text-slate-400">Total Pledged</p>
            </div>
            <p className="text-2xl font-bold text-violet-600">{fmtAmount(totalPledged)}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle size={12} className="text-emerald-400" />
              <p className="text-xs text-slate-400">Accepted</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{fmtAmount(totalAccepted)}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-1.5 mb-1">
              <Clock size={12} className="text-amber-400" />
              <p className="text-xs text-slate-400">Pending Review</p>
            </div>
            <p className="text-2xl font-bold text-amber-600">{fmtAmount(totalPending)}</p>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search startup…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>

        {/* Table */}
        <Card padding={false}>
          {isLoading ? (
            <div className="py-16 text-center text-slate-400 text-sm">Loading…</div>
          ) : data.length === 0 ? (
            <div className="py-16 text-center">
              <Building2 size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No funding interests submitted yet</p>
            </div>
          ) : (
            <>
              {/* Header row */}
              <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide bg-slate-50 rounded-t-xl">
                <span className="col-span-4">Startup</span>
                <span className="col-span-2 text-right">Total Pledged</span>
                <span className="col-span-2 text-right">Accepted</span>
                <span className="col-span-2 text-right">Pending</span>
                <span className="col-span-1 text-center">Investors</span>
                <span className="col-span-1"></span>
              </div>

              <div className="divide-y divide-slate-100">
                {data.map((item: any) => {
                  const isOpen = expanded === String(item.startupId);
                  return (
                    <div key={String(item.startupId)}>
                      {/* Summary row */}
                      <div
                        onClick={() => setExpanded((p) => p === String(item.startupId) ? null : String(item.startupId))}
                        className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="col-span-4 flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {item.startupName?.[0] ?? '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 text-sm truncate">{item.startupName}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs text-slate-400 truncate">{item.sector?.primary}</span>
                              <Badge variant={STATUS_VARIANT[item.status] ?? 'default'} className="text-[10px] py-0">
                                {item.status}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-2 text-right">
                          <p className="text-sm font-bold text-violet-700">{fmtAmount(item.totalAmount)}</p>
                        </div>
                        <div className="col-span-2 text-right">
                          <p className={clsx('text-sm font-semibold', item.acceptedAmount > 0 ? 'text-emerald-600' : 'text-slate-300')}>
                            {item.acceptedAmount > 0 ? fmtAmount(item.acceptedAmount) : '—'}
                          </p>
                        </div>
                        <div className="col-span-2 text-right">
                          <p className={clsx('text-sm font-medium', item.pendingAmount > 0 ? 'text-amber-500' : 'text-slate-300')}>
                            {item.pendingAmount > 0 ? fmtAmount(item.pendingAmount) : '—'}
                          </p>
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            <Users size={10} /> {item.investorCount}
                          </span>
                        </div>
                        <div className="col-span-1 flex justify-end">
                          {isOpen
                            ? <ChevronDown size={16} className="text-violet-400" />
                            : <ChevronRight size={16} className="text-slate-300" />}
                        </div>
                      </div>

                      {/* Expanded — individual interests */}
                      {isOpen && (
                        <div className="px-6 pb-5 bg-slate-50 border-t border-slate-100">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide pt-4 mb-3">
                            Individual Funding Interests
                          </p>
                          <div className="space-y-3">
                            {(item.interests ?? []).map((interest: any, idx: number) => {
                              const meta = STATUS_META[interest.status] ?? STATUS_META['pending'];
                              const name = resolveInvestorName(item, interest.investorId);
                              const isPending = interest.status === 'pending';

                              return (
                                <div key={idx} className="flex items-start gap-3 bg-white rounded-xl border border-slate-100 p-4">
                                  <div className="w-9 h-9 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                    {name?.[0]?.toUpperCase() ?? 'I'}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-sm font-semibold text-slate-800">{name}</span>
                                      <span className={clsx('inline-flex items-center gap-1 text-xs font-medium border rounded-full px-2 py-0.5', meta.color)}>
                                        {meta.icon} {meta.label}
                                      </span>
                                    </div>
                                    <p className="text-lg font-bold text-violet-700 mt-0.5">{fmtAmount(interest.amount)}</p>
                                    {interest.message && (
                                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{interest.message}</p>
                                    )}
                                    {interest.createdAt && (
                                      <p className="text-xs text-slate-400 mt-1">
                                        {new Date(interest.createdAt).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                  {/* Admin can also accept/reject */}
                                  {isPending && (
                                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                                      <Button
                                        size="sm"
                                        loading={updateMutation.isPending && (updateMutation.variables as any)?.id === String(interest._id ?? idx)}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // We need the real _id — it may be stored in the sub-document
                                          // fallback: use interest id if available
                                          if (interest._id) updateMutation.mutate({ id: String(interest._id), status: 'accepted' });
                                        }}
                                      >
                                        <CheckCircle size={11} className="mr-1" /> Accept
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-500 hover:bg-red-50 text-xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (interest._id) updateMutation.mutate({ id: String(interest._id), status: 'rejected' });
                                        }}
                                      >
                                        <XCircle size={11} className="mr-1" /> Reject
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
