import Link from 'next/link';
import {
  ArrowRight, CheckCircle, Zap, TrendingUp, Shield, Users,
  Building2, Star, Globe, Brain, BarChart2, Award, ChevronRight,
} from 'lucide-react';
import { LandingNav } from '@/components/LandingNav';

// ── data ───────────────────────────────────────────────────────────────────────

const TIERS = [
  {
    id: 'network',
    badge: '01',
    name: 'Network Member',
    tagline: 'Entry-level access for incubators entering structured ecosystem collaboration',
    price: '₹15,000 – ₹30,000',
    period: 'per year',
    color: {
      bg:       'bg-white',
      border:   'border-slate-200',
      badge:    'bg-slate-100 text-slate-500',
      tag:      'bg-slate-900 text-white',
      cta:      'bg-slate-900 hover:bg-slate-700 text-white',
      highlight: false,
    },
    features: [
      'Access to startup, mentor, and investor network',
      'Branding visibility within the IncubatX ecosystem and communications',
      'Access to curated startup pipeline',
      'Monthly founder networking sessions update (cross-incubator exposure)',
      'Access to quarterly retreat experiences (optional participation)',
      'Participation in ecosystem discussions and community sessions',
      'Basic reporting templates and operational insights',
    ],
  },
  {
    id: 'growth',
    badge: '02',
    name: 'Growth Member',
    tagline: 'For incubators managing active cohorts and scaling programs',
    price: '₹40,000 – ₹80,000',
    period: 'per year',
    color: {
      bg:       'bg-[#4c1d95]',
      border:   'border-violet-600',
      badge:    'bg-violet-800/60 text-violet-200',
      tag:      'bg-violet-400 text-violet-950',
      cta:      'bg-white hover:bg-violet-50 text-violet-900',
      highlight: true,
    },
    features: [
      'Everything in Network',
      'Enhanced branding through showcases, demo days, and ecosystem features',
      'Access to verified startup applications and structured deal flow',
      'Program support including application screening and shortlisting frameworks',
      'Standardized dashboards and reporting systems',
      'Mentor and investor matchmaking support',
      'Monthly founder networking sessions',
      'Access to quarterly retreats with deeper collaboration opportunities with curated cohorts guide',
    ],
  },
  {
    id: 'intelligence',
    badge: '03',
    name: 'Intelligence Member',
    tagline: 'Premium tier focused on systemization, scale, and measurable outcomes',
    realGame: true,
    price: '₹1,00,000 – ₹3,00,000',
    period: 'per year',
    color: {
      bg:       'bg-[#0a0a0a]',
      border:   'border-amber-500/40',
      badge:    'bg-amber-500/10 text-amber-400',
      tag:      'bg-amber-400 text-black',
      cta:      'bg-amber-400 hover:bg-amber-300 text-black',
      highlight: false,
    },
    features: [
      'Everything in Growth',
      'Full credit access to IncubatX AI platform for application processing, evaluation, and scoring',
      'Automated startup tracking, cohort lifecycle management, and reporting',
      'Fund tracking and compliance systems (audit-ready by design)',
      'Outcome and impact measurement dashboards',
      'Dedicated onboarding and account management support',
      'Advanced branding through national-level visibility and partner positioning',
      'Priority access to government, CSR, and institutional collaborations',
      'Monthly high-value founder networking with investors and ecosystem leaders',
      'Access to exclusive quarterly retreats (closed-room strategy, partnerships, collaborations)',
    ],
  },
];

const VALUE_PROPS = [
  {
    icon: <TrendingUp size={20} />,
    title: 'Stronger brand positioning',
    desc: 'Within the startup ecosystem — recognised, cited, and preferred by founders and investors.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    icon: <Users size={20} />,
    title: 'Continuous networking',
    desc: 'With founders, mentors, and investors — not just at events, but as an ongoing channel.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: <Zap size={20} />,
    title: 'Structured systems',
    desc: 'Replacing fragmented tools — one OS for your entire incubation programme.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    icon: <BarChart2 size={20} />,
    title: 'Real impact tracking',
    desc: 'Instead of just activity reporting — measurable outcomes that impress auditors and LPs.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: <Globe size={20} />,
    title: 'Scale without chaos',
    desc: 'Ability to scale programs without operational chaos — grow cohorts, not headcount.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
  },
];

const COMPARISON = [
  { label: 'Startup, mentor & investor network',         network: true,  growth: true,  intel: true  },
  { label: 'Branding visibility',                        network: true,  growth: true,  intel: true  },
  { label: 'Quarterly retreats',                         network: true,  growth: true,  intel: true  },
  { label: 'Verified startup deal flow',                 network: false, growth: true,  intel: true  },
  { label: 'Application screening frameworks',           network: false, growth: true,  intel: true  },
  { label: 'Standardized dashboards & reporting',        network: false, growth: true,  intel: true  },
  { label: 'Mentor & investor matchmaking',              network: false, growth: true,  intel: true  },
  { label: 'Full IncubatX AI platform access',           network: false, growth: false, intel: true  },
  { label: 'Automated cohort lifecycle management',      network: false, growth: false, intel: true  },
  { label: 'Fund tracking & compliance (audit-ready)',   network: false, growth: false, intel: true  },
  { label: 'Outcome & impact measurement dashboards',    network: false, growth: false, intel: true  },
  { label: 'Dedicated account management',               network: false, growth: false, intel: true  },
  { label: 'Government, CSR & institutional access',     network: false, growth: false, intel: true  },
  { label: 'Exclusive closed-room strategy retreats',    network: false, growth: false, intel: true  },
];

// ── sections ───────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative bg-[#0a0a0a] pt-32 pb-20 px-8 overflow-hidden">
      {/* ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 border border-white/15 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-bold tracking-widest text-white/60 uppercase">
          <Building2 size={12} /> IncubatX Membership · For Incubators
        </div>

        <h1 className="text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
          Most incubators offer<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-violet-300 to-amber-400">
            space, sessions, and networks.
          </span>
        </h1>

        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Few offer structure. Almost none offer intelligence.{' '}
          <span className="text-white font-semibold">
            IncubatX combines branding, network, and execution
          </span>{' '}
          with a system that actually tracks outcomes.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/register"
            className="flex items-center gap-2 bg-[#ff5c35] hover:bg-[#e84e2a] text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-all shadow-xl shadow-orange-600/30 hover:scale-[1.02]"
          >
            Apply for Membership <ArrowRight size={15} />
          </Link>
          <a
            href="#tiers"
            className="flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-all hover:bg-white/5"
          >
            View Plans <ChevronRight size={15} />
          </a>
        </div>

        {/* Quick stat pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          {[
            '50+ Incubator Network',
            'DPIIT Recognised',
            '3 Membership Tiers',
            'Pan-India Presence',
          ].map((s) => (
            <span key={s} className="text-xs font-medium text-white/50 border border-white/10 bg-white/5 px-4 py-1.5 rounded-full">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function RealityCheck() {
  return (
    <section className="bg-[#111111] border-t border-white/8 py-20 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold tracking-[0.22em] text-slate-500 uppercase">Reality Check</span>
            <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
              If your current setup works only at your current scale —
            </h2>
            <p className="text-3xl font-black text-amber-400 leading-snug">
              it&apos;s already your bottleneck.
            </p>
            <p className="text-slate-400 text-base leading-relaxed max-w-lg">
              The difference between incubators that scale and those that stagnate is not effort.
              It&apos;s infrastructure. Intelligence. And a network with real depth.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: <Brain size={18} />, label: 'Most incubators offer', value: 'Space, sessions, networks', state: 'warn' },
              { icon: <Zap size={18} />,   label: 'Few incubators offer',  value: 'Structure + Systems',      state: 'mid'  },
              { icon: <Star size={18} />,  label: 'Almost none offer',     value: 'Intelligence + Outcomes',   state: 'win'  },
            ].map((row) => (
              <div
                key={row.label}
                className={`flex items-center gap-4 p-5 rounded-2xl border ${
                  row.state === 'warn'
                    ? 'bg-red-500/5 border-red-500/20 text-red-400'
                    : row.state === 'mid'
                    ? 'bg-amber-500/5 border-amber-500/20 text-amber-400'
                    : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                }`}
              >
                <div className="flex-shrink-0">{row.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/40 mb-0.5">{row.label}</p>
                  <p className="font-bold text-white">{row.value}</p>
                </div>
                <div className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  row.state === 'win'
                    ? 'bg-emerald-500/20 border-emerald-500/40'
                    : row.state === 'mid'
                    ? 'bg-amber-500/20 border-amber-500/40'
                    : 'bg-red-500/20 border-red-500/40'
                }`}>
                  {row.state === 'win' ? 'IncubatX' : row.state === 'mid' ? 'Rare' : 'Common'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TierCard({ tier }: { tier: typeof TIERS[0] }) {
  const isIntel = tier.id === 'intelligence';
  const isGrowth = tier.id === 'growth';

  return (
    <div className={`relative flex flex-col rounded-3xl border p-8 ${tier.color.bg} ${tier.color.border} ${
      isGrowth ? 'shadow-2xl shadow-violet-900/50 scale-[1.02]' : ''
    } ${isIntel ? 'shadow-2xl shadow-amber-900/30' : ''}`}>
      {/* Most popular / Real game badge */}
      {isGrowth && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-violet-400 text-violet-950 text-xs font-black px-4 py-1.5 rounded-full tracking-wide uppercase shadow-lg">
            Most Popular
          </span>
        </div>
      )}
      {isIntel && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-amber-400 text-black text-xs font-black px-4 py-1.5 rounded-full tracking-wide uppercase shadow-lg">
            ⚡ The Real Game
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 space-y-3">
        <span className={`inline-flex text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full ${tier.color.badge}`}>
          {tier.badge}
        </span>

        <h3 className={`text-2xl font-black leading-tight ${isGrowth || isIntel ? 'text-white' : 'text-slate-900'}`}>
          {tier.name}
        </h3>

        <p className={`text-sm leading-snug ${isGrowth ? 'text-violet-300' : isIntel ? 'text-slate-400' : 'text-slate-500'}`}>
          {tier.tagline}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6 pb-6 border-b border-white/10">
        <p className={`text-3xl font-black leading-none ${isGrowth || isIntel ? 'text-white' : 'text-slate-900'}`}>
          {tier.price}
        </p>
        <p className={`text-xs mt-1 font-medium ${isGrowth ? 'text-violet-300/70' : isIntel ? 'text-slate-500' : 'text-slate-400'}`}>
          {tier.period} · All-inclusive
        </p>
      </div>

      {/* Features */}
      <ul className="space-y-3 flex-1 mb-8">
        {tier.features.map((f, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle
              size={15}
              className={`flex-shrink-0 mt-0.5 ${
                isIntel ? 'text-amber-400' : isGrowth ? 'text-violet-300' : 'text-emerald-500'
              }`}
            />
            <span className={`text-sm leading-snug ${
              isGrowth || isIntel ? 'text-white/75' : 'text-slate-600'
            } ${f === 'Everything in Network' || f === 'Everything in Growth' ? 'font-semibold ' + (isGrowth ? 'text-white' : 'text-amber-400') : ''}`}>
              {f}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href="/register"
        className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-bold transition-all ${tier.color.cta}`}
      >
        Apply for {tier.name.split(' ')[0]} Membership <ArrowRight size={14} />
      </Link>
    </div>
  );
}

function TiersSection() {
  return (
    <section id="tiers" className="bg-stone-50 border-t border-black/8 py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold tracking-[0.22em] text-slate-400 uppercase">Membership Tiers</span>
          <h2 className="text-5xl font-black text-slate-900 leading-[1.08] tracking-tight">
            Choose the level of<br />intelligence you need.
          </h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Each tier builds on the last. Start where you are. Scale to where you want to be.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {TIERS.map((tier) => (
            <TierCard key={tier.id} tier={tier} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonTable() {
  return (
    <section className="bg-[#0f0f0f] border-t border-white/8 py-24 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 space-y-4">
          <span className="text-xs font-bold tracking-[0.22em] text-slate-500 uppercase">Compare Plans</span>
          <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
            Everything, side by side.
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-500 w-1/2">Feature</th>
                {[
                  { label: 'Network', color: 'text-slate-300' },
                  { label: 'Growth',  color: 'text-violet-400' },
                  { label: 'Intelligence', color: 'text-amber-400' },
                ].map((col) => (
                  <th key={col.label} className={`py-4 px-4 text-center text-sm font-black ${col.color}`}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr
                  key={i}
                  className={`border-t border-white/5 ${i % 2 === 0 ? '' : 'bg-white/2'}`}
                >
                  <td className="py-3.5 px-4 text-sm text-slate-400">{row.label}</td>
                  {[row.network, row.growth, row.intel].map((has, j) => (
                    <td key={j} className="py-3.5 px-4 text-center">
                      {has
                        ? <CheckCircle size={16} className={j === 2 ? 'text-amber-400 mx-auto' : j === 1 ? 'text-violet-400 mx-auto' : 'text-emerald-500 mx-auto'} />
                        : <span className="text-white/10 text-lg leading-none mx-auto block text-center">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function WhatYouGet() {
  return (
    <section className="bg-stone-50 border-t border-black/8 py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 space-y-4">
          <span className="text-xs font-bold tracking-[0.22em] text-slate-400 uppercase">What Incubators Actually Get</span>
          <h2 className="text-5xl font-black text-slate-900 leading-[1.08] tracking-tight">
            Not features. Outcomes.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VALUE_PROPS.map((v) => (
            <div key={v.title} className="bg-white border border-black/8 rounded-2xl p-6 space-y-4 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${v.bg}`}>
                <span className={v.color}>{v.icon}</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">{v.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}

          {/* Sixth card — CTA */}
          <div className="bg-gradient-to-br from-violet-600 to-violet-800 border border-violet-500 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <Award size={20} className="text-white" />
              </div>
              <h3 className="font-black text-white text-base mb-2">Ready to level up?</h3>
              <p className="text-sm text-violet-200 leading-relaxed">
                Join 50+ incubators already operating with IncubatX intelligence.
              </p>
            </div>
            <Link
              href="/register"
              className="flex items-center gap-2 bg-white hover:bg-violet-50 text-violet-900 font-bold text-sm px-5 py-3 rounded-xl transition-colors mt-2"
            >
              Apply for Membership <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-[#0a0a0a] border-t border-white/8 py-24 px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-900/20 via-transparent to-amber-900/20 pointer-events-none" />
      <div className="relative max-w-4xl mx-auto text-center space-y-8">
        <p className="text-xs font-bold tracking-[0.22em] text-slate-500 uppercase">Your Next Move</p>
        <h2 className="text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
          Stop managing chaos.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-amber-400">
            Start scaling with intelligence.
          </span>
        </h2>
        <p className="text-slate-400 text-base leading-relaxed max-w-lg mx-auto">
          Apply for IncubatX membership today and transform your incubator from a service provider into a measurable ecosystem engine.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/register"
            className="flex items-center gap-2 bg-[#ff5c35] hover:bg-[#e84e2a] text-white font-bold px-8 py-4 rounded-full text-base transition-all shadow-xl shadow-orange-600/30 hover:scale-[1.02]"
          >
            Apply for Membership <ArrowRight size={16} />
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-semibold px-8 py-4 rounded-full text-base transition-all hover:bg-white/5"
          >
            Book a Demo First
          </Link>
        </div>
        <p className="text-slate-600 text-sm">
          Questions? Email us at{' '}
          <a href="mailto:membership@incubatx.in" className="text-violet-400 hover:underline">
            membership@incubatx.in
          </a>
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-10 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-lg tracking-tight">
            incubate<span className="text-violet-400">X</span>
          </span>
          <span className="text-slate-600 text-sm">· Membership Programme</span>
        </div>
        <div className="flex items-center gap-6 text-slate-500 text-sm">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/platform" className="hover:text-white transition-colors">Platform</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/register" className="hover:text-white transition-colors">Register</Link>
        </div>
        <p className="text-slate-600 text-sm">© 2025 incubatX. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ── page export ────────────────────────────────────────────────────────────────

export default function MembershipPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <LandingNav activeHref="/membership" />
      <Hero />
      <RealityCheck />
      <TiersSection />
      <ComparisonTable />
      <WhatYouGet />
      <FinalCTA />
      <Footer />
    </div>
  );
}
