'use client';
import { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Award, ArrowRight, Search, Sparkles } from 'lucide-react';
import { GRANTS, GRANT_STATUS_COLORS, GRANT_STATUS_LABELS } from '@/lib/data/grants';
import { useQuery } from '@tanstack/react-query';
import { grantsApi } from '@/lib/api';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';
import { ExpertChatWidget } from '@/components/ExpertChatWidget';

function GrantCard({ grant, appliedStatus }: { grant: typeof GRANTS[0]; appliedStatus?: string }) {
  return (
    <Link href={`/dashboard/grants/${grant.id}`}>
      <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-violet-300 transition-all cursor-pointer group h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${grant.badgeColor}`}>
            {grant.badge}
          </span>
          {appliedStatus ? (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${GRANT_STATUS_COLORS[appliedStatus]}`}>
              {GRANT_STATUS_LABELS[appliedStatus]}
            </span>
          ) : (
            <span className="text-xs text-slate-400 border border-slate-200 px-2.5 py-1 rounded-full">Not started</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-violet-700 transition-colors">
          {grant.name}
        </h3>
        <p className="text-xs text-slate-500 mb-3">{grant.ministry}</p>

        {/* Amount */}
        <div className="bg-violet-50 rounded-lg px-3 py-2 mb-3">
          <p className="text-xs text-violet-500 font-medium">Grant Amount</p>
          <p className="text-sm font-bold text-violet-800">{grant.amount}</p>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed flex-1 line-clamp-3">{grant.description}</p>

        {/* Sectors */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {grant.sector.slice(0, 3).map((s) => (
            <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">{grant.deadline}</span>
          <span className="text-xs text-violet-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
            View details <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function GrantsPage() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');

  const { data: myStartups } = useQuery<any[]>({
    queryKey: ['my-startups-grants', user?._id],
    queryFn: () => apiClient.get('/founders/my/startups').then((r) => r.data),
    enabled: user?.role === 'founder',
  });
  const startupId: string | undefined = myStartups?.[0]?._id;

  const { data: myApplications } = useQuery({
    queryKey: ['grant-applications', startupId],
    queryFn: () => grantsApi.getByStartup(startupId!).then((r) => r.data as any[]),
    enabled: !!startupId,
  });

  const appliedMap: Record<string, string> = {};
  (myApplications ?? []).forEach((a: any) => { appliedMap[a.grantId] = a.status; });

  const allSectors = ['All', ...Array.from(new Set(GRANTS.flatMap((g) => g.sector)))];

  const filtered = GRANTS.filter((g) => {
    const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.ministry.toLowerCase().includes(search.toLowerCase());
    const matchSector = sectorFilter === 'All' || g.sector.includes(sectorFilter);
    return matchSearch && matchSector;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Hero */}
        <div className="bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl px-8 py-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award size={18} className="text-violet-200" />
                <span className="text-violet-200 text-xs font-bold tracking-widest uppercase">IncubatxGrants</span>
              </div>
              <h1 className="text-2xl font-bold">Government Grant Directory</h1>
              <p className="text-violet-200 text-sm mt-1">
                Explore {GRANTS.length} curated government grants. Click any card to view eligibility, process, and apply.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-center">
                <p className="text-2xl font-bold">{GRANTS.length}</p>
                <p className="text-violet-200 text-xs mt-0.5">Grants listed</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-center">
                <p className="text-2xl font-bold">{Object.keys(appliedMap).length}</p>
                <p className="text-violet-200 text-xs mt-0.5">Applied</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search grants by name or ministry..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {allSectors.slice(0, 6).map((s) => (
              <button
                key={s}
                onClick={() => setSectorFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  sectorFilter === s
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Grant Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((grant) => (
            <GrantCard key={grant.id} grant={grant} appliedStatus={appliedMap[grant.id]} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Award size={40} className="mx-auto mb-3 opacity-30" />
            <p>No grants match your search.</p>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-br from-slate-900 to-violet-950 rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-violet-400" />
              <span className="text-violet-400 text-xs font-bold tracking-widest uppercase">AI-Powered</span>
            </div>
            <p className="text-white font-semibold">Ask GrantsGPT anything</p>
            <p className="text-slate-400 text-sm mt-1">
              Instant answers on eligibility, documents, and application process — powered by Claude AI.
            </p>
          </div>
          <button
            onClick={() => {
              (document.querySelector('[aria-label="Toggle GrantsGPT"]') as HTMLButtonElement)?.click();
            }}
            className="relative flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap shadow-lg shadow-violet-900/40"
          >
            <Sparkles size={14} /> Talk to GrantsGPT
          </button>
        </div>

      </div>

      {/* Floating AI chat widget */}
      <ExpertChatWidget />

    </DashboardLayout>
  );
}
