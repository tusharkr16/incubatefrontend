'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreBar } from '@/components/startups/ScoreBar';
import { Modal } from '@/components/ui/Modal';
import { FormField, inputCls } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { intelligenceApi } from '@/lib/api/startups';
import { cohortsApi } from '@/lib/api';
import {
  Zap, AlertTriangle, ChevronDown, ChevronUp, Plus, Download,
  ExternalLink, Sparkles, Calendar, Users, Tag, Loader2,
  RefreshCw, CheckCircle, Copy,
} from 'lucide-react';
import { clsx } from 'clsx';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

const SECTORS = [
  'FinTech', 'HealthTech', 'EdTech', 'AgriTech', 'CleanTech',
  'LogisTech', 'RetailTech', 'LegalTech', 'HRTech', 'AI/ML',
  'Web3', 'SaaS', 'DeepTech', 'Other',
];

const WEIGHT_INFO = [
  { label: 'Evaluation Score', weight: '40%', color: 'bg-violet-500' },
  { label: 'Milestone Completion', weight: '25%', color: 'bg-blue-500' },
  { label: 'Financial Health', weight: '20%', color: 'bg-emerald-500' },
  { label: 'Document Completion', weight: '15%', color: 'bg-amber-500' },
];

const FRONTEND_ORIGIN = typeof window !== 'undefined' ? window.location.origin : '';

const EMPTY_FORM = {
  name: '',
  year: CURRENT_YEAR,
  description: '',
  tagline: '',
  sectors: [] as string[],
  applicationDeadline: '',
  maxStartups: 20,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function ScoreChip({ score }: { score: number }) {
  const color =
    score >= 70 ? 'text-emerald-600 bg-emerald-50' :
    score >= 45 ? 'text-amber-600 bg-amber-50' :
    'text-red-600 bg-red-50';
  return (
    <span className={clsx('text-xl font-black px-3 py-1 rounded-lg', color)}>
      {score}
    </span>
  );
}

// ── AI Poster Generator (canvas-based, no external deps) ─────────────────────

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function generateCohortPoster(cohort: {
  name: string;
  year: number;
  tagline?: string;
  sectors?: string[];
  applicationDeadline?: string;
  maxStartups?: number;
  description?: string;
}): string {
  const W = 1200, H = 800;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── Background gradient ───────────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#1e1b4b');   // indigo-950
  bg.addColorStop(0.5, '#312e81'); // indigo-900
  bg.addColorStop(1, '#4c1d95');   // violet-900
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ── Decorative circles ────────────────────────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.fillStyle = '#a78bfa';
  ctx.beginPath();
  ctx.arc(W - 80, 80, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(120, H - 80, 180, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // ── Grid dots (subtle texture) ────────────────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#fff';
  for (let x = 40; x < W; x += 40) {
    for (let y = 40; y < H; y += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // ── Left accent bar ───────────────────────────────────────────────────────
  const accentGrad = ctx.createLinearGradient(0, 200, 0, 600);
  accentGrad.addColorStop(0, '#7c3aed');
  accentGrad.addColorStop(1, '#4f46e5');
  ctx.fillStyle = accentGrad;
  ctx.fillRect(72, 200, 4, 380);

  // ── Top badge: "INCUBATEX · COHORT PROGRAM" ───────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.18;
  drawRoundRect(ctx, 96, 56, 360, 38, 19);
  ctx.fillStyle = '#a78bfa';
  ctx.fill();
  ctx.restore();

  ctx.font = 'bold 13px sans-serif';
  ctx.fillStyle = '#c4b5fd';
  ctx.letterSpacing = '3px';
  ctx.fillText('INCUBATEX  ·  COHORT PROGRAM', 116, 80);

  // ── Year pill ─────────────────────────────────────────────────────────────
  ctx.save();
  drawRoundRect(ctx, 96, 108, 90, 34, 17);
  const pillGrad = ctx.createLinearGradient(96, 108, 186, 142);
  pillGrad.addColorStop(0, '#7c3aed');
  pillGrad.addColorStop(1, '#4f46e5');
  ctx.fillStyle = pillGrad;
  ctx.fill();
  ctx.restore();

  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(String(cohort.year), 126, 130);

  // ── Main cohort name ──────────────────────────────────────────────────────
  const displayName = cohort.name.toUpperCase();
  ctx.font = `bold 72px sans-serif`;
  ctx.fillStyle = '#ffffff';

  // Auto-scale font if name is long
  let fontSize = 72;
  while (ctx.measureText(displayName).width > W - 200 && fontSize > 36) {
    fontSize -= 4;
    ctx.font = `bold ${fontSize}px sans-serif`;
  }
  ctx.fillText(displayName, 96, 230);

  // ── Tagline ───────────────────────────────────────────────────────────────
  const tagline = cohort.tagline || `Empowering innovators · Cohort ${cohort.year}`;
  ctx.font = '22px sans-serif';
  ctx.fillStyle = '#a78bfa';
  ctx.fillText(tagline, 96, 275);

  // ── Divider ───────────────────────────────────────────────────────────────
  const divGrad = ctx.createLinearGradient(96, 310, 700, 310);
  divGrad.addColorStop(0, '#7c3aed');
  divGrad.addColorStop(1, 'transparent');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(96, 310);
  ctx.lineTo(700, 310);
  ctx.stroke();

  // ── Stats row ─────────────────────────────────────────────────────────────
  const stats: Array<{ label: string; value: string }> = [];
  if (cohort.maxStartups) stats.push({ label: 'MAX STARTUPS', value: String(cohort.maxStartups) });
  if (cohort.applicationDeadline) {
    const d = new Date(cohort.applicationDeadline);
    stats.push({ label: 'DEADLINE', value: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) });
  }
  const sectors = cohort.sectors ?? [];
  if (sectors.length) stats.push({ label: 'SECTORS', value: String(sectors.length) });

  stats.forEach((stat, i) => {
    const x = 96 + i * 200;
    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(stat.value, x, 375);
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#7c3aed';
    ctx.fillText(stat.label, x, 395);
  });

  // ── Sectors chips ─────────────────────────────────────────────────────────
  if (sectors.length > 0) {
    let cx = 96, cy = 430;
    ctx.font = 'bold 12px sans-serif';
    sectors.slice(0, 8).forEach((sector) => {
      const tw = ctx.measureText(sector).width + 24;
      if (cx + tw > W - 100) { cx = 96; cy += 40; }
      ctx.save();
      ctx.globalAlpha = 0.15;
      drawRoundRect(ctx, cx, cy, tw, 28, 14);
      ctx.fillStyle = '#a78bfa';
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = '#7c3aed';
      ctx.lineWidth = 1;
      drawRoundRect(ctx, cx, cy, tw, 28, 14);
      ctx.stroke();
      ctx.fillStyle = '#c4b5fd';
      ctx.fillText(sector, cx + 12, cy + 18);
      cx += tw + 10;
    });
  }

  // ── Description ───────────────────────────────────────────────────────────
  if (cohort.description) {
    ctx.font = '15px sans-serif';
    ctx.fillStyle = '#818cf8';
    const maxW = W - 200;
    const words = cohort.description.split(' ');
    let line = '';
    let lineY = sectors.length > 0 ? 540 : 440;
    for (const word of words) {
      const test = line + word + ' ';
      if (ctx.measureText(test).width > maxW && line !== '') {
        ctx.fillText(line.trim(), 96, lineY);
        line = word + ' ';
        lineY += 24;
        if (lineY > 620) break;
      } else {
        line = test;
      }
    }
    if (lineY <= 620) ctx.fillText(line.trim(), 96, lineY);
  }

  // ── CTA button area ───────────────────────────────────────────────────────
  ctx.save();
  drawRoundRect(ctx, 96, H - 130, 220, 52, 26);
  const ctaGrad = ctx.createLinearGradient(96, H - 130, 316, H - 78);
  ctaGrad.addColorStop(0, '#7c3aed');
  ctaGrad.addColorStop(1, '#4f46e5');
  ctx.fillStyle = ctaGrad;
  ctx.fill();
  ctx.restore();

  ctx.font = 'bold 17px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Apply Now →', 138, H - 97);

  // ── Bottom bar ────────────────────────────────────────────────────────────
  const barGrad = ctx.createLinearGradient(0, H - 44, W, H);
  barGrad.addColorStop(0, '#7c3aed');
  barGrad.addColorStop(1, '#4f46e5');
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, H - 44, W, 44);

  ctx.font = 'bold 13px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('incubateX — Build. Launch. Scale.', 40, H - 17);

  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#c4b5fd';
  const ts = `Generated ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  const tsW = ctx.measureText(ts).width;
  ctx.fillText(ts, W - tsW - 40, H - 17);

  return canvas.toDataURL('image/png');
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CohortReportPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [year, setYear] = useState(CURRENT_YEAR);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [posterOpen, setPosterOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [posterSrc, setPosterSrc] = useState<string | null>(null);
  const [posterLoading, setPosterLoading] = useState(false);
  const [posterSource, setPosterSource] = useState<'dalle' | 'pollinations' | 'canvas' | null>(null);
  const [createdCohort, setCreatedCohort] = useState<any>(null);
  const [appLink, setAppLink] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [syncResult, setSyncResult] = useState<{ synced: number; skipped: number; errors: number } | null>(null);
  const [syncingCohortId, setSyncingCohortId] = useState<string | null>(null);

  const { data: report, isLoading } = useQuery({
    queryKey: ['cohort-report-full', year],
    queryFn: () => intelligenceApi.getCohortReport(year).then((r) => r.data),
  });

  const { data: cohortsList } = useQuery({
    queryKey: ['cohorts-list'],
    queryFn: () => cohortsApi.getAll().then((r) => r.data as any[]),
  });

  async function handleSync(cohortId: string) {
    setSyncingCohortId(cohortId);
    setSyncResult(null);
    try {
      const res = await cohortsApi.syncResponses(cohortId);
      setSyncResult(res.data);
      queryClient.invalidateQueries({ queryKey: ['startups-list'] });
      queryClient.invalidateQueries({ queryKey: ['cohort-report-full'] });
    } catch (err: any) {
      setSyncResult({ synced: 0, skipped: 0, errors: 1 });
    } finally {
      setSyncingCohortId(null);
    }
  }

  function copyLink(link: string) {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const createMutation = useMutation({
    mutationFn: (data: any) => cohortsApi.create(data),
    onSuccess: async (res) => {
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
      const cohort = res.data;
      setCreatedCohort(cohort);

      // Build the public application link
      const link = `${FRONTEND_ORIGIN}/apply/${cohort._id}`;
      setAppLink(link);

      setCreateOpen(false);
      setPosterOpen(true);
      setPosterSrc(null);
      setPosterSource(null);
      setForm(EMPTY_FORM);
      setErrors({});

      // ── Generate AI poster via backend (Pollinations free / DALL·E if key set) ──
      setPosterLoading(true);
      try {
        const aiRes = await cohortsApi.generatePoster({
          name: cohort.name,
          year: cohort.year,
          tagline: cohort.tagline,
          sectors: cohort.sectors,
          description: cohort.description,
        });
        if (aiRes.data.imageUrl) {
          setPosterSrc(aiRes.data.imageUrl);
          setPosterSource((aiRes.data.source as any) ?? 'pollinations');
        } else {
          // Both AI options failed — canvas fallback
          setPosterSrc(generateCohortPoster(cohort));
          setPosterSource('canvas');
        }
      } catch {
        setPosterSrc(generateCohortPoster(cohort));
        setPosterSource('canvas');
      } finally {
        setPosterLoading(false);
      }
    },
  });

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Cohort name is required';
    if (!form.year || form.year < 2000 || form.year > 2100) e.year = 'Enter a valid year (2000–2100)';
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
      sectors: f.sectors.includes(s)
        ? f.sectors.filter((x) => x !== s)
        : [...f.sectors, s],
    }));
  }

  function downloadPoster() {
    if (!posterSrc) return;
    const filename = `cohort-${createdCohort?.year ?? 'poster'}-${(createdCohort?.name ?? 'cohort').replace(/\s+/g, '-').toLowerCase()}.png`;

    if (posterSrc.startsWith('data:')) {
      // Canvas-generated data URL — direct download
      const a = document.createElement('a');
      a.href = posterSrc;
      a.download = filename;
      a.click();
    } else {
      // External URL (Pollinations / DALL-E) — use canvas with crossOrigin
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d')!.drawImage(img, 0, 0);
        try {
          const a = document.createElement('a');
          a.href = canvas.toDataURL('image/png');
          a.download = filename;
          a.click();
        } catch {
          window.open(posterSrc, '_blank');
        }
      };
      img.onerror = () => window.open(posterSrc, '_blank');
      img.src = posterSrc;
    }
  }

  const items = report ?? [];
  const avgScore = items.length
    ? Math.round(items.reduce((s: number, i: any) => s + i.score, 0) / items.length * 10) / 10
    : 0;
  const flaggedCount = items.filter((i: any) => i.isFlagged).length;
  const highPerformers = items.filter((i: any) => i.score >= 70).length;

  const mutError = createMutation.error as any;

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Zap size={20} className="text-violet-500" />
              Cohort Intelligence Report
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              AI-generated insights for all active startups
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={year}
              onChange={(e) => setYear(+e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
              {YEARS.map((y) => <option key={y} value={y}>Cohort {y}</option>)}
            </select>
            <Button
              onClick={() => { setForm(EMPTY_FORM); setErrors({}); setCreateOpen(true); }}
              className="gap-1.5"
            >
              <Plus size={14} /> Create Cohort
            </Button>
          </div>
        </div>

        {/* Score weight legend */}
        <Card>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs text-slate-400 mb-1">Scoring methodology</p>
              <div className="flex items-center gap-4">
                {WEIGHT_INFO.map((w) => (
                  <div key={w.label} className="flex items-center gap-1.5">
                    <div className={clsx('w-3 h-3 rounded-sm', w.color)} />
                    <span className="text-xs text-slate-600">{w.label} <strong>{w.weight}</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Summary stats */}
        {!isLoading && items.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{items.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">Startups analysed</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-violet-600">{avgScore}</p>
              <p className="text-xs text-slate-400 mt-0.5">Cohort avg score</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{highPerformers}</p>
              <p className="text-xs text-slate-400 mt-0.5">High performers (≥70)</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-red-500">{flaggedCount}</p>
              <p className="text-xs text-slate-400 mt-0.5">Flagged startups</p>
            </div>
          </div>
        )}

        {/* Report cards */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 text-sm">Generating cohort report...</div>
        ) : items.length === 0 ? (
          <Card>
            <div className="py-16 text-center">
              <Zap size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No active startups in cohort {year}</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map((item: any, idx: number) => {
              const isOpen = expanded === item.startup._id;
              return (
                <Card key={item.startup._id} padding={false}>
                  <div
                    className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors rounded-xl"
                    onClick={() => setExpanded(isOpen ? null : item.startup._id)}
                  >
                    <span className="text-sm font-bold text-slate-300 w-5 text-right flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {item.startup.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900 text-sm">{item.startup.name}</span>
                        {item.isFlagged && (
                          <span className="flex items-center gap-1 text-xs text-red-500">
                            <AlertTriangle size={10} /> Flagged
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="info" className="text-xs">{item.startup.sector?.primary}</Badge>
                        <Badge variant="outline" className="text-xs">{item.startup.stage?.replace('_', ' ')}</Badge>
                      </div>
                    </div>
                    <div className="w-36 hidden lg:block">
                      <ScoreBar score={item.score} showValue={false} />
                    </div>
                    <ScoreChip score={item.score} />
                    {isOpen
                      ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" />
                      : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
                    }
                  </div>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-0 border-t border-slate-100">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                            AI Recommendations
                          </p>
                          <ul className="space-y-2">
                            {item.recommendations.map((rec: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                <span className="text-violet-400 mt-0.5 flex-shrink-0">→</span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => router.push(`/dashboard/ceo/startups/${item.startup._id}`)}
                            className="w-full text-center text-sm bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-lg transition-colors"
                          >
                            View Full Startup Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      {/* ── My Cohorts (with Google Form links + Sync buttons) ─────────────── */}
      {cohortsList && cohortsList.length > 0 && (
        <div className="space-y-3 mt-2">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">My Cohorts</h2>
          {cohortsList.map((c: any) => (
            <Card key={c._id} padding={false}>
              <div className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {String(c.year).slice(2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{c.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-slate-400">Cohort {c.year}</span>
                    {c.googleFormUrl && (
                      <a href={c.googleFormUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-violet-500 hover:underline flex items-center gap-1">
                        <ExternalLink size={10} /> Google Form
                      </a>
                    )}
                    {!c.googleFormUrl && (
                      <a href={`${FRONTEND_ORIGIN}/apply/${c._id}`} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-violet-500 hover:underline flex items-center gap-1">
                        <ExternalLink size={10} /> Application Form
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {c.googleFormId && (
                    <>
                      {syncingCohortId === c._id ? (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Loader2 size={11} className="animate-spin" /> Syncing…
                        </span>
                      ) : (
                        <Button size="sm" variant="secondary" onClick={() => handleSync(c._id)} className="gap-1">
                          <RefreshCw size={11} /> Sync Responses
                        </Button>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => copyLink(c.googleFormUrl || `${FRONTEND_ORIGIN}/apply/${c._id}`)}
                    className="text-xs border border-slate-200 text-slate-500 hover:bg-slate-50 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <Copy size={11} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      </div>

      {/* ── Create Cohort Modal ─────────────────────────────────────────────── */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New Cohort" size="lg">
        <div className="space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Cohort Name" required error={errors.name}>
              <input
                className={inputCls}
                placeholder="e.g. Batch Alpha 2026"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </FormField>
            <FormField label="Cohort Year" required error={errors.year}>
              <input
                className={inputCls}
                type="number"
                min={2000}
                max={2100}
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: +e.target.value }))}
              />
            </FormField>
          </div>

          <FormField label="Tagline" hint="Short punchy line for the poster">
            <input
              className={inputCls}
              placeholder="e.g. Build boldly. Scale fast."
              value={form.tagline}
              onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
            />
          </FormField>

          <FormField label="Description" hint="Overview of the cohort program">
            <textarea
              className={clsx(inputCls, 'resize-none')}
              rows={3}
              placeholder="Describe the cohort's focus, goals, and what startups can expect..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </FormField>

          <FormField label="Target Sectors">
            <div className="flex flex-wrap gap-2 mt-1">
              {SECTORS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSector(s)}
                  className={clsx(
                    'px-3 py-1 text-xs rounded-full border transition-colors',
                    form.sectors.includes(s)
                      ? 'bg-violet-600 border-violet-600 text-white'
                      : 'border-slate-200 text-slate-600 hover:border-violet-400 hover:text-violet-600',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Application Deadline">
              <input
                className={inputCls}
                type="date"
                value={form.applicationDeadline}
                onChange={(e) => setForm((f) => ({ ...f, applicationDeadline: e.target.value }))}
              />
            </FormField>
            <FormField label="Max Startups">
              <input
                className={inputCls}
                type="number"
                min={1}
                value={form.maxStartups}
                onChange={(e) => setForm((f) => ({ ...f, maxStartups: +e.target.value }))}
              />
            </FormField>
          </div>

          <div className="flex items-start gap-2 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 text-xs text-violet-700">
            <Sparkles size={13} className="text-violet-500 flex-shrink-0 mt-0.5" />
            <span>
              An application form will be <strong>automatically generated</strong> after creation.
              Share the link with startups to apply — submissions are stored directly in the platform.
            </span>
          </div>

          {mutError && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {mutError?.response?.data?.message?.[0] ?? mutError?.response?.data?.message ?? 'Something went wrong'}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2 justify-end">
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={createMutation.isPending} className="gap-1.5">
              <Sparkles size={14} />
              {createMutation.isPending ? 'Creating...' : 'Create & Generate Poster'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Cohort Poster Modal ─────────────────────────────────────────────── */}
      <Modal open={posterOpen} onClose={() => setPosterOpen(false)} title="Cohort Poster" size="lg">
        <div className="space-y-4">

          {/* Meta info */}
          {createdCohort && (
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                <Zap size={14} className="text-violet-500" />
                {createdCohort.name}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400" /> Cohort {createdCohort.year}
              </span>
              {createdCohort.maxStartups && (
                <span className="flex items-center gap-1.5">
                  <Users size={13} className="text-slate-400" /> Up to {createdCohort.maxStartups} startups
                </span>
              )}
              {createdCohort.sectors?.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Tag size={13} className="text-slate-400" /> {createdCohort.sectors.join(', ')}
                </span>
              )}
            </div>
          )}

          {/* Google Form link (created automatically if credentials set) */}
          {createdCohort?.googleFormUrl ? (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <ExternalLink size={16} className="text-emerald-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-emerald-700 mb-0.5">
                  Google Form Created ✓
                </p>
                <p className="text-xs text-emerald-600 truncate">{createdCohort.googleFormUrl}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => copyLink(createdCohort.googleFormUrl)}
                  className="text-xs border border-emerald-300 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1"
                >
                  {copied ? <><CheckCircle size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
                </button>
                <a
                  href={createdCohort.googleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors"
                >
                  Open Form
                </a>
              </div>
            </div>
          ) : appLink ? (
            <div className="flex items-center gap-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
              <ExternalLink size={16} className="text-violet-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-violet-700 mb-0.5">Built-in Application Form</p>
                <p className="text-xs text-violet-500 truncate">{appLink}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => copyLink(appLink)}
                  className="text-xs border border-violet-300 text-violet-600 hover:bg-violet-100 px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1"
                >
                  {copied ? <><CheckCircle size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
                </button>
                <a href={appLink} target="_blank" rel="noopener noreferrer"
                  className="text-xs bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors">
                  Open
                </a>
              </div>
            </div>
          ) : null}

          {/* Sync responses button (if Google Form exists) */}
          {createdCohort?.googleFormId && (
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-slate-700">Sync Google Form Responses</p>
                <p className="text-xs text-slate-400 mt-0.5">Pull new submissions and add as startups</p>
              </div>
              <div className="flex items-center gap-3">
                {syncResult && (
                  <p className="text-xs text-emerald-600 font-medium">
                    ✓ {syncResult.synced} added · {syncResult.skipped} skipped
                  </p>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  loading={syncingCohortId === createdCohort._id}
                  onClick={() => handleSync(createdCohort._id)}
                  className="gap-1.5"
                >
                  <RefreshCw size={12} /> Sync Now
                </Button>
              </div>
            </div>
          )}

          {/* AI Poster preview */}
          {posterLoading ? (
            <div className="h-56 rounded-xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 border border-violet-800 flex flex-col items-center justify-center gap-3">
              <Loader2 size={28} className="text-violet-300 animate-spin" />
              <p className="text-violet-300 text-sm font-medium">Generating AI poster…</p>
              <p className="text-violet-500 text-xs">Powered by Pollinations.ai · takes 5–15 sec</p>
            </div>
          ) : posterSrc ? (
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <img
                src={posterSrc}
                alt="AI-generated cohort poster"
                className="w-full block"
              />
            </div>
          ) : (
            <div className="h-48 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
              <p className="text-slate-400 text-sm">Poster will appear here</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Sparkles size={11} className="text-violet-400" />
              {posterSource === 'dalle' && 'DALL·E 3 AI-generated poster'}
              {posterSource === 'pollinations' && 'AI-generated via Pollinations.ai (free)'}
              {posterSource === 'canvas' && 'Canvas-generated poster'}
              {!posterSource && !posterLoading && 'AI poster generation'}
            </p>
            <Button onClick={downloadPoster} disabled={!posterSrc || posterLoading} className="gap-1.5">
              <Download size={14} /> Download Poster
            </Button>
          </div>
        </div>
      </Modal>

    </DashboardLayout>
  );
}
