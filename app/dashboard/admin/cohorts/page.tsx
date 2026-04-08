'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { FormField, inputCls } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { cohortsApi } from '@/lib/api';
import { clsx } from 'clsx';
import {
  Plus, Layers, Calendar, Users, Tag, ExternalLink, Copy,
  CheckCircle, Loader2, Sparkles, Download, ChevronRight,
  Lock, Unlock, ArrowRight,
} from 'lucide-react';

// ── Constants ────────────────────────────────────────────────────────────────
const CURRENT_YEAR = new Date().getFullYear();
const SECTORS = [
  'FinTech', 'HealthTech', 'EdTech', 'AgriTech', 'CleanTech',
  'LogisTech', 'RetailTech', 'LegalTech', 'HRTech', 'AI/ML',
  'Web3', 'SaaS', 'DeepTech', 'Other',
];
const EMPTY_FORM = {
  name: '', year: CURRENT_YEAR, description: '', tagline: '',
  sectors: [] as string[], applicationDeadline: '', maxStartups: 20,
};
const FRONTEND_ORIGIN = typeof window !== 'undefined' ? window.location.origin : '';

const STATUS_STYLES: Record<string, string> = {
  open:   'bg-emerald-100 text-emerald-700',
  closed: 'bg-red-100 text-red-600',
  draft:  'bg-slate-100 text-slate-500',
};

// ── Poster canvas fallback ────────────────────────────────────────────────────
function generateCanvasPoster(cohort: { name: string; year: number; tagline?: string; sectors?: string[]; description?: string }) {
  const W = 1200, H = 800;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#1e1b4b'); bg.addColorStop(0.5, '#312e81'); bg.addColorStop(1, '#4c1d95');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.font = `bold 72px sans-serif`; ctx.fillStyle = '#ffffff';
  ctx.fillText(cohort.name.toUpperCase(), 96, 230);
  ctx.font = '22px sans-serif'; ctx.fillStyle = '#a78bfa';
  ctx.fillText(cohort.tagline || `Cohort ${cohort.year}`, 96, 275);
  const barGrad = ctx.createLinearGradient(0, H - 44, W, H);
  barGrad.addColorStop(0, '#7c3aed'); barGrad.addColorStop(1, '#4f46e5');
  ctx.fillStyle = barGrad; ctx.fillRect(0, H - 44, W, 44);
  ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = '#ffffff';
  ctx.fillText('incubateX — Build. Launch. Scale.', 40, H - 17);
  return canvas.toDataURL('image/png');
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  return (
    <span className={clsx('text-xs font-bold px-2.5 py-1 rounded-full capitalize', STATUS_STYLES[status] ?? STATUS_STYLES.draft)}>
      {status}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={copy} className="text-xs border border-slate-200 text-slate-500 hover:bg-slate-50 px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1">
      {copied ? <><CheckCircle size={10} className="text-emerald-500" /> Copied</> : <><Copy size={10} /> Copy</>}
    </button>
  );
}

// ── Cohort card (clickable → detail page) ────────────────────────────────────
function CohortCard({ cohort }: { cohort: any }) {
  const appLink = cohort.googleFormUrl || `${FRONTEND_ORIGIN}/apply/${cohort._id}`;

  return (
    <Link href={`/dashboard/admin/cohorts/${cohort._id}`} className="block group">
      <Card padding={false} className="overflow-hidden hover:border-violet-200 hover:shadow-md transition-all cursor-pointer">
        {/* Top gradient accent */}
        <div className="h-1 w-full bg-gradient-to-r from-violet-600 to-indigo-600" />

        <div className="p-5 space-y-3">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white flex items-center justify-center text-base font-black flex-shrink-0 shadow-sm">
              {String(cohort.year).slice(2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-slate-900 text-base leading-tight group-hover:text-violet-700 transition-colors">{cohort.name}</p>
                <StatusBadge status={cohort.status} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <Calendar size={10} /> Cohort {cohort.year}
                {cohort.maxStartups && <><span className="mx-1">·</span><Users size={10} /> {cohort.maxStartups} max</>}
              </p>
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-violet-500 flex-shrink-0 mt-1 transition-colors" />
          </div>

          {/* Tagline */}
          {cohort.tagline && (
            <p className="text-xs text-slate-500 italic line-clamp-1">&ldquo;{cohort.tagline}&rdquo;</p>
          )}

          {/* Sectors */}
          {cohort.sectors?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {cohort.sectors.slice(0, 4).map((s: string) => (
                <span key={s} className="text-[10px] bg-violet-50 text-violet-600 border border-violet-100 rounded-full px-2 py-0.5">{s}</span>
              ))}
              {cohort.sectors.length > 4 && (
                <span className="text-[10px] text-slate-400">+{cohort.sectors.length - 4} more</span>
              )}
            </div>
          )}

          {/* Footer row */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-50">
            {cohort.applicationDeadline ? (
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Calendar size={10} /> {new Date(cohort.applicationDeadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            ) : <span />}
            <span className="text-[11px] text-violet-500 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
              View Details <ArrowRight size={11} />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminCohortsPage() {
  const queryClient = useQueryClient();

  const { data: cohorts = [], isLoading } = useQuery<any[]>({
    queryKey: ['admin-cohorts'],
    queryFn: () => cohortsApi.getAll().then((r) => r.data as any[]),
    staleTime: 30_000,
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openCount = cohorts.filter((c: any) => c.status === 'open').length;
  const totalCapacity = cohorts.reduce((sum: number, c: any) => sum + (c.maxStartups ?? 0), 0);

  const createMutation = useMutation({
    mutationFn: (data: any) => cohortsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cohorts'] });
      setCreateOpen(false);
      setForm(EMPTY_FORM);
      setErrors({});
    },
  });

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Cohort name is required';
    if (!form.year || form.year < 2000) e.year = 'Enter a valid year';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const payload: any = { name: form.name.trim(), year: +form.year };
    if (form.description.trim()) payload.description = form.description.trim();
    if (form.tagline.trim()) payload.tagline = form.tagline.trim();
    if (form.sectors.length) payload.sectors = form.sectors;
    if (form.applicationDeadline) payload.applicationDeadline = form.applicationDeadline;
    if (form.maxStartups) payload.maxStartups = +form.maxStartups;
    createMutation.mutate(payload);
  }

  function toggleSector(s: string) {
    setForm((f) => ({
      ...f,
      sectors: f.sectors.includes(s) ? f.sectors.filter((x) => x !== s) : [...f.sectors, s],
    }));
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Layers size={20} className="text-violet-500" /> Cohort Management
            </h1>
            <p className="text-slate-500 text-sm mt-1">Create, manage and monitor all cohorts</p>
          </div>
          <Button onClick={() => { setForm(EMPTY_FORM); setErrors({}); setCreateOpen(true); }} className="gap-1.5">
            <Plus size={14} /> Create Cohort
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Cohorts',   value: cohorts.length,    color: 'text-slate-900' },
            { label: 'Open',            value: openCount,         color: 'text-emerald-600' },
            { label: 'Closed',          value: cohorts.filter((c: any) => c.status === 'closed').length, color: 'text-red-500' },
            { label: 'Total Capacity',  value: totalCapacity,     color: 'text-violet-600' },
          ].map((s) => (
            <Card key={s.label} className="text-center">
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Cohort list */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" /> Loading cohorts…
          </div>
        ) : cohorts.length === 0 ? (
          <Card>
            <div className="py-16 text-center">
              <Layers size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No cohorts yet. Create your first one!</p>
              <Button onClick={() => setCreateOpen(true)} className="mt-4 gap-1.5 mx-auto">
                <Plus size={14} /> Create Cohort
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {cohorts.map((c: any) => (
              <CohortCard key={c._id} cohort={c} />
            ))}
          </div>
        )}
      </div>

      {/* ── Create Cohort Modal ──────────────────────────────────────────────── */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New Cohort" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Cohort Name" required error={errors.name}>
              <input className={inputCls} placeholder="e.g. Batch Alpha 2026"
                value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </FormField>
            <FormField label="Cohort Year" required error={errors.year}>
              <input className={inputCls} type="number" min={2000} max={2100}
                value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: +e.target.value }))} />
            </FormField>
          </div>

          <FormField label="Tagline" hint="Short punchy line for the poster">
            <input className={inputCls} placeholder="e.g. Build boldly. Scale fast."
              value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} />
          </FormField>

          <FormField label="Description" hint="Overview of the cohort program">
            <textarea className={clsx(inputCls, 'resize-none')} rows={3}
              placeholder="Describe the cohort's focus, goals, and what startups can expect..."
              value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </FormField>

          <FormField label="Target Sectors">
            <div className="flex flex-wrap gap-2 mt-1">
              {SECTORS.map((s) => (
                <button key={s} type="button" onClick={() => toggleSector(s)}
                  className={clsx('px-3 py-1 text-xs rounded-full border transition-colors',
                    form.sectors.includes(s)
                      ? 'bg-violet-600 border-violet-600 text-white'
                      : 'border-slate-200 text-slate-600 hover:border-violet-400 hover:text-violet-600',
                  )}>
                  {s}
                </button>
              ))}
            </div>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Application Deadline">
              <input className={inputCls} type="date" value={form.applicationDeadline}
                onChange={(e) => setForm((f) => ({ ...f, applicationDeadline: e.target.value }))} />
            </FormField>
            <FormField label="Max Startups">
              <input className={inputCls} type="number" min={1} value={form.maxStartups}
                onChange={(e) => setForm((f) => ({ ...f, maxStartups: +e.target.value }))} />
            </FormField>
          </div>

          <div className="flex items-start gap-2 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 text-xs text-violet-700">
            <Sparkles size={13} className="text-violet-500 flex-shrink-0 mt-0.5" />
            <span>
              An <strong>application form</strong> will be auto-generated. A <strong>Claude-powered AI poster</strong> will be created instantly after.
            </span>
          </div>

          {createMutation.error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {(createMutation.error as any)?.response?.data?.message?.[0] ?? 'Something went wrong'}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2 justify-end">
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={createMutation.isPending} className="gap-1.5">
              <Sparkles size={14} />
              {createMutation.isPending ? 'Creating…' : 'Create & Generate Poster'}
            </Button>
          </div>
        </div>
      </Modal>

    </DashboardLayout>
  );
}
