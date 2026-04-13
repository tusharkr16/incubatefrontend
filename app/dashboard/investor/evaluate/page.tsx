'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreBar } from '@/components/startups/ScoreBar';
import { fundingInterestsApi } from '@/lib/api';
import { startupsApi } from '@/lib/api/startups';
import {
  DollarSign, CheckCircle, Clock, XCircle, Building2, TrendingUp,
  Globe, ExternalLink, Calendar, PauseCircle, HelpCircle, Users, Layers,
  MapPin, Mail, Phone, ThumbsUp, MessageSquare, Repeat2,
  Bookmark, ChevronRight, ArrowUpRight, Zap, Trophy,
} from 'lucide-react';

function LinkedinIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
import { clsx } from 'clsx';

// ── helpers ───────────────────────────────────────────────────────────────────

function fmtAmount(n: number) {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)} L`;
  if (n >= 1_000)      return `₹${(n / 1_000).toFixed(1)} K`;
  return `₹${n.toLocaleString()}`;
}

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7)  return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// ── static data ────────────────────────────────────────────────────────────────

const INCUBATION_CENTRE = {
  name:       'IncubatX Innovation Hub',
  tagline:    'Empowering India\'s next generation of deep-tech startups',
  location:   'Mumbai, Maharashtra — India',
  established: '2018',
  email:      'hello@incubatx.in',
  phone:      '+91 98765 43210',
  website:    'https://incubatx.in',
  linkedin:   'https://linkedin.com/company/incubatx',
  followers:  14_800,
  employees:  '11–50',
  type:       'DPIIT-Recognised Incubator',
  certifications: ['DPIIT Recognised', 'BIRAC Empanelled', 'AIM Partner', 'MeitY TIDE 2.0'],
};

const NEWS_ITEMS = [
  {
    id: 1,
    date: new Date(Date.now() - 2 * 86_400_000),
    content: '🎉 Congratulations to our cohort 2024 batch — 8 startups have crossed ₹1 Crore ARR this quarter! A testament to the relentless effort of our founders and mentors. #IncubatX #StartupIndia #Milestones',
    likes: 342,
    comments: 47,
    reposts: 28,
    image: null,
    tag: 'Milestone',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 2,
    date: new Date(Date.now() - 5 * 86_400_000),
    content: '📢 Applications are now open for our Cohort 2025 programme. We are looking for deep-tech, AI, AgriTech, and HealthTech startups ready to scale. Equity-free support + grant facilitation (SISFS, TIDE 2.0). Apply by May 30. Link in bio! #StartupIndia #Incubation #DeepTech',
    likes: 519,
    comments: 83,
    reposts: 61,
    image: null,
    tag: 'Applications Open',
    tagColor: 'bg-violet-100 text-violet-700',
  },
  {
    id: 3,
    date: new Date(Date.now() - 9 * 86_400_000),
    content: '🤝 We are proud to announce our MoU with IIT Bombay for collaborative research programmes, IP co-creation, and mentor exchange. Our startups now get access to IIT\'s world-class labs and 300+ expert faculty. #IITBombay #DeepTech #Innovation',
    likes: 721,
    comments: 96,
    reposts: 112,
    image: null,
    tag: 'Partnership',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 4,
    date: new Date(Date.now() - 14 * 86_400_000),
    content: '💰 Two of our portfolio startups — GreenByte AI and MedAssist — have successfully raised seed rounds totalling ₹4.2 Cr from angel investors this month! Proud of the teams and grateful to all the investors who backed them. #Fundraising #HealthTech #CleanTech',
    likes: 487,
    comments: 64,
    reposts: 53,
    image: null,
    tag: 'Funding',
    tagColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: 5,
    date: new Date(Date.now() - 21 * 86_400_000),
    content: '🏆 IncubatX has been ranked #3 in the DPIIT National Incubator Rankings 2024 — Western Region! This is a result of our startups\' collective excellence and our team\'s dedication. Onward! #DPIIT #NationalRanking #ProudMoment',
    likes: 1_204,
    comments: 178,
    reposts: 234,
    image: null,
    tag: 'Award',
    tagColor: 'bg-rose-100 text-rose-700',
  },
];

// ── status configs ─────────────────────────────────────────────────────────────

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:  { label: 'Pending Review',  color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',     icon: <Clock size={13} /> },
  accepted: { label: 'Accepted',        color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: <CheckCircle size={13} /> },
  rejected: { label: 'Rejected',        color: 'text-red-600',     bg: 'bg-red-50 border-red-200',         icon: <XCircle size={13} /> },
  hold:     { label: 'On Hold',         color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',       icon: <PauseCircle size={13} /> },
  enquire:  { label: 'Under Enquiry',   color: 'text-violet-700',  bg: 'bg-violet-50 border-violet-200',   icon: <HelpCircle size={13} /> },
};

const STATUS_VARIANT: Record<string, any> = {
  active: 'success', inactive: 'warning', graduated: 'info', suspended: 'danger',
};

// ── sub-components ─────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string | number;
  sub?: string; color: string;
}) {
  return (
    <div className={clsx('rounded-2xl p-5 border flex items-start gap-4', color)}>
      <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium opacity-70 mb-0.5">{label}</p>
        <p className="text-2xl font-black leading-none">{value}</p>
        {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function LinkedInNewsCard({ item }: { item: typeof NEWS_ITEMS[0] }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-shadow">
      {/* Post header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-sm">iX</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-slate-900 leading-none">{INCUBATION_CENTRE.name}</p>
            <span className={clsx('text-xs px-2 py-0.5 rounded-full font-semibold', item.tagColor)}>{item.tag}</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {INCUBATION_CENTRE.followers.toLocaleString()} followers · {timeAgo(item.date)}
          </p>
        </div>
        <LinkedinIcon size={16} className="text-[#0077B5] flex-shrink-0 mt-0.5" />
      </div>

      {/* Content */}
      <p className="text-sm text-slate-700 leading-relaxed mb-3 line-clamp-4">{item.content}</p>

      {/* Engagement */}
      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-2.5">
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
            <ThumbsUp size={9} className="text-white" />
          </span>
          {(item.likes + (liked ? 1 : 0)).toLocaleString()}
        </span>
        <div className="flex items-center gap-3">
          <span>{item.comments} comments</span>
          <span>{item.reposts} reposts</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 border-t border-slate-100 mt-2.5 pt-2.5">
        <button
          onClick={() => setLiked((v) => !v)}
          className={clsx(
            'flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-lg transition-colors',
            liked ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
          )}
        >
          <ThumbsUp size={13} /> Like
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
          <MessageSquare size={13} /> Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
          <Repeat2 size={13} /> Repost
        </button>
        <button
          onClick={() => setSaved((v) => !v)}
          className={clsx(
            'flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-lg transition-colors',
            saved ? 'text-violet-600 bg-violet-50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
          )}
        >
          <Bookmark size={13} /> Save
        </button>
      </div>
    </div>
  );
}

// ── page ───────────────────────────────────────────────────────────────────────

export default function InvestorEvaluatePage() {
  const [newsCount, setNewsCount] = useState(3);

  // Fetch all startups for dashboard stats
  const { data: startupsData } = useQuery({
    queryKey: ['all-startups-summary'],
    queryFn: () => startupsApi.getAll({ limit: 200 }).then((r) => r.data),
    staleTime: 60_000,
  });

  // Fetch my funded interests
  const { data: myInterests = [], isLoading } = useQuery({
    queryKey: ['my-funding-interests'],
    queryFn: () => fundingInterestsApi.getMy().then((r) => r.data as any[]),
    staleTime: 30_000,
  });

  const allStartups: any[] = startupsData?.startups ?? [];
  const activeStartups     = allStartups.filter((s) => s.status === 'active').length;
  const graduatedStartups  = allStartups.filter((s) => s.status === 'graduated').length;
  const sectors            = [...new Set(allStartups.map((s) => s.sector?.primary).filter(Boolean))];
  const cohortYears        = [...new Set(allStartups.map((s) => s.cohortYear).filter(Boolean))].sort();

  const totalPledged  = myInterests.reduce((s: number, i: any) => s + i.amount, 0);
  const totalAccepted = myInterests.filter((i: any) => i.status === 'accepted').reduce((s: number, i: any) => s + i.amount, 0);
  const totalPending  = myInterests.filter((i: any) => i.status === 'pending').length;

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* ── Page title ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <TrendingUp size={22} className="text-violet-500" />
              Investor Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Incubation centre overview, latest news, and your investment portfolio
            </p>
          </div>
          <a
            href={INCUBATION_CENTRE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#0077B5] hover:bg-[#005e94] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <LinkedinIcon size={15} />
            Follow on LinkedIn
            <ArrowUpRight size={13} />
          </a>
        </div>

        {/* ── Startups Supported Stats ────────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Building2 size={14} /> Startups Supported
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Building2 size={18} className="text-violet-600" />}
              label="Total Startups"
              value={allStartups.length || '—'}
              sub={`${activeStartups} active now`}
              color="bg-violet-50 border-violet-100 text-violet-900"
            />
            <StatCard
              icon={<Trophy size={18} className="text-emerald-600" />}
              label="Graduated"
              value={graduatedStartups || '—'}
              sub="Successfully scaled"
              color="bg-emerald-50 border-emerald-100 text-emerald-900"
            />
            <StatCard
              icon={<Layers size={18} className="text-blue-600" />}
              label="Cohorts"
              value={cohortYears.length || '—'}
              sub={cohortYears.length ? `${cohortYears[0]}–${cohortYears[cohortYears.length - 1]}` : ''}
              color="bg-blue-50 border-blue-100 text-blue-900"
            />
            <StatCard
              icon={<Zap size={18} className="text-amber-600" />}
              label="Sectors"
              value={sectors.length || '—'}
              sub="Industries covered"
              color="bg-amber-50 border-amber-100 text-amber-900"
            />
          </div>
        </section>

        {/* ── Sector tags ──────────────────────────────────────────────────────── */}
        {sectors.length > 0 && (
          <div className="flex flex-wrap gap-2 -mt-2">
            {sectors.map((s) => (
              <span key={s} className="text-xs bg-white border border-slate-200 text-slate-600 rounded-full px-3 py-1 font-medium shadow-sm">
                {s}
              </span>
            ))}
          </div>
        )}

        {/* ── Centre + News ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Incubation Centre card — 2 cols */}
          <div className="lg:col-span-2 space-y-5">
            <section>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Building2 size={14} /> Incubation Centre
              </h2>

              {/* Centre identity */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="h-20 bg-gradient-to-r from-violet-600 via-violet-700 to-indigo-700 relative">
                  <div className="absolute bottom-0 left-4 translate-y-1/2">
                    <div className="w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-violet-700 font-black text-xl">iX</span>
                    </div>
                  </div>
                </div>

                <div className="pt-12 px-5 pb-5">
                  <h3 className="text-base font-black text-slate-900">{INCUBATION_CENTRE.name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5 leading-snug">{INCUBATION_CENTRE.tagline}</p>

                  {/* LinkedIn follower count */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-[#0077B5]/10 text-[#0077B5] px-3 py-1.5 rounded-xl text-sm font-bold">
                      <LinkedinIcon size={14} />
                      {INCUBATION_CENTRE.followers.toLocaleString()} followers
                    </div>
                    <span className="text-xs text-slate-400">{INCUBATION_CENTRE.employees} employees</span>
                  </div>

                  {/* Certifications */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {INCUBATION_CENTRE.certifications.map((c) => (
                      <span key={c} className="text-xs bg-violet-50 text-violet-700 border border-violet-100 rounded-full px-2 py-0.5 font-medium">
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                      {INCUBATION_CENTRE.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-slate-400 flex-shrink-0" />
                      Established {INCUBATION_CENTRE.established}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-slate-400 flex-shrink-0" />
                      <a href={`mailto:${INCUBATION_CENTRE.email}`} className="text-violet-600 hover:underline">
                        {INCUBATION_CENTRE.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-slate-400 flex-shrink-0" />
                      {INCUBATION_CENTRE.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe size={13} className="text-slate-400 flex-shrink-0" />
                      <a href={INCUBATION_CENTRE.website} target="_blank" rel="noopener noreferrer"
                        className="text-violet-600 hover:underline flex items-center gap-1">
                        {INCUBATION_CENTRE.website.replace('https://', '')}
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-4 flex gap-2">
                    <a
                      href={INCUBATION_CENTRE.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-[#0077B5] hover:bg-[#005e94] text-white text-sm font-semibold px-3 py-2 rounded-xl transition-colors"
                    >
                      <LinkedinIcon size={14} /> Follow
                    </a>
                    <a
                      href={INCUBATION_CENTRE.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-3 py-2 rounded-xl transition-colors"
                    >
                      <Globe size={14} /> Website
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* My Investment Summary */}
            <section>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <DollarSign size={14} /> My Portfolio
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <p className="text-xs text-slate-400 mb-1">Startups Backed</p>
                  <p className="text-2xl font-black text-slate-900">{myInterests.length}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <p className="text-xs text-slate-400 mb-1">Total Pledged</p>
                  <p className="text-2xl font-black text-violet-600">{fmtAmount(totalPledged)}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <p className="text-xs text-slate-400 mb-1">Accepted</p>
                  <p className="text-2xl font-black text-emerald-600">{fmtAmount(totalAccepted)}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <p className="text-xs text-slate-400 mb-1">Pending</p>
                  <p className="text-2xl font-black text-amber-600">{totalPending}</p>
                </div>
              </div>
            </section>
          </div>

          {/* News feed — 3 cols */}
          <div className="lg:col-span-3">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <LinkedinIcon size={14} className="text-[#0077B5]" /> LinkedIn News & Updates
            </h2>

            <div className="space-y-4">
              {NEWS_ITEMS.slice(0, newsCount).map((item) => (
                <LinkedInNewsCard key={item.id} item={item} />
              ))}

              {newsCount < NEWS_ITEMS.length && (
                <button
                  onClick={() => setNewsCount((n) => Math.min(n + 2, NEWS_ITEMS.length))}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-violet-600 hover:text-violet-800 bg-white border border-slate-200 rounded-2xl hover:bg-violet-50 transition-colors"
                >
                  Show more <ChevronRight size={15} />
                </button>
              )}

              {newsCount >= NEWS_ITEMS.length && (
                <a
                  href={INCUBATION_CENTRE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-[#0077B5] bg-white border border-slate-200 rounded-2xl hover:bg-blue-50 transition-colors"
                >
                  <LinkedinIcon size={15} /> View all posts on LinkedIn <ArrowUpRight size={13} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── My Funded Startups ───────────────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Users size={14} /> My Funded Startups
          </h2>

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3].map((i) => <div key={i} className="h-52 rounded-2xl bg-slate-100 animate-pulse" />)}
            </div>
          )}

          {!isLoading && myInterests.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center py-16 gap-3">
              <DollarSign size={36} className="text-slate-200" />
              <p className="text-slate-500 font-medium">No funded startups yet</p>
              <p className="text-slate-400 text-sm text-center max-w-xs">
                Go to <strong>Portfolio</strong> and click a startup card to express funding interest.
              </p>
            </div>
          )}

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
                      'flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border',
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
                          {startup?.sector?.primary && <Badge variant="info">{startup.sector.primary}</Badge>}
                          {startup?.stage && <Badge variant="outline">{startup.stage.replace('_', ' ')}</Badge>}
                          {startup?.status && (
                            <Badge variant={STATUS_VARIANT[startup.status] ?? 'default'}>{startup.status}</Badge>
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

                    {interest.message && (
                      <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5">
                        <p className="text-xs text-slate-400 mb-1">Your message</p>
                        <p className="text-sm text-slate-600 leading-relaxed">&ldquo;{interest.message}&rdquo;</p>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-xs text-slate-400 pt-1 border-t border-slate-50">
                      {startup?.cohortYear && (
                        <span className="flex items-center gap-1"><Calendar size={11} /> {startup.cohortYear}</span>
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
                          {new Date(interest.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {totalPending > 0 && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mt-4">
              <Clock size={12} className="inline mr-1.5" />
              {totalPending} interest{totalPending > 1 ? 's are' : ' is'} pending review by the startup founder.
            </p>
          )}
        </section>

      </div>
    </DashboardLayout>
  );
}
