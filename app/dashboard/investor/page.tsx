'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreBar } from '@/components/startups/ScoreBar';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { startupsApi } from '@/lib/api/startups';
import { fundingInterestsApi } from '@/lib/api';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';
import {
  Search, SlidersHorizontal, X, Building2, Globe,
  Calendar, ChevronDown, Star, DollarSign, TrendingUp,
  ExternalLink, Users, CheckCircle, Info,
} from 'lucide-react';
import { clsx } from 'clsx';

// ── constants ──────────────────────────────────────────────────────────────

const INDUSTRIES = [
  'EdTech', 'FinTech', 'HealthTech / MedTech', 'AgriTech', 'CleanTech / GreenTech',
  'PropTech', 'LegalTech', 'HRTech', 'RetailTech', 'LogisticsTech',
  'FoodTech', 'TravelTech', 'Cybersecurity', 'AI / ML', 'SaaS',
  'E-Commerce', 'IoT', 'Blockchain / Web3', 'Gaming', 'MediaTech', 'Other',
];

const STAGES = [
  { value: 'validation',     label: 'Validation' },
  { value: 'pre_revenue',    label: 'Pre Revenue' },
  { value: 'prototype',      label: 'Prototype' },
  { value: 'mvp',            label: 'MVP' },
  { value: 'pilot',          label: 'Pilot' },
  { value: 'revenue_model',  label: 'Revenue Model' },
  { value: 'early_traction', label: 'Early Traction' },
  { value: 'revenue_stage',  label: 'Revenue Stage' },
  { value: 'scaling',        label: 'Scaling' },
  { value: 'ideation',       label: 'Ideation' },
  { value: 'growth',         label: 'Growth' },
  { value: 'scale',          label: 'Scale' },
];

const STATUSES = [
  { value: 'active',     label: 'Active' },
  { value: 'inactive',   label: 'Inactive' },
  { value: 'graduated',  label: 'Graduated' },
  { value: 'suspended',  label: 'Suspended' },
];

const STATUS_VARIANT: Record<string, any> = {
  active: 'success', inactive: 'warning', graduated: 'info', suspended: 'danger',
};

const SCORE_PARAMS = [
  { key: 'sector',           label: 'Sector Relevance' },
  { key: 'stage',            label: 'Stage Fit' },
  { key: 'founderStrength',  label: 'Founder Strength' },
  { key: 'incorporation',    label: 'Legal Readiness' },
  { key: 'problemMarket',    label: 'Problem-Market Fit' },
  { key: 'gtm',              label: 'Go-to-Market Strategy' },
  { key: 'marketValidation', label: 'Market Validation' },
] as const;

type ScoreKey = (typeof SCORE_PARAMS)[number]['key'];

const EMPTY_SCORES: Record<ScoreKey, number> = {
  sector: 5, stage: 5, founderStrength: 5, incorporation: 5,
  problemMarket: 5, gtm: 5, marketValidation: 5,
};

function fmtAmount(n: number) {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)} L`;
  if (n >= 1_000)      return `₹${(n / 1_000).toFixed(1)} K`;
  return `₹${n.toLocaleString()}`;
}

// ── page ───────────────────────────────────────────────────────────────────

export default function InvestorDashboard() {
  const { user } = useAuthStore();
  const qc = useQueryClient();

  // Filters
  const [search, setSearch]         = useState('');
  const [sector, setSector]         = useState('');
  const [stage, setStage]           = useState('');
  const [status, setStatus]         = useState('');
  const [cohortYear, setCohortYear] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Detail modal
  const [detailStartup, setDetailStartup] = useState<any>(null);
  const [detailTab, setDetailTab]         = useState<'info' | 'invest' | 'evaluate'>('info');

  // Funding interest form
  const [fundAmount, setFundAmount]   = useState('');
  const [fundMessage, setFundMessage] = useState('');
  const [fundError, setFundError]     = useState('');
  const [fundSuccess, setFundSuccess] = useState(false);

  // Evaluation form
  const [scores, setScores]               = useState<Record<ScoreKey, number>>(EMPTY_SCORES);
  const [notes, setNotes]                 = useState('');
  const [recommendation, setRecommendation] = useState('neutral');
  const [evalError, setEvalError]         = useState('');

  const params: Record<string, any> = { limit: 60 };
  if (sector) params.sector = sector;
  if (stage) params.stage = stage;
  if (status) params.status = status;
  if (cohortYear) params.cohortYear = cohortYear;
  if (search) params.search = search;

  const { data, isLoading } = useQuery({
    queryKey: ['all-startups', params],
    queryFn: () => startupsApi.getAll(params).then((r) => r.data),
    staleTime: 20_000,
  });

  const startups: any[] = data?.startups ?? [];
  const total: number   = data?.total ?? 0;

  // ── funding interest mutation ────────────────────────────────────────────
  const fundMutation = useMutation({
    mutationFn: (payload: any) => fundingInterestsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['funding-interests-summary'] });
      setFundSuccess(true);
      setFundError('');
    },
    onError: (err: any) => {
      setFundError(err?.response?.data?.message ?? 'Failed to submit interest.');
    },
  });

  // ── evaluation mutation ──────────────────────────────────────────────────
  const evalMutation = useMutation({
    mutationFn: (payload: any) => apiClient.post('/evaluations', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['all-startups'] });
      setEvalError('');
      closeDetail();
    },
    onError: (err: any) => {
      setEvalError(err?.response?.data?.message ?? 'Submission failed. Try again.');
    },
  });

  function openDetail(startup: any) {
    setDetailStartup(startup);
    setDetailTab('info');
    setFundAmount('');
    setFundMessage('');
    setFundError('');
    setFundSuccess(false);
    setScores(EMPTY_SCORES);
    setNotes('');
    setRecommendation('neutral');
    setEvalError('');
  }

  function closeDetail() {
    setDetailStartup(null);
  }

  function handleFundSubmit() {
    if (!detailStartup) return;
    const amt = Number(fundAmount);
    if (!amt || amt <= 0) { setFundError('Enter a valid amount.'); return; }
    setFundError('');
    fundMutation.mutate({
      startupId: detailStartup._id,
      amount: amt,
      message: fundMessage || undefined,
    });
  }

  function handleEvalSubmit() {
    if (!detailStartup) return;
    setEvalError('');
    evalMutation.mutate({
      startupId: detailStartup._id,
      scores,
      notes: notes || undefined,
      recommendation,
    });
  }

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const hasFilters = !!(sector || stage || status || cohortYear || search);

  function clearFilters() {
    setSearch(''); setSector(''); setStage(''); setStatus(''); setCohortYear('');
  }

  const selectCls = clsx(
    'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white',
    'focus:outline-none focus:ring-2 focus:ring-violet-300 cursor-pointer appearance-none',
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">All Startups</h1>
            <p className="text-slate-500 text-sm mt-1">Browse and invest in startups · {user?.name}</p>
          </div>
          {total > 0 && (
            <span className="text-sm text-slate-400 bg-slate-100 rounded-full px-3 py-1">
              {total} startup{total !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Search + Filter bar */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                placeholder="Search startups…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={13} />
                </button>
              )}
            </div>

            <Button variant={showFilters ? 'secondary' : 'ghost'} size="sm" onClick={() => setShowFilters((v) => !v)}>
              <SlidersHorizontal size={14} className="mr-1.5" />
              Filters
              {hasFilters && (
                <span className="ml-1.5 w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {[sector, stage, status, cohortYear].filter(Boolean).length}
                </span>
              )}
            </Button>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X size={13} className="mr-1" /> Clear
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="relative">
                <select className={selectCls} value={sector} onChange={(e) => setSector(e.target.value)}>
                  <option value="">All Industries</option>
                  {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select className={selectCls} value={stage} onChange={(e) => setStage(e.target.value)}>
                  <option value="">All Stages</option>
                  {STAGES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select className={selectCls} value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="">All Statuses</option>
                  {STATUSES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <input
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                type="number" placeholder="Cohort year" min={2000} max={2100}
                value={cohortYear} onChange={(e) => setCohortYear(e.target.value)}
              />
            </div>
          )}
        </div>

        {hasFilters && (
          <div className="flex flex-wrap gap-2">
            {sector && <Chip label={sector} onRemove={() => setSector('')} />}
            {stage && <Chip label={STAGES.find((s) => s.value === stage)?.label ?? stage} onRemove={() => setStage('')} />}
            {status && <Chip label={status} onRemove={() => setStatus('')} />}
            {cohortYear && <Chip label={`Cohort ${cohortYear}`} onRemove={() => setCohortYear('')} />}
          </div>
        )}

        {/* Startup grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-52 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : startups.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Building2 size={28} className="text-slate-200" />
              <p className="text-slate-400 font-medium">No startups found</p>
              {hasFilters && (
                <button onClick={clearFilters} className="text-violet-500 text-sm hover:underline">Clear filters</button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {startups.map((s: any) => (
              <StartupCard key={s._id} startup={s} onClick={() => openDetail(s)} />
            ))}
          </div>
        )}
      </div>

      {/* ── Company Detail / Invest / Evaluate Modal ────────────────────── */}
      <Modal
        open={!!detailStartup}
        onClose={closeDetail}
        title={detailStartup?.name ?? ''}
        size="lg"
      >
        {detailStartup && (
          <div className="space-y-4">
            {/* Tab bar */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
              {([
                { id: 'info',     label: 'Company Info', icon: <Info size={13} /> },
                { id: 'invest',   label: 'Express Interest', icon: <DollarSign size={13} /> },
                { id: 'evaluate', label: 'Evaluate',    icon: <Star size={13} /> },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id)}
                  className={clsx(
                    'flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
                    detailTab === tab.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700',
                  )}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* ── Company Info Tab ── */}
            {detailTab === 'info' && (
              <div className="space-y-4 max-h-[62vh] overflow-y-auto pr-1">
                {/* Header row */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-violet-100 flex items-center justify-center text-2xl font-black text-violet-600 flex-shrink-0">
                    {detailStartup.name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-slate-900">{detailStartup.name}</h2>
                    {detailStartup.schemeName && (
                      <p className="text-sm text-slate-400">{detailStartup.schemeName}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <Badge variant="info">{detailStartup.sector?.primary}</Badge>
                      <Badge variant="outline">{detailStartup.stage?.replace('_', ' ')}</Badge>
                      <Badge variant={STATUS_VARIANT[detailStartup.status] ?? 'default'}>{detailStartup.status}</Badge>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-400">Score</p>
                    <p className="text-3xl font-black text-violet-600 leading-none">{detailStartup.latestScore ?? 0}</p>
                    <p className="text-xs text-slate-400">/100</p>
                  </div>
                </div>

                <ScoreBar score={detailStartup.latestScore ?? 0} label="" />

                {detailStartup.description && (
                  <p className="text-sm text-slate-600 leading-relaxed">{detailStartup.description}</p>
                )}

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3">
                  <InfoRow label="Cohort Year" value={detailStartup.cohortYear} />
                  <InfoRow label="Sector Tags" value={detailStartup.sector?.tags?.join(', ')} />
                  {detailStartup.incorporationDate && (
                    <InfoRow label="Incorporated" value={new Date(detailStartup.incorporationDate).toLocaleDateString()} />
                  )}
                  {detailStartup.cinNumber && (
                    <InfoRow label="CIN" value={detailStartup.cinNumber} />
                  )}
                  {detailStartup.fundingSecured > 0 && (
                    <InfoRow label="Funding Secured" value={fmtAmount(detailStartup.fundingSecured)} />
                  )}
                  {detailStartup.fundingScheme && (
                    <InfoRow label="Funding Scheme" value={detailStartup.fundingScheme} />
                  )}
                </div>

                {/* Links */}
                <div className="flex gap-3 flex-wrap">
                  {detailStartup.website && (
                    <a href={detailStartup.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-violet-600 hover:underline">
                      <Globe size={14} /> Website <ExternalLink size={11} />
                    </a>
                  )}
                  {detailStartup.pitchDeckLink && (
                    <a href={detailStartup.pitchDeckLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-violet-600 hover:underline">
                      <TrendingUp size={14} /> Pitch Deck <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* ── Express Interest Tab ── */}
            {detailTab === 'invest' && (
              <div className="space-y-5 max-h-[62vh] overflow-y-auto pr-1">
                {fundSuccess ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <CheckCircle size={40} className="text-emerald-500" />
                    <p className="text-lg font-semibold text-slate-800">Interest Submitted!</p>
                    <p className="text-sm text-slate-400 text-center">
                      Your funding interest in <strong>{detailStartup.name}</strong> has been recorded.
                      The incubator team will review it.
                    </p>
                    <Button variant="secondary" size="sm" onClick={() => setFundSuccess(false)}>
                      Update Amount
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-violet-50 border border-violet-100 rounded-xl text-sm text-violet-700">
                      Express your funding interest in <strong>{detailStartup.name}</strong>. The incubator team will review and coordinate next steps.
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                        Funding Amount (INR) <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
                        <input
                          type="number"
                          min={1}
                          placeholder="e.g. 5000000"
                          value={fundAmount}
                          onChange={(e) => setFundAmount(e.target.value)}
                          className="w-full pl-7 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                        />
                      </div>
                      {fundAmount && Number(fundAmount) > 0 && (
                        <p className="text-xs text-slate-400 mt-1">{fmtAmount(Number(fundAmount))}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                        Message <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <textarea
                        placeholder="Why are you interested in this startup? Any conditions or milestones attached?"
                        value={fundMessage}
                        onChange={(e) => setFundMessage(e.target.value)}
                        rows={4}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300"
                      />
                    </div>

                    {fundError && (
                      <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{fundError}</p>
                    )}

                    <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                      <Button variant="secondary" onClick={closeDetail}>Cancel</Button>
                      <Button onClick={handleFundSubmit} loading={fundMutation.isPending}>
                        <DollarSign size={14} className="mr-1" /> Submit Interest
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Evaluate Tab ── */}
            {detailTab === 'evaluate' && (
              <div className="space-y-5 max-h-[62vh] overflow-y-auto pr-1">
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Score each parameter (0 – 10)
                  </p>
                  {SCORE_PARAMS.map(({ key, label }) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-700 font-medium">{label}</span>
                        <span className="font-bold text-violet-600">{scores[key]}/10</span>
                      </div>
                      <input
                        type="range" min={0} max={10} step={1}
                        value={scores[key]}
                        onChange={(e) => setScores((prev) => ({ ...prev, [key]: +e.target.value }))}
                        className="w-full accent-violet-600"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between py-3 border-t border-b border-slate-100">
                  <span className="text-sm font-semibold text-slate-700">Total Score</span>
                  <span className="text-2xl font-black text-violet-600">
                    {totalScore}<span className="text-sm font-normal text-slate-400">/70</span>
                  </span>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Recommendation</label>
                  <select
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  >
                    <option value="strongly_recommend">Strongly Recommend</option>
                    <option value="recommend">Recommend</option>
                    <option value="neutral">Neutral</option>
                    <option value="not_recommend">Not Recommend</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                    Notes <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    placeholder="Share your observations…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300"
                  />
                </div>

                {evalError && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{evalError}</p>
                )}

                <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                  <Button variant="secondary" onClick={closeDetail}>Cancel</Button>
                  <Button onClick={handleEvalSubmit} loading={evalMutation.isPending}>
                    <Star size={14} className="mr-1" /> Submit Evaluation
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}

// ── sub-components ──────────────────────────────────────────────────────────

function StartupCard({ startup, onClick }: { startup: any; onClick: () => void }) {
  const score = startup.latestScore ?? 0;
  return (
    <Card
      className="flex flex-col gap-4 cursor-pointer hover:shadow-md hover:border-violet-200 transition-all group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-900 text-base leading-tight truncate group-hover:text-violet-700 transition-colors">
            {startup.name}
          </h3>
          {startup.schemeName && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">{startup.schemeName}</p>
          )}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <Badge variant="info">{startup.sector?.primary}</Badge>
            <Badge variant="outline">{startup.stage?.replace('_', ' ')}</Badge>
            <Badge variant={STATUS_VARIANT[startup.status] ?? 'default'}>{startup.status}</Badge>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-slate-400">Score</p>
          <p className="text-2xl font-black text-violet-600 leading-none mt-0.5">{score}</p>
          <p className="text-xs text-slate-400">/100</p>
        </div>
      </div>

      <ScoreBar score={score} label="" />

      {startup.description && (
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 -mt-1">{startup.description}</p>
      )}

      <div className="flex items-center gap-2 pt-1 border-t border-slate-50">
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <Calendar size={11} /> {startup.cohortYear}
        </span>
        {startup.fundingSecured > 0 && (
          <span className="text-xs text-emerald-600 font-medium">
            {fmtAmount(startup.fundingSecured)} secured
          </span>
        )}
        {startup.website && (
          <a
            href={startup.website} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-violet-500 transition-colors"
          >
            <Globe size={11} /> Website
          </a>
        )}
        <span className="ml-auto text-xs text-slate-400 group-hover:text-violet-500 transition-colors font-medium">
          View details →
        </span>
      </div>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: any }) {
  if (!value) return null;
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200 rounded-full px-3 py-1">
      {label}
      <button onClick={onRemove} className="hover:text-violet-900"><X size={11} /></button>
    </span>
  );
}
