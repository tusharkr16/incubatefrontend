import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, MapPin, Users, Zap, Target, Globe, TrendingUp,
  Building2, Star, Quote, CheckCircle, BarChart2, Shield,
  Brain, Layers, ChevronRight,
} from 'lucide-react';
import { LandingNav } from '@/components/LandingNav';

// ── Hero ──────────────────────────────────────────────────────────────────────

function AboutHero() {
  return (
    <section className="relative min-h-[60vh] flex items-end pb-20 pt-32 px-8 overflow-hidden bg-slate-900">
      <Image
        src="/gurgaon-hero.png"
        alt="IncubatX"
        fill
        className="object-cover object-center opacity-50"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <p className="text-xs font-bold tracking-[0.22em] text-white/40 uppercase mb-5">About incubatX</p>
        <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight max-w-4xl">
          The startup ecosystem<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5c35] via-orange-400 to-amber-400">
            is broken where it matters most.
          </span>
        </h1>
        <p className="text-white/60 text-lg mt-6 max-w-xl leading-relaxed">
          Applications are repeated. Data is scattered. Outcomes are unclear.
          We&apos;re here to fix that.
        </p>
        <div className="flex flex-wrap gap-3 mt-8">
          {['Low accountability', 'Inefficient capital use', 'Fragmented information', 'No real impact tracking'].map((tag) => (
            <span key={tag} className="text-xs font-medium text-white/50 border border-white/15 bg-white/5 px-4 py-2 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── What We Do ────────────────────────────────────────────────────────────────

const OUTCOMES = [
  { icon: <Zap size={18} />,        label: 'Faster decisions',          color: 'text-amber-400 bg-amber-500/10' },
  { icon: <BarChart2 size={18} />,  label: 'Measurable outcomes',       color: 'text-violet-400 bg-violet-500/10' },
  { icon: <Shield size={18} />,     label: 'Audit-ready systems',       color: 'text-emerald-400 bg-emerald-500/10' },
  { icon: <Layers size={18} />,     label: 'Scalable program execution', color: 'text-blue-400 bg-blue-500/10' },
  { icon: <Brain size={18} />,      label: 'Decision intelligence',     color: 'text-rose-400 bg-rose-500/10' },
];

function WhatWeDoSection() {
  return (
    <section className="bg-stone-50 py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left */}
          <div className="space-y-7">
            <p className="text-xs font-bold tracking-[0.22em] text-slate-400 uppercase">What We Do</p>
            <h2 className="text-5xl font-black text-slate-900 leading-[1.06] tracking-tight">
              We don&apos;t just connect<br />the ecosystem —
              <span className="text-[#ff5c35]"> we structure it.</span>
            </h2>
            <p className="text-slate-500 text-[1.05rem] leading-relaxed max-w-lg">
              IncubatX is an AI-driven SaaS platform designed to bring startups,
              incubators, and investors into one unified, intelligent system.
              From application processing to startup evaluation, from fund tracking
              to impact measurement — scattered workflows become a single,
              data-driven operating layer.
            </p>
            <p className="text-xl font-black text-slate-900">
              And most importantly — clarity.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#ff5c35] hover:bg-[#e84e2a] text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-all shadow-xl shadow-orange-600/30 hover:scale-[1.02]"
            >
              See the platform <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right — outcome cards */}
          <div className="space-y-3">
            {OUTCOMES.map((o) => (
              <div key={o.label} className="flex items-center gap-4 bg-white border border-black/8 rounded-2xl px-5 py-4 hover:shadow-sm transition-shadow">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${o.color}`}>
                  {o.icon}
                </div>
                <p className="font-semibold text-slate-800">{o.label}</p>
                <CheckCircle size={15} className="text-emerald-400 ml-auto flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Why It Matters ────────────────────────────────────────────────────────────

const DEMAND_CARDS = [
  {
    who: 'Institutions',
    need: 'are expected to show impact',
    icon: <Building2 size={20} />,
    color: 'border-violet-500/30 bg-violet-500/5 text-violet-400',
  },
  {
    who: 'Governments',
    need: 'are demanding accountability',
    icon: <Shield size={20} />,
    color: 'border-blue-500/30 bg-blue-500/5 text-blue-400',
  },
  {
    who: 'Investors',
    need: 'want visibility',
    icon: <TrendingUp size={20} />,
    color: 'border-amber-500/30 bg-amber-500/5 text-amber-400',
  },
  {
    who: 'Startups',
    need: 'need direction, not noise',
    icon: <Zap size={20} />,
    color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
  },
];

function WhyItMattersSection() {
  return (
    <section className="bg-[#111111] py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <div className="space-y-7">
            <p className="text-xs font-bold tracking-[0.22em] text-slate-500 uppercase">Why It Matters</p>
            <h2 className="text-5xl font-black text-white leading-[1.06] tracking-tight">
              The future of incubation is not about more programs.
            </h2>
            <p className="text-3xl font-black text-[#ff5c35] leading-tight">
              It&apos;s about better outcomes.
            </p>
            <p className="text-slate-400 text-base leading-relaxed max-w-lg">
              IncubatX sits at the intersection of all these demands — turning data
              into intelligence, and intelligence into action.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-8 h-8 rounded-xl bg-[#ff5c35]/15 text-[#ff5c35] flex items-center justify-center">
                <Target size={16} />
              </div>
              <p className="text-white/70 text-sm font-semibold">
                One platform. Every stakeholder. Zero ambiguity.
              </p>
            </div>
          </div>

          {/* Right — demand cards */}
          <div className="grid grid-cols-2 gap-4">
            {DEMAND_CARDS.map((c) => (
              <div key={c.who} className={`rounded-2xl border p-6 space-y-3 ${c.color.split(' ')[0]} ${c.color.split(' ')[1]}`}>
                <div className={c.color.split(' ')[2]}>{c.icon}</div>
                <p className="text-white font-black text-lg leading-tight">{c.who}</p>
                <p className="text-slate-400 text-sm leading-snug">{c.need}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── What Makes Us Different ───────────────────────────────────────────────────

const DIFFERENTIATORS = [
  { from: 'Not just applications',     to: 'Better applications — structured, scored, evaluated',     icon: <Brain size={20} />,     color: 'violet' },
  { from: 'Not just tracking',         to: 'Real impact measurement — jobs, revenue, IP, outcomes',   icon: <BarChart2 size={20} />, color: 'blue' },
  { from: 'Not just data',             to: 'Decision intelligence — AI-powered insights, zero guesswork', icon: <Zap size={20} />,  color: 'amber' },
  { from: 'Not just growth',           to: 'Scalable systems — built for 10x, not just today',        icon: <TrendingUp size={20} />, color: 'emerald' },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  violet:  { bg: 'bg-violet-500/10',  text: 'text-violet-400',  border: 'border-violet-500/20' },
  blue:    { bg: 'bg-blue-500/10',    text: 'text-blue-400',    border: 'border-blue-500/20' },
  amber:   { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/20' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
};

function WhatMakesUsDifferentSection() {
  return (
    <section className="bg-stone-50 border-t border-black/6 py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-xs font-bold tracking-[0.22em] text-slate-400 uppercase">What Makes Us Different</p>
          <h2 className="text-5xl font-black text-slate-900 leading-[1.06] tracking-tight">
            Most platforms give you access.<br />
            <span className="text-[#ff5c35]">We help you execute, measure, and improve.</span>
          </h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            This is not another tool. It&apos;s the backbone for modern incubation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {DIFFERENTIATORS.map((d) => {
            const c = COLOR_MAP[d.color];
            return (
              <div key={d.from} className="bg-white border border-black/8 rounded-2xl p-6 space-y-4 hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.bg} ${c.text}`}>
                  {d.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-2 line-through decoration-slate-300">{d.from}</p>
                  <p className="text-base font-bold text-slate-900 leading-snug">{d.to}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Who We Work With ─────────────────────────────────────────────────────────

const WHO_WE_WORK = [
  {
    label: 'Incubators & Accelerators',
    desc: 'Replace fragmented tools with one intelligent system. Track cohorts, measure impact, report with confidence.',
    icon: <Building2 size={22} />,
    bg: 'bg-violet-600',
  },
  {
    label: 'Government & Institutional Programs',
    desc: 'Move from activity reporting to outcome accountability. Audit-ready, always.',
    icon: <Shield size={22} />,
    bg: 'bg-blue-600',
  },
  {
    label: 'CSR & Innovation Initiatives',
    desc: 'Prove social and economic return on every rupee invested in the startup ecosystem.',
    icon: <Globe size={22} />,
    bg: 'bg-emerald-600',
  },
  {
    label: 'High-Potential Startups',
    desc: 'Get visibility, structured onboarding, and fair evaluation — not just another pipeline.',
    icon: <Zap size={22} />,
    bg: 'bg-[#ff5c35]',
  },
];

function WhoWeWorkWithSection() {
  return (
    <section className="bg-[#0f0f0f] py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-xs font-bold tracking-[0.22em] text-slate-500 uppercase">Who We Work With</p>
          <h2 className="text-5xl font-black text-white leading-[1.06] tracking-tight">
            If you&apos;re building, managing, or<br />funding innovation —
          </h2>
          <p className="text-2xl font-black text-amber-400">
            you&apos;re already part of this system.
          </p>
          <p className="text-slate-500 text-base max-w-lg mx-auto">
            The question is whether your system is ready for scale.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHO_WE_WORK.map((w) => (
            <div key={w.label} className="bg-white/5 border border-white/8 rounded-2xl p-6 space-y-4 hover:bg-white/8 transition-colors">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${w.bg}`}>
                {w.icon}
              </div>
              <h3 className="font-black text-white text-base leading-snug">{w.label}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Why Join ─────────────────────────────────────────────────────────────────

function WhyJoinSection() {
  return (
    <section className="bg-stone-50 border-t border-black/6 py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div className="space-y-8">
            <p className="text-xs font-bold tracking-[0.22em] text-slate-400 uppercase">Why Join IncubatX</p>
            <h2 className="text-5xl font-black text-slate-900 leading-[1.06] tracking-tight">
              Because the ecosystem is shifting.
            </h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4 bg-white border border-black/8 rounded-2xl px-6 py-5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm mb-1">Those who adopt structured, intelligent systems</p>
                  <p className="text-sm text-slate-500">will scale faster, report better, and attract more opportunities.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white border border-black/8 rounded-2xl px-6 py-5">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Layers size={18} />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm mb-1">Those who don&apos;t</p>
                  <p className="text-sm text-slate-500">will keep operating in silos — slower, noisier, and harder to sustain.</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-900 rounded-2xl">
              <p className="text-white font-black text-lg mb-1">IncubatX is not just a platform you join.</p>
              <p className="text-[#ff5c35] font-semibold text-sm">It&apos;s a layer you build on.</p>
            </div>
          </div>

          {/* Right — CTA block */}
          <div className="bg-gradient-to-br from-[#1a0a2e] to-[#0a0a1a] border border-violet-500/20 rounded-3xl p-10 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/15 blur-3xl rounded-full pointer-events-none" />
            <div className="relative space-y-6">
              <p className="text-xs font-bold tracking-[0.22em] text-violet-400 uppercase">Let&apos;s Build What Actually Works</p>
              <div className="space-y-3 text-sm text-slate-300">
                {[
                  'If you\'re serious about outcomes, not just activity',
                  'If you want to move from fragmented execution to intelligent systems',
                  'If you\'re ready to scale without chaos',
                ].map((line, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <ChevronRight size={14} className="text-violet-400 flex-shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
              <p className="text-white font-black text-xl">
                Then it&apos;s time to be part of IncubatX.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2 bg-[#ff5c35] hover:bg-[#e84e2a] text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-xl shadow-orange-600/30"
                >
                  Book a Demo <ArrowRight size={14} />
                </Link>
                <Link
                  href="/membership"
                  className="flex items-center justify-center gap-2 border border-violet-500/30 hover:border-violet-400/50 text-violet-300 hover:text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-all hover:bg-violet-500/10"
                >
                  View Membership <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Founder section data ──────────────────────────────────────────────────────

const FOUNDER_STATS = [
  { value: '10+',       label: 'Years in Ecosystem',        icon: <Star size={16} /> },
  { value: '100+',      label: 'Startups Mentored',         icon: <Building2 size={16} /> },
  { value: '₹15–20Cr+', label: 'Funding Enabled',           icon: <TrendingUp size={16} /> },
  { value: '135+',      label: 'Programmes (DST)',           icon: <Globe size={16} /> },
  { value: '95+',       label: 'Nationalities Collaborated', icon: <Users size={16} /> },
];

const FOUNDER_JOURNEY = [
  {
    phase: 'The Ground',
    title: 'Design, Product & Brand — At Scale',
    body: 'Began with curiosity and experimentation, collaborating with iconic brands — Samsung, Canon, and Mahindra Magucho — across design, product, and marketing. Every engagement sharpened one instinct: the gap between ideas and execution is infrastructure.',
    brands: ['Samsung', 'Canon', 'Mahindra Magucho'],
    color: 'border-violet-500/40 bg-violet-500/5',
    dot: 'bg-violet-500',
  },
  {
    phase: 'The Insight',
    title: 'Sharda Launchpad · DST-Supported TBI',
    body: 'As CEO of Sharda Launchpad, mentored 100+ startups and enabled ₹15–20Cr+ in funding. Worked alongside NITI Aayog on national startup initiatives. The pattern became undeniable: great startups failed not from bad ideas, but from fragmented access, inconsistent incubation standards, and opaque evaluation.',
    brands: ['NITI Aayog', 'DST Govt. of India'],
    color: 'border-[#ff5c35]/40 bg-[#ff5c35]/5',
    dot: 'bg-[#ff5c35]',
  },
  {
    phase: 'The Global Lens',
    title: '95+ Nationalities · 135+ Programmes',
    body: "Through DST engagements, worked with people from 95+ nationalities across 135+ global programmes. This breadth brought a rare perspective: the startup ecosystem's challenges are universal, but the solutions must be local, practical, and executable.",
    brands: ['95+ Nationalities', '135+ Programmes'],
    color: 'border-emerald-500/40 bg-emerald-500/5',
    dot: 'bg-emerald-500',
  },
  {
    phase: 'The Creation',
    title: 'Incubatx — A Trend Catcher Ecosystem Builder',
    body: 'This insight led to Incubatx.com — designed not as a marketplace but as a "trend catcher ecosystem builder." The platform bridges startups, investors, and incubators through standardized frameworks, transparent processes, and democratized access. Opportunities no longer gatekept — but open.',
    brands: ['Incubatx.com'],
    color: 'border-amber-500/40 bg-amber-500/5',
    dot: 'bg-amber-400',
  },
];

const PHILOSOPHY = [
  { label: 'Execution over optics',    color: 'bg-violet-500/15 text-violet-300 border-violet-500/30' },
  { label: 'Access over exclusivity',  color: 'bg-[#ff5c35]/15 text-orange-300 border-orange-500/30' },
  { label: 'Systems over silos',       color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
];

function FounderSection() {
  return (
    <section className="bg-[#0c0c0c] py-24 px-8 overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-violet-700/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-[#ff5c35]/8 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <p className="text-xs font-bold tracking-[0.22em] text-slate-500 uppercase mb-6 text-center">
          Founded By
        </p>

        {/* Founder identity hero */}
        <div className="flex flex-col lg:flex-row gap-10 items-start mb-20 max-w-5xl mx-auto">
          <div className="flex-shrink-0 flex flex-col items-center lg:items-start gap-5">
            <div className="relative">
              <div className="w-36 h-36 rounded-3xl overflow-hidden shadow-2xl shadow-violet-900/50 ring-2 ring-violet-500/30">
                <Image
                  src="/founder-anurag.png"
                  alt="Anurag Pandey — Founder & CEO, IncubatX"
                  width={144}
                  height={144}
                  className="w-full h-full object-cover object-top"
                  priority
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-[#0c0c0c] uppercase tracking-wide">
                Founder & CEO
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white leading-tight tracking-tight text-center lg:text-left">
                Anurag Pandey
              </h2>
              <p className="text-slate-500 text-sm mt-1 text-center lg:text-left">
                Founder, incubatX &mdash; CEO, Sharda Launchpad
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {PHILOSOPHY.map((p) => (
                <span key={p.label} className={`text-xs font-bold px-3 py-1.5 rounded-full border ${p.color}`}>
                  {p.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-7">
            <div className="relative">
              <Quote size={32} className="text-violet-600/40 absolute -top-2 -left-2" />
              <blockquote className="text-xl lg:text-2xl font-semibold text-white/85 leading-relaxed pl-6 italic">
                Promising startups struggle not because of lack of ideas, but due to fragmented access
                to investors, inconsistent incubation standards, and opaque processes.
              </blockquote>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {FOUNDER_STATS.map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/8 rounded-xl p-3 text-center">
                  <div className="flex justify-center text-violet-400 mb-1.5">{s.icon}</div>
                  <p className="text-lg font-black text-white leading-none">{s.value}</p>
                  <p className="text-[10px] text-slate-500 mt-1 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Journey timeline */}
        <div className="max-w-5xl mx-auto mb-16">
          <p className="text-xs font-bold tracking-[0.22em] text-slate-500 uppercase mb-8 text-center">The Journey</p>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/60 via-[#ff5c35]/40 to-amber-500/40 hidden sm:block" />
            <div className="space-y-6">
              {FOUNDER_JOURNEY.map((step, i) => (
                <div key={i} className="relative sm:pl-14">
                  <div className={`absolute left-2 top-5 w-5 h-5 rounded-full ${step.dot} border-4 border-[#0c0c0c] hidden sm:block shadow-lg`} />
                  <div className={`rounded-2xl border p-6 ${step.color}`}>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-1">{step.phase}</p>
                    <h3 className="text-lg font-black text-white mb-3 leading-tight">{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.body}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {step.brands.map((b) => (
                        <span key={b} className="text-xs font-semibold text-white/60 bg-white/8 border border-white/10 px-3 py-1 rounded-full">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vision statement */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent mx-auto" />
          <p className="text-slate-400 text-base leading-relaxed">
            Today,{' '}
            <span className="text-white font-semibold">Incubatx stands as an extension of that journey</span> —
            a solution born from 10+ years of ground-level experience, aimed at making the startup ecosystem
            more transparent, efficient, and truly scalable.
          </p>
          <p className="text-slate-500 text-sm leading-relaxed">
            By removing information asymmetry and introducing clarity, the platform ensures
            that opportunities are no longer gatekept but democratized.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#ff5c35] hover:bg-[#e84e2a] text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-all shadow-xl shadow-orange-600/30"
            >
              Join the ecosystem Anurag built <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-10 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-lg tracking-tight">
            incubate<span className="text-violet-400">X</span>
          </span>
        </div>
        <div className="flex items-center gap-6 text-slate-500 text-sm">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/platform" className="hover:text-white transition-colors">Platform</Link>
          <Link href="/membership" className="hover:text-white transition-colors">Membership</Link>
          <Link href="/register" className="hover:text-white transition-colors">Book a Demo</Link>
        </div>
        <p className="text-slate-600 text-sm">© 2025 incubatX. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ── page ───────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="bg-stone-50 min-h-screen">
      <LandingNav activeHref="/about" />
      <AboutHero />
      <WhatWeDoSection />
      <WhyItMattersSection />
      <WhatMakesUsDifferentSection />
      <WhoWeWorkWithSection />
      <WhyJoinSection />
      <FounderSection />
      <Footer />
    </div>
  );
}
