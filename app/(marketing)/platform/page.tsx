import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LandingNav } from '@/components/LandingNav';

// ── Platform Hero ─────────────────────────────────────────────────────────────
function PlatformHero() {
  return (
    <section className="bg-[#111111] pt-32 pb-24 px-8 text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-6xl lg:text-7xl font-light text-white leading-[1.08] tracking-tight">
          One OS for your<br />entire ecosystem
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto">
          Every tool your accelerator needs — from application to graduation —
          unified in one intelligent platform built for scale.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/register"
            className="flex items-center gap-2 bg-[#ff5c35] hover:bg-[#e84e2a] text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-all shadow-xl shadow-orange-600/30"
          >
            Book a Demo <ArrowRight size={14} />
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-all hover:bg-white/5"
          >
            Register Yourself
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Integrations ──────────────────────────────────────────────────────────────
const INTEGRATIONS = ['Zoom', 'Google Workspace', 'WhatsApp', 'Razorpay'];

const SECURITY_TAGS = ['SOC 2-ready', 'SSO', 'Role-based access', 'Audit logs', 'Data encryption'];

function IntegrationsAndSecurity() {
  return (
    <>
      {/* Integrations — dark */}
      <section className="bg-[#111111] pt-4 pb-24 px-8 text-center border-t border-white/6">
        <div className="max-w-5xl mx-auto space-y-8">
          <h2 className="text-4xl font-light text-white tracking-tight">Integrations</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {INTEGRATIONS.map((name) => (
              <span
                key={name}
                className="border border-white/20 text-white/80 text-sm px-5 py-2 rounded-full"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Security — purple */}
      <section className="bg-[#6c31c8] py-24 px-8 text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          <h2 className="text-4xl font-light text-white tracking-tight">Security &amp; compliance</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {SECURITY_TAGS.map((tag) => (
              <span
                key={tag}
                className="border border-white/25 text-white/80 text-sm px-5 py-2 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ── Platform Modules ──────────────────────────────────────────────────────────

const MODULES = [
  {
    title: 'Program Management',
    sub: 'apply → cohort → graduate',
    mock: [
      { label: 'Cohort 2025-A',   value: 'Active',      badge: true,  badgeColor: 'bg-[#ff5c35] text-white' },
      { label: 'Applications',    value: '142 received', badge: false, valueColor: 'text-slate-500' },
      { label: 'Graduates',       value: '38',          badge: true,  badgeColor: 'bg-emerald-500 text-white' },
    ],
    bullets: [
      'Manage the full lifecycle from open call to demo day',
      'Automate cohort onboarding and milestone tracking',
      'Custom pipelines for every program stage',
    ],
  },
  {
    title: 'Mentor Engine',
    sub: 'matching, scheduling, notes',
    mock: [
      { label: 'Mentor: Priya K.', value: 'Matched',   badge: true,  badgeColor: 'bg-violet-600 text-white' },
      { label: 'Session - Thu 3 PM', value: 'Confirmed', badge: false, valueColor: 'text-slate-500' },
      { label: 'Session notes',    value: '3 saved',   badge: false,  valueColor: 'text-[#ff5c35]' },
    ],
    bullets: [
      'AI-assisted mentor–founder matching by domain fit',
      'Integrated scheduling with calendar sync',
      'Structured session notes and progress tracking',
    ],
  },
  {
    title: 'Evaluation Suite',
    sub: 'drag-drop scoring, multi-round',
    mock: [
      { label: 'Round 2 Scoring', value: 'Live',       badge: true,  badgeColor: 'bg-[#ff5c35] text-white' },
      { label: 'Drag-drop rubric', value: '8 criteria', badge: false, valueColor: 'text-slate-500' },
      { label: 'Avg. score',      value: '7.4 / 10',   badge: false, valueColor: 'text-slate-500' },
    ],
    bullets: [
      'Drag-and-drop rubric builder for any evaluation format',
      'Multi-round workflows with judge assignment',
      'Aggregated scorecards with conflict-of-interest flags',
    ],
  },
  {
    title: 'Analytics & Reporting',
    sub: 'dashboards, sponsor ROI',
    mock: [
      { label: 'Portfolio Dashboard', value: 'Live',          badge: true,  badgeColor: 'bg-emerald-500 text-white' },
      { label: 'Sponsor ROI',         value: '↑ 3.2×',        badge: false, valueColor: 'text-emerald-600' },
      { label: 'Reports exported',    value: '12 this month', badge: false, valueColor: 'text-slate-500' },
    ],
    bullets: [
      'Real-time dashboards across cohort health metrics',
      'Sponsor ROI reports generated in one click',
      'Export-ready data for board and investor updates',
    ],
  },
  {
    title: 'Capital Access',
    sub: 'grants, investor directory',
    mock: [
      { label: 'Grant: DPIIT Seed',   value: 'Eligible',     badge: true,  badgeColor: 'bg-violet-600 text-white' },
      { label: 'Investor Directory',  value: '240+ listed',  badge: false, valueColor: 'text-slate-500' },
      { label: 'Introductions sent',  value: '18 this week', badge: false, valueColor: 'text-[#ff5c35]' },
    ],
    bullets: [
      'Curated grant database with eligibility matching',
      'Investor directory with warm-intro workflows',
      'Fundraising tracker from first meeting to close',
    ],
  },
  {
    title: 'Marketplace',
    sub: 'tools & perks for startups',
    mock: [
      { label: 'AWS Activate', value: 'Claimed',    badge: true,  badgeColor: 'bg-emerald-500 text-white' },
      { label: 'Stripe Atlas', value: 'Available',  badge: false, valueColor: 'text-slate-500' },
      { label: 'Perks unlocked', value: '$48k value', badge: false, valueColor: 'text-[#ff5c35]' },
    ],
    bullets: [
      'Curated tool stack with exclusive startup discounts',
      'One-click perk redemption and tracking',
      'Partner network spanning cloud, legal, and finance',
    ],
  },
];

function ModuleCard({ mod }: { mod: typeof MODULES[number] }) {
  return (
    <div className="bg-white border border-black/8 rounded-2xl overflow-hidden">
      {/* Mini dashboard mock */}
      <div className="border-b border-black/6 p-5 space-y-2.5">
        {mod.mock.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-sm">
            <span className="text-slate-600">{row.label}</span>
            {row.badge ? (
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${row.badgeColor}`}>{row.value}</span>
            ) : (
              <span className={`font-medium ${row.valueColor}`}>{row.value}</span>
            )}
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="p-5 space-y-3">
        <div>
          <p className="font-bold text-slate-900">{mod.title}</p>
          <p className="text-xs text-slate-400 mt-0.5">{mod.sub}</p>
        </div>
        <ul className="space-y-1.5">
          {mod.bullets.map((b) => (
            <li key={b} className="text-sm text-slate-600 flex items-start gap-2">
              <span className="text-[#ff5c35] mt-0.5">→</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PlatformModules() {
  return (
    <section className="bg-stone-50 py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-xs font-bold tracking-[0.22em] text-slate-400 uppercase mb-4">Platform Modules</p>
          <h2 className="text-5xl font-black text-slate-900 leading-[1.08] tracking-tight">
            Everything you need.<br />Nothing you don&apos;t.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((mod) => (
            <ModuleCard key={mod.title} mod={mod} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
import Image from 'next/image';
import { Globe } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <Image src="/logo.png" alt="incubatX" width={120} height={36} className="h-8 w-auto object-contain mb-4" />
            <p className="text-slate-500 text-sm leading-relaxed">
              The operating system for startup ecosystems.
            </p>
          </div>
          {[
            { heading: 'Platform', links: ['Overview', 'CEO Dashboard', 'Founder Portal', 'Investor Portal', 'Finance Module'] },
            { heading: 'Company',  links: ['About', 'Blog', 'Careers', 'Contact'] },
            { heading: 'Legal',    links: ['Privacy Policy', 'Terms of Service', 'Security'] },
          ].map((col) => (
            <div key={col.heading}>
              <p className="text-white text-sm font-semibold mb-4">{col.heading}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}><span className="text-slate-500 hover:text-slate-300 text-sm cursor-pointer transition-colors">{l}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <p className="text-slate-600 text-sm">© 2025 incubatX. All rights reserved.</p>
          <div className="flex items-center gap-5 text-slate-600 text-sm">
            <Globe size={14} />
            <span>English</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PlatformPage() {
  return (
    <div className="min-h-screen">
      <LandingNav activeHref="/platform" />
      <PlatformHero />
      <IntegrationsAndSecurity />
      <PlatformModules />
      <Footer />
    </div>
  );
}
