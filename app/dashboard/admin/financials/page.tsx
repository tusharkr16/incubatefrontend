'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { financialsApi } from '@/lib/api';
import {
  DollarSign, TrendingUp, Clock, CheckCircle, Search,
  ChevronRight, Building2, Filter,
} from 'lucide-react';
import { clsx } from 'clsx';

const STATUS_COLOR: Record<string, any> = {
  active: 'success', inactive: 'warning', graduated: 'info', suspended: 'danger',
};

function fmt(amount: number, currency = 'INR') {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)}Cr`;
  if (amount >= 100_000)    return `₹${(amount / 100_000).toFixed(2)}L`;
  if (amount >= 1_000)      return `₹${(amount / 1_000).toFixed(1)}K`;
  return `₹${amount.toLocaleString()}`;
}

function AmountBar({ disbursed, approved, pending, total }: {
  disbursed: number; approved: number; pending: number; total: number;
}) {
  if (!total) return null;
  const d = (disbursed / total) * 100;
  const a = (approved / total) * 100;
  const p = (pending  / total) * 100;
  return (
    <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-100 gap-px">
      {d > 0 && <div className="bg-emerald-500 transition-all" style={{ width: `${d}%` }} />}
      {a > 0 && <div className="bg-blue-400 transition-all"   style={{ width: `${a}%` }} />}
      {p > 0 && <div className="bg-amber-400 transition-all"  style={{ width: `${p}%` }} />}
    </div>
  );
}

export default function AdminFinancialsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');

  const { data: raw = [], isLoading } = useQuery({
    queryKey: ['funded-startups'],
    queryFn: () => financialsApi.getFundedStartups().then((r) => r.data as any[]),
  });

  const data = raw.filter((s: any) => {
    const matchSearch = !search || s.startupName.toLowerCase().includes(search.toLowerCase());
    const matchStage  = !stageFilter || s.stage === stageFilter;
    return matchSearch && matchStage;
  });

  // Summary totals
  const totalDisbursed = raw.reduce((s: number, r: any) => s + r.disbursedAmount, 0);
  const totalApproved  = raw.reduce((s: number, r: any) => s + r.approvedAmount,  0);
  const totalPending   = raw.reduce((s: number, r: any) => s + r.pendingAmount,   0);
  const totalStartups  = raw.length;

  const stages = [...new Set(raw.map((r: any) => r.stage).filter(Boolean))] as string[];

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <DollarSign size={20} className="text-violet-500" />
            Funded Startups
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            All startups that have received or pending funding disbursements
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <p className="text-xs text-slate-400 mb-1">Startups Funded</p>
            <p className="text-2xl font-bold text-slate-900">{totalStartups}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-xs text-slate-400">Total Disbursed</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{fmt(totalDisbursed)}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <p className="text-xs text-slate-400">Approved (pending transfer)</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">{fmt(totalApproved)}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <p className="text-xs text-slate-400">Pending Approval</p>
            </div>
            <p className="text-2xl font-bold text-amber-600">{fmt(totalPending)}</p>
          </Card>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Disbursed</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-400 inline-block" /> Approved</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" /> Pending</span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by startup name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
          {stages.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300"
              >
                <option value="">All stages</option>
                {stages.map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Table */}
        <Card padding={false}>
          {isLoading ? (
            <div className="py-16 text-center text-slate-400 text-sm">Loading financials…</div>
          ) : data.length === 0 ? (
            <div className="py-16 text-center">
              <Building2 size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No funded startups found</p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide bg-slate-50 rounded-t-xl">
                <span className="col-span-3">Startup</span>
                <span className="col-span-2">Sector / Stage</span>
                <span className="col-span-2 text-right">Total Allocated</span>
                <span className="col-span-2 text-right">Disbursed</span>
                <span className="col-span-1 text-right">Pending</span>
                <span className="col-span-1 text-center">Records</span>
                <span className="col-span-1"></span>
              </div>

              <div className="divide-y divide-slate-100">
                {data.map((item: any) => (
                  <div
                    key={item.startupId}
                    onClick={() => router.push(`/dashboard/ceo/startups/${item.startupId}`)}
                    className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    {/* Startup name */}
                    <div className="col-span-3 flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {item.startupName?.[0] ?? '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{item.startupName}</p>
                        <p className="text-xs text-slate-400">Cohort {item.cohortYear}</p>
                      </div>
                    </div>

                    {/* Sector / Stage */}
                    <div className="col-span-2 flex flex-col gap-1">
                      <span className="text-xs text-slate-600 truncate">{item.sector?.primary}</span>
                      <Badge variant="outline" className="text-xs w-fit">{item.stage?.replace('_', ' ')}</Badge>
                    </div>

                    {/* Total allocated + bar */}
                    <div className="col-span-2 text-right">
                      <p className="text-sm font-semibold text-slate-900">{fmt(item.totalAmount, item.currency)}</p>
                      <div className="mt-1.5">
                        <AmountBar
                          disbursed={item.disbursedAmount}
                          approved={item.approvedAmount}
                          pending={item.pendingAmount}
                          total={item.totalAmount}
                        />
                      </div>
                    </div>

                    {/* Disbursed */}
                    <div className="col-span-2 text-right">
                      <p className={clsx(
                        'text-sm font-bold',
                        item.disbursedAmount > 0 ? 'text-emerald-600' : 'text-slate-300',
                      )}>
                        {fmt(item.disbursedAmount, item.currency)}
                      </p>
                      {item.disbursedAmount > 0 && (
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center justify-end gap-1">
                          <CheckCircle size={10} className="text-emerald-400" />
                          {Math.round((item.disbursedAmount / item.totalAmount) * 100)}% of total
                        </p>
                      )}
                    </div>

                    {/* Pending */}
                    <div className="col-span-1 text-right">
                      <p className={clsx(
                        'text-sm font-medium',
                        item.pendingAmount > 0 ? 'text-amber-600' : 'text-slate-300',
                      )}>
                        {item.pendingAmount > 0 ? fmt(item.pendingAmount, item.currency) : '—'}
                      </p>
                    </div>

                    {/* Record count */}
                    <div className="col-span-1 text-center">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        <TrendingUp size={10} /> {item.recordCount}
                      </span>
                    </div>

                    {/* Arrow */}
                    <div className="col-span-1 flex justify-end">
                      <ChevronRight size={16} className="text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

      </div>
    </DashboardLayout>
  );
}
