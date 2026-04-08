'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { cohortsApi } from '@/lib/api';
import { clsx } from 'clsx';
import {
  ArrowLeft, Calendar, Users, Tag, ExternalLink, Copy, RefreshCw,
  CheckCircle, Loader2, Sparkles, Download, Lock, Unlock, Globe,
  Building2, Mail, Zap, TrendingUp, AlertTriangle,
  ChevronRight, Target,
} from 'lucide-react';

function LinkedinIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const FRONTEND_ORIGIN = typeof window !== 'undefined' ? window.location.origin : '';

// ── Helpers ───────────────────────────────────────────────────────────────────
function scoreColor(score: number) {
  if (score >= 70) return { bg: 'bg-emerald-500', text: 'text-emerald-700', pill: 'bg-emerald-100 text-emerald-700' };
  if (score >= 45) return { bg: 'bg-amber-400', text: 'text-amber-700', pill: 'bg-amber-100 text-amber-700' };
  return { bg: 'bg-red-400', text: 'text-red-600', pill: 'bg-red-100 text-red-600' };
}

function stageLabel(stage: string) {
  return stage?.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ?? '—';
}

function statusPill(status: string) {
  const map: Record<string, string> = {
    active:    'bg-emerald-100 text-emerald-700',
    graduated: 'bg-blue-100 text-blue-700',
    inactive:  'bg-slate-100 text-slate-500',
    pending:   'bg-amber-100 text-amber-700',
  };
  return map[status] ?? 'bg-slate-100 text-slate-500';
}

// ── Canvas poster helpers ─────────────────────────────────────────────────────
function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);   ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);   ctx.arcTo(x,     y + h, x,     y + h - r, r);
  ctx.lineTo(x, y + r);       ctx.arcTo(x,     y,     x + r, y,         r);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number): number {
  const words = text.split(' ');
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y); y += lineH; line = word;
    } else { line = test; }
  }
  if (line) { ctx.fillText(line, x, y); y += lineH; }
  return y;
}

function generateCanvasPoster(cohort: any, applyUrl = ''): string {
  const W = 900, H = 1200;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const PAD = 60;

  // ── Deep dark gradient background ───────────────────────────────────────────
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0,   '#0a0718');
  bgGrad.addColorStop(0.4, '#1a0f3a');
  bgGrad.addColorStop(1,   '#0d1a3a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // ── Radial glow — top-right violet ──────────────────────────────────────────
  {
    const g = ctx.createRadialGradient(W - 80, 100, 0, W - 80, 100, 420);
    g.addColorStop(0, 'rgba(124,58,237,0.35)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, 520);
  }
  // ── Radial glow — bottom-left indigo ────────────────────────────────────────
  {
    const g = ctx.createRadialGradient(60, H - 180, 0, 60, H - 180, 340);
    g.addColorStop(0, 'rgba(79,70,229,0.3)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, H - 520, W, 520);
  }
  // ── Radial glow — center subtle ─────────────────────────────────────────────
  {
    const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 500);
    g.addColorStop(0, 'rgba(109,40,217,0.08)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  // ── Grid lines ──────────────────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(255,255,255,0.028)';
  ctx.lineWidth = 1;
  for (let gx = 0; gx < W; gx += 55) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
  for (let gy = 0; gy < H; gy += 55) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }

  // ── Decorative corner circle — top right ────────────────────────────────────
  ctx.strokeStyle = 'rgba(139,92,246,0.18)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(W + 10, -10, 180, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(W + 10, -10, 240, 0, Math.PI * 2); ctx.stroke();
  // ── Decorative circle — bottom left ─────────────────────────────────────────
  ctx.beginPath(); ctx.arc(-10, H + 10, 150, 0, Math.PI * 2); ctx.stroke();

  // ── Top border gradient line ─────────────────────────────────────────────────
  const topLine = ctx.createLinearGradient(0, 0, W, 0);
  topLine.addColorStop(0,   'rgba(124,58,237,0)');
  topLine.addColorStop(0.5, 'rgba(124,58,237,1)');
  topLine.addColorStop(1,   'rgba(79,70,229,0)');
  ctx.fillStyle = topLine; ctx.fillRect(0, 0, W, 3);

  let y = 64;

  // ── "INCUBATEX PRESENTS" top label ──────────────────────────────────────────
  const presents = 'I N C U B A T E X   P R E S E N T S';
  ctx.font = 'bold 11px sans-serif';
  const pw = ctx.measureText(presents).width + 48;
  const pg = ctx.createLinearGradient(W/2 - pw/2, 0, W/2 + pw/2, 0);
  pg.addColorStop(0, 'rgba(109,40,217,0.15)');
  pg.addColorStop(0.5, 'rgba(109,40,217,0.45)');
  pg.addColorStop(1, 'rgba(109,40,217,0.15)');
  ctx.fillStyle = pg;
  rr(ctx, W/2 - pw/2, y, pw, 28, 14); ctx.fill();
  ctx.strokeStyle = 'rgba(139,92,246,0.5)'; ctx.lineWidth = 1;
  rr(ctx, W/2 - pw/2, y, pw, 28, 14); ctx.stroke();
  ctx.fillStyle = '#a78bfa';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(presents, W / 2, y + 14);
  y += 52;

  // ── Cohort name ─────────────────────────────────────────────────────────────
  let nameSz = 108;
  ctx.font = `bold ${nameSz}px Impact, Arial Black, sans-serif`;
  while (ctx.measureText(cohort.name.toUpperCase()).width > W - PAD * 2 && nameSz > 52) {
    nameSz -= 4; ctx.font = `bold ${nameSz}px Impact, Arial Black, sans-serif`;
  }
  ctx.shadowColor = 'rgba(139,92,246,0.9)'; ctx.shadowBlur = 36;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText(cohort.name.toUpperCase(), W / 2, y);
  ctx.shadowBlur = 0;
  y += nameSz + 6;

  // ── Year + edition ──────────────────────────────────────────────────────────
  const edition = `COHORT ${cohort.year}  ·  SEASON ${(cohort.year % 100).toString().padStart(2, '0')}`;
  ctx.fillStyle = '#7c3aed';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText(edition, W / 2, y);
  y += 36;

  // ── Tagline ─────────────────────────────────────────────────────────────────
  if (cohort.tagline) {
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '17px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(cohort.tagline, W / 2, y);
    y += 36;
  }

  // ── Gradient divider ────────────────────────────────────────────────────────
  {
    const dg = ctx.createLinearGradient(PAD, 0, W - PAD, 0);
    dg.addColorStop(0,   'rgba(255,255,255,0)');
    dg.addColorStop(0.5, 'rgba(139,92,246,0.6)');
    dg.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.strokeStyle = dg; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(W - PAD, y); ctx.stroke();
  }
  y += 28;

  // ── Stats row ───────────────────────────────────────────────────────────────
  const STAT_EMOJIS = ['📅', '🚀', '⚡'];
  const stats: { icon: string; label: string; value: string }[] = [];
  if (cohort.applicationDeadline) {
    const d = new Date(cohort.applicationDeadline);
    stats.push({ icon: '📅', label: 'APPLY BY', value: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) });
  }
  if (cohort.maxStartups) stats.push({ icon: '🚀', label: 'CAPACITY', value: `${cohort.maxStartups} Startups` });
  stats.push({ icon: '⚡', label: 'MODE', value: 'Full Incubation' });
  // Always have 3 stats
  while (stats.length < 3) stats.push({ icon: STAT_EMOJIS[stats.length] ?? '🌟', label: 'PROGRAM', value: 'Equity-Free' });

  const cols = 3;
  const statBoxW = (W - PAD * 2 - (cols - 1) * 18) / cols;
  stats.slice(0, cols).forEach((stat, i) => {
    const bx = PAD + i * (statBoxW + 18);
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    rr(ctx, bx, y, statBoxW, 90, 12); ctx.fill();
    ctx.strokeStyle = 'rgba(139,92,246,0.25)'; ctx.lineWidth = 1;
    rr(ctx, bx, y, statBoxW, 90, 12); ctx.stroke();

    ctx.font = '26px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(stat.icon, bx + statBoxW / 2, y + 10);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 17px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(stat.value, bx + statBoxW / 2, y + 46);

    ctx.fillStyle = 'rgba(255,255,255,0.38)';
    ctx.font = '10px sans-serif';
    ctx.fillText(stat.label, bx + statBoxW / 2, y + 68);
  });
  y += 110;

  // ── Sectors ─────────────────────────────────────────────────────────────────
  if (cohort.sectors?.length) {
    ctx.fillStyle = 'rgba(255,255,255,0.38)';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText('FOCUS SECTORS', PAD, y);
    y += 20;
    let sx = PAD;
    const pH = 34;
    (cohort.sectors as string[]).forEach((sector) => {
      ctx.font = '13px sans-serif';
      const sw = ctx.measureText(sector).width + 28;
      if (sx + sw > W - PAD) { sx = PAD; y += pH + 8; }
      // Pill fill
      const sg = ctx.createLinearGradient(sx, y, sx, y + pH);
      sg.addColorStop(0, 'rgba(109,40,217,0.3)'); sg.addColorStop(1, 'rgba(109,40,217,0.1)');
      ctx.fillStyle = sg; rr(ctx, sx, y, sw, pH, 17); ctx.fill();
      ctx.strokeStyle = 'rgba(139,92,246,0.6)'; ctx.lineWidth = 1;
      rr(ctx, sx, y, sw, pH, 17); ctx.stroke();
      ctx.fillStyle = '#c4b5fd';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(sector, sx + sw / 2, y + pH / 2);
      sx += sw + 8;
    });
    y += pH + 24;
  }

  // ── Description ─────────────────────────────────────────────────────────────
  if (cohort.description) {
    ctx.fillStyle = 'rgba(255,255,255,0.48)';
    ctx.font = '15px sans-serif';
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    y = wrapText(ctx, cohort.description, PAD, y, W - PAD * 2, 22);
    y += 12;
  }

  // ── "What you get" row (always shown) ────────────────────────────────────────
  const perks = ['Mentorship Network', 'Investor Connects', 'Product Labs', 'Go-To-Market Support'];
  const perkY = Math.max(y + 16, H - 310);
  ctx.fillStyle = 'rgba(255,255,255,0.32)';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.fillText('WHAT YOU GET', PAD, perkY);
  perks.forEach((perk, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const px2 = PAD + col * ((W - PAD * 2) / 2);
    const py2 = perkY + 20 + row * 26;
    ctx.fillStyle = '#7c3aed'; ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText('✦', px2, py2);
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '13px sans-serif';
    ctx.fillText(perk, px2 + 22, py2);
  });

  // ── CTA button ──────────────────────────────────────────────────────────────
  const ctaY = H - 200;
  const ctaG = ctx.createLinearGradient(PAD, ctaY, W - PAD, ctaY);
  ctaG.addColorStop(0, '#7c3aed'); ctaG.addColorStop(1, '#4f46e5');
  ctx.fillStyle = ctaG;
  rr(ctx, PAD, ctaY, W - PAD * 2, 68, 12); ctx.fill();
  ctx.shadowColor = 'rgba(124,58,237,0.6)'; ctx.shadowBlur = 28;
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('APPLY NOW  →', W / 2, ctaY + 34);
  ctx.shadowBlur = 0;

  if (applyUrl) {
    ctx.fillStyle = 'rgba(255,255,255,0.32)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(applyUrl, W / 2, ctaY + 78);
  }

  // ── Horizontal rule before footer ───────────────────────────────────────────
  {
    const hl = ctx.createLinearGradient(0, 0, W, 0);
    hl.addColorStop(0,   'rgba(124,58,237,0)');
    hl.addColorStop(0.5, 'rgba(124,58,237,0.4)');
    hl.addColorStop(1,   'rgba(79,70,229,0)');
    ctx.strokeStyle = hl; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H - 66); ctx.lineTo(W, H - 66); ctx.stroke();
  }

  // ── Footer ──────────────────────────────────────────────────────────────────
  const ftG = ctx.createLinearGradient(0, H - 66, W, H - 66);
  ftG.addColorStop(0, 'rgba(124,58,237,0.18)'); ftG.addColorStop(1, 'rgba(79,70,229,0.18)');
  ctx.fillStyle = ftG; ctx.fillRect(0, H - 66, W, 66);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText('IncubateX', PAD, H - 33);
  ctx.fillStyle = 'rgba(255,255,255,0.38)';
  ctx.font = '12px sans-serif';
  ctx.fillText('Build. Launch. Scale.', PAD + 88, H - 33);

  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`© ${cohort.year} IncubateX · incubatex.in`, W - PAD, H - 33);

  // ── Bottom gradient border ───────────────────────────────────────────────────
  ctx.fillStyle = ctaG; ctx.fillRect(0, H - 3, W, 3);

  return canvas.toDataURL('image/png');
}

// ── Startup card ──────────────────────────────────────────────────────────────
function StartupCard({ startup }: { startup: any }) {
  const [expanded, setExpanded] = useState(false);
  const s = scoreColor(startup.latestScore ?? 0);

  return (
    <div className={clsx(
      'bg-white border rounded-2xl overflow-hidden transition-all duration-200',
      expanded ? 'border-violet-200 shadow-md' : 'border-slate-100 hover:border-violet-100 hover:shadow-sm',
    )}>
      {/* Score accent bar */}
      {startup.latestScore != null && (
        <div className={clsx('h-1 w-full', s.bg)} />
      )}

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-sm">
            {startup.name[0]}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-slate-900 truncate">{startup.name}</p>
              <span className={clsx('text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize', statusPill(startup.status))}>
                {startup.status}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Target size={10} /> {startup.sector?.primary ?? '—'}
              </span>
              <span className="text-slate-200">·</span>
              <span className="text-xs text-slate-400">{stageLabel(startup.stage)}</span>
            </div>
          </div>

          {/* Score pill */}
          {startup.latestScore != null && (
            <div className={clsx('flex-shrink-0 text-lg font-black px-3 py-1 rounded-xl', s.pill)}>
              {startup.latestScore}
            </div>
          )}
        </div>

        {/* Description */}
        {startup.description && (
          <p className="text-xs text-slate-500 leading-relaxed mt-3 line-clamp-2">
            {startup.description}
          </p>
        )}

        {/* Founder row */}
        {startup.founder && (
          <div className="mt-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
              {startup.founder.name?.[0] ?? '?'}
            </div>
            <span className="text-xs text-slate-600 font-medium truncate">{startup.founder.name}</span>
            <span className="text-xs text-slate-400 truncate">{startup.founder.email}</span>
          </div>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-slate-400 hover:text-violet-600 transition-colors"
        >
          {expanded ? 'Hide details' : 'Show details'}
          <ChevronRight size={12} className={clsx('transition-transform', expanded && 'rotate-90')} />
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-slate-50 bg-slate-50 px-5 py-4 space-y-3">
          {/* Founder detail */}
          {startup.founder && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Founder</p>
              <div className="flex items-center gap-3 flex-wrap">
                {startup.founder.email && (
                  <a href={`mailto:${startup.founder.email}`} className="text-xs text-slate-600 hover:text-violet-600 flex items-center gap-1 transition-colors">
                    <Mail size={11} /> {startup.founder.email}
                  </a>
                )}
                {startup.founder.linkedinUrl && (
                  <a href={startup.founder.linkedinUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-slate-600 hover:text-violet-600 flex items-center gap-1 transition-colors">
                    <LinkedinIcon size={11} /> LinkedIn
                  </a>
                )}
              </div>
              {startup.founder.bio && (
                <p className="text-xs text-slate-500 leading-relaxed">{startup.founder.bio}</p>
              )}
              {startup.founder.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {startup.founder.skills.map((sk: string) => (
                    <span key={sk} className="text-[10px] bg-violet-50 text-violet-600 border border-violet-100 rounded-full px-2 py-0.5">{sk}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Website */}
          {startup.website && (
            <a href={startup.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-violet-600 hover:underline">
              <Globe size={11} /> {startup.website}
            </a>
          )}

          {/* Applied date */}
          <p className="text-xs text-slate-400">
            Applied: {new Date(startup.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CohortDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: cohort, isLoading: cohortLoading } = useQuery<any>({
    queryKey: ['cohort-detail', id],
    queryFn: () => cohortsApi.getOne(id).then((r) => r.data),
    enabled: !!id,
  });

  const { data: startups = [], isLoading: startupsLoading, refetch: refetchStartups } = useQuery<any[]>({
    queryKey: ['cohort-startups', id],
    queryFn: () => cohortsApi.getStartups(id).then((r) => r.data as any[]),
    enabled: !!id,
  });

  // Poster state — seed with persisted Cloudinary URL once cohort loads
  const [posterSrc, setPosterSrc] = useState<string | null>(null);
  const [posterLoading, setPosterLoading] = useState(false);
  const [posterSource, setPosterSource] = useState<string | null>(null);
  const [showPoster, setShowPoster] = useState(false);

  // Once cohort data arrives, restore persisted poster
  const [posterSeeded, setPosterSeeded] = useState(false);

  // Sync state
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ synced: number; skipped: number; errors: number } | null>(null);

  // Copy state
  const [copied, setCopied] = useState(false);

  // Search / filter
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Seed poster from Cloudinary URL saved on the cohort document
  if (cohort && !posterSeeded) {
    setPosterSeeded(true);
    if (cohort.posterUrl) {
      setPosterSrc(cohort.posterUrl);
      setPosterSource(cohort.posterSource ?? 'ai');
      setShowPoster(true);
    }
  }

  const statusMutation = useMutation({
    mutationFn: (status: 'open' | 'closed' | 'draft') => cohortsApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cohort-detail', id] }),
  });

  async function handleSync() {
    setSyncing(true); setSyncResult(null);
    try {
      const res = await cohortsApi.syncResponses(id);
      setSyncResult(res.data);
      refetchStartups();
    } catch { setSyncResult({ synced: 0, skipped: 0, errors: 1 }); }
    finally { setSyncing(false); }
  }

  async function handleGeneratePoster() {
    if (!cohort) return;
    setPosterSrc(null); setPosterSource(null); setPosterLoading(true); setShowPoster(true);
    try {
      // 1. Render structured poster to canvas
      const applyUrl = `${FRONTEND_ORIGIN}/apply/${id}`;
      const dataUrl = generateCanvasPoster(cohort, applyUrl);

      // 2. Show immediately (optimistic)
      setPosterSrc(dataUrl); setPosterSource('canvas');

      // 3. Upload to Cloudinary for permanent URL
      const res = await cohortsApi.uploadPoster(id, dataUrl);
      if (res.data.cloudinaryUrl) {
        setPosterSrc(res.data.cloudinaryUrl);
        setPosterSource('cloudinary');
      }

      queryClient.invalidateQueries({ queryKey: ['cohort-detail', id] });
    } catch (err) {
      // Show local canvas even if upload fails
      const dataUrl = generateCanvasPoster(cohort, `${FRONTEND_ORIGIN}/apply/${id}`);
      setPosterSrc(dataUrl); setPosterSource('canvas');
    } finally { setPosterLoading(false); }
  }

  function copyLink() {
    const link = cohort?.googleFormUrl || `${FRONTEND_ORIGIN}/apply/${id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function downloadPoster() {
    if (!posterSrc) return;
    const filename = `cohort-${cohort?.year ?? ''}-${(cohort?.name ?? 'poster').replace(/\s+/g, '-').toLowerCase()}.png`;
    if (posterSrc.startsWith('data:')) {
      const a = document.createElement('a'); a.href = posterSrc; a.download = filename; a.click();
      return;
    }
    try {
      const blob = await fetch(posterSrc).then((r) => r.blob());
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch {
      window.open(posterSrc, '_blank');
    }
  }

  // Filter startups
  const filtered = startups.filter((s) => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.founder?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const avgScore = startups.length
    ? Math.round(startups.reduce((sum, s) => sum + (s.latestScore ?? 0), 0) / startups.length * 10) / 10
    : 0;
  const highPerformers = startups.filter((s) => (s.latestScore ?? 0) >= 70).length;
  const appLink = cohort?.googleFormUrl || `${FRONTEND_ORIGIN}/apply/${id}`;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (cohortLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-32 gap-2 text-slate-400">
          <Loader2 size={18} className="animate-spin" /> Loading cohort…
        </div>
      </DashboardLayout>
    );
  }
  if (!cohort) {
    return (
      <DashboardLayout>
        <div className="py-24 text-center">
          <AlertTriangle size={32} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400">Cohort not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* ── Hero banner ──────────────────────────────────────────────────── */}
        <div className="relative rounded-2xl overflow-hidden">
          {/* Gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95]" />
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-violet-500/10 blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-indigo-400/10 blur-3xl -translate-x-1/4 translate-y-1/4" />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative z-10 px-8 py-10">
            {/* Back button */}
            <button
              onClick={() => router.push('/dashboard/admin/cohorts')}
              className="flex items-center gap-1.5 text-violet-300 hover:text-white text-sm mb-6 transition-colors"
            >
              <ArrowLeft size={14} /> All Cohorts
            </button>

            <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
              <div className="space-y-3">
                {/* Year pill */}
                <div className="inline-flex items-center gap-2">
                  <span className="bg-violet-600/60 border border-violet-400/30 text-violet-200 text-xs font-bold px-3 py-1 rounded-full">
                    Cohort {cohort.year}
                  </span>
                  <span className={clsx('text-xs font-bold px-3 py-1 rounded-full capitalize',
                    cohort.status === 'open'   ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    cohort.status === 'closed' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    'bg-white/10 text-white/50 border border-white/20')}>
                    {cohort.status}
                  </span>
                </div>

                {/* Name */}
                <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                  {cohort.name}
                </h1>

                {/* Tagline */}
                {cohort.tagline && (
                  <p className="text-violet-300 text-lg italic">&ldquo;{cohort.tagline}&rdquo;</p>
                )}

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-violet-200/70">
                  {cohort.applicationDeadline && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      Deadline: {new Date(cohort.applicationDeadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                  )}
                  {cohort.maxStartups && (
                    <span className="flex items-center gap-1.5">
                      <Users size={13} /> Max {cohort.maxStartups} startups
                    </span>
                  )}
                </div>

                {/* Sectors */}
                {cohort.sectors?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {cohort.sectors.map((s: string) => (
                      <span key={s} className="text-xs bg-white/10 border border-white/15 text-white/70 rounded-full px-3 py-1 flex items-center gap-1">
                        <Tag size={10} /> {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
                <button
                  onClick={copyLink}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all"
                >
                  {copied ? <><CheckCircle size={12} /> Copied!</> : <><Copy size={12} /> Copy Apply Link</>}
                </button>
                <a
                  href={appLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all"
                >
                  <ExternalLink size={12} /> Open Form
                </a>
                <button
                  onClick={handleGeneratePoster}
                  className="flex items-center gap-1.5 bg-violet-500 hover:bg-violet-400 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all"
                >
                  <Sparkles size={12} /> {posterLoading ? 'Generating…' : 'AI Poster'}
                </button>
                {cohort.googleFormId && (
                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all"
                  >
                    {syncing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                    Sync Responses
                  </button>
                )}
                {cohort.status === 'open' ? (
                  <button
                    onClick={() => statusMutation.mutate('closed')}
                    className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 text-xs font-semibold px-4 py-2 rounded-full transition-all"
                  >
                    <Lock size={12} /> Close Cohort
                  </button>
                ) : (
                  <button
                    onClick={() => statusMutation.mutate('open')}
                    className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 text-xs font-semibold px-4 py-2 rounded-full transition-all"
                  >
                    <Unlock size={12} /> Open Cohort
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            {cohort.description && (
              <div className="mt-5 max-w-2xl">
                <p className="text-sm text-violet-200/60 leading-relaxed">{cohort.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Sync result banner ────────────────────────────────────────────── */}
        {syncResult && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 text-sm">
            <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />
            <span className="text-emerald-700 font-medium">
              Sync complete — {syncResult.synced} added · {syncResult.skipped} skipped
              {syncResult.errors > 0 && ` · ${syncResult.errors} errors`}
            </span>
          </div>
        )}

        {/* ── AI Poster preview ─────────────────────────────────────────────── */}
        {showPoster && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles size={14} className="text-violet-500" /> Cohort Poster
                {posterSource && (
                  <span className="text-xs text-slate-400 font-normal ml-1">
                    ({posterSource === 'cloudinary' ? 'Saved · Cloudinary CDN' : posterSource === 'canvas' ? 'Generated locally' : posterSource})
                  </span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGeneratePoster}
                  disabled={posterLoading}
                  className="text-xs text-slate-500 hover:text-violet-600 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={11} /> Regenerate
                </button>
                <Button size="sm" onClick={downloadPoster} disabled={!posterSrc || posterLoading} className="gap-1">
                  <Download size={11} /> Download
                </Button>
                <button onClick={() => setShowPoster(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
              </div>
            </div>
            {posterLoading ? (
              <div className="h-52 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 flex flex-col items-center justify-center gap-3">
                <Loader2 size={24} className="text-violet-300 animate-spin" />
                <p className="text-violet-300 text-sm">Claude is crafting the prompt…</p>
                <p className="text-violet-500 text-xs">Rendering via Pollinations.ai · 10–20 sec</p>
              </div>
            ) : posterSrc ? (
              <img src={posterSrc} alt="Cohort poster" className="w-full block" />
            ) : null}
          </div>
        )}

        {/* ── Stats row ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Building2 size={16} className="text-violet-500" />, label: 'Startups Registered', value: startups.length, sub: `of ${cohort.maxStartups ?? '∞'} max` },
            { icon: <TrendingUp size={16} className="text-emerald-500" />, label: 'Avg Score', value: avgScore || '—', sub: 'across all startups' },
            { icon: <Zap size={16} className="text-amber-500" />, label: 'High Performers', value: highPerformers, sub: 'score ≥ 70' },
            { icon: <Users size={16} className="text-blue-500" />, label: 'Capacity Left', value: cohort.maxStartups ? Math.max(0, cohort.maxStartups - startups.length) : '∞', sub: 'open spots' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-100 rounded-2xl p-5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                <p className="text-xs font-medium text-slate-600 mt-0.5">{s.label}</p>
                <p className="text-[11px] text-slate-400">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Startup list ──────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center gap-3 flex-wrap justify-between">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Building2 size={16} className="text-violet-500" />
              Registered Startups
              <span className="text-sm font-normal text-slate-400">({filtered.length})</span>
            </h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search startups…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300 w-48"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="graduated">Graduated</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {startupsLoading ? (
            <div className="py-16 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Loading startups…
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 bg-white border border-slate-100 rounded-2xl text-center">
              <Building2 size={28} className="text-slate-200 mx-auto mb-3" />
              {search || filterStatus !== 'all' ? (
                <p className="text-slate-400 text-sm">No startups match your filter.</p>
              ) : (
                <>
                  <p className="text-slate-500 font-medium">No startups yet</p>
                  <p className="text-slate-400 text-xs mt-1 mb-4">Share the application link to start receiving applications.</p>
                  <button
                    onClick={copyLink}
                    className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors mx-auto"
                  >
                    <Copy size={13} /> Copy Application Link
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((startup) => (
                <StartupCard key={startup._id} startup={startup} />
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
