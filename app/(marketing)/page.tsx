import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, Play, Zap, BarChart2, Users, Shield,
  TrendingUp, CheckCircle, Star, Building2, Globe, Brain, Layers, ChevronDown,
} from 'lucide-react';
import { LandingNav } from '@/components/LandingNav';

const BG =
  'https://res.cloudinary.com/du5fldub3/image/upload/w_1920,c_scale/app/6fb0582d-4dc5-4778-ac73-864d18c08f77/iter2/hero_gurgaon_twilight.png';

function DashboardMock() {
  return (
    <div className="relative w-full max-w-[480px] mx-auto lg:mx-0">
      <div className="absolute inset-0 bg-violet-500/20 blur-3xl rounded-3xl" />
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3.5 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <span className="text-white/60 text-xs font-medium tracking-wide">Workflow Loop</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
            Auto-sync
          </span>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Active Startups', value: '142', change: '+12%', color: 'text-violet-400' },
              { label: 'Avg Score', value: '78.4', change: '+5.2', color: 'text-emerald-400' },
              { label: 'Cohorts', value: '6', change: 'Active', color: 'text-blue-400' },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <p className="text-[10px] text-white/40 mb-1">{s.label}</p>
                <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{s.change}</p>
              </div>
            ))}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-end gap-1.5 h-16">
              {[30, 50, 40, 70, 55, 80, 65, 90, 75, 85, 70, 95].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-violet-600 to-violet-400 opacity-80" style={{ height: `${h}%` }} />
              ))}
            </div>
            <p className="text-[10px] text-white/40 mt-2">Startup performance · Last 12 weeks</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { phase: 'INTAKE',    label: 'AI',    icon: <Brain size={16} />,    color: 'bg-violet-500/20 border-violet-500/30 text-violet-300' },
              { phase: 'MENTOR',   label: 'Loop',   icon: <TrendingUp size={16} />, color: 'bg-blue-500/20 border-blue-500/30 text-blue-300' },
              { phase: 'GRADUATE', label: 'Audit',  icon: <Shield size={16} />,   color: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' },
            ].map((c) => (
              <div key={c.phase} className={`border rounded-xl p-3 text-center ${c.color}`}>
                <p className="text-[9px] font-bold tracking-widest opacity-60 uppercase mb-1">{c.phase}</p>
                <div className="flex justify-center mb-1">{c.icon}</div>
                <p className="text-sm font-bold">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center pt-20"
      style={{ backgroundImage: `url('${BG}')`, backgroundSize: 'cover', backgroundPosition: 'center top' }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center py-16">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm">
              <span className="font-bold text-white tracking-wide uppercase text-xs">BUILT</span>
              <span className="text-[#ff5c35] font-semibold">for Incubators</span>
            </div>
            <h1 className="text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight">
              The Operating System for Your Startup Ecosystem
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-xl">
              incubatX replaces 10+ disconnected tools with one intelligent platform — built for
              incubators, accelerators, universities and government programs.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/register" className="flex items-center gap-2 bg-[#ff5c35] hover:bg-[#e84e2a] text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-all shadow-xl shadow-orange-600/30 hover:shadow-orange-600/50 hover:scale-[1.02]">
                Book a Demo <ArrowRight size={15} />
              </Link>
              <Link href="/register" className="flex items-center gap-2 border border-white/30 hover:border-white/60 text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-all hover:bg-white/10 backdrop-blur-sm">
                Register Yourself
              </Link>
            </div>
            <div className="flex items-center gap-2.5 text-white/50 text-sm pt-1">
              <Play size={13} className="flex-shrink-0" />
              <span>AI-Enabled Intelligence OS for the Startup Ecosystem — From intake to impact, a unified intelligence layer.</span>
            </div>
          </div>
          <div className="hidden lg:flex justify-end">
            <DashboardMock />
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/30 animate-bounce">
        <ChevronDown size={20} />
      </div>
    </section>
  );
}

const PAIN_POINTS = [
  { title: 'Data siloed',        desc: 'KPIs split across tools and teams.' },
  { title: 'Founders lost',      desc: 'No single source for tasks or mentors.' },
  { title: 'Reports are manual', desc: 'Late PDFs for ministries and partners.' },
];

const PATCHWORK_TOOLS = [
  { tag: 'CRM',     color: 'bg-orange-100 text-orange-700 border-orange-200',  label: 'Grant desks & partner leads' },
  { tag: 'LMS',     color: 'bg-rose-100 text-rose-600 border-rose-200',        label: 'Cohort playbooks' },
  { tag: 'Sheets',  color: 'bg-slate-100 text-slate-600 border-slate-200',     label: 'Milestone tracking' },
  { tag: 'Forms',   color: 'bg-orange-100 text-orange-700 border-orange-200',  label: 'Application intake' },
  { tag: 'Mentor',  color: 'bg-violet-100 text-violet-700 border-violet-200',  label: 'WhatsApp threads' },
  { tag: 'Reports', color: 'bg-slate-800 text-white border-slate-700',         label: 'Manual PDFs for ministries' },
];

function ProblemSection() {
  return (
    <section className="bg-stone-50">
      <div className="border-b border-black/8 px-8 py-8">
        <p className="max-w-7xl mx-auto text-[1.15rem] font-semibold text-slate-800 leading-snug">
          Trusted by 50+ incubators, accelerators and government programs across India
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <span className="text-xs font-bold tracking-[0.18em] text-slate-500 uppercase">Problem</span>
            <h2 className="text-5xl font-black text-slate-900 leading-[1.08] tracking-tight">
              The ecosystem<br />is broken
            </h2>
            <p className="text-slate-600 text-[1.05rem] leading-relaxed max-w-lg">
              Your program is duct-taped together. Spreadsheets for tracking.
              WhatsApp for mentoring. Google Forms for applications. And no one has the full picture.
            </p>
            <div className="flex flex-wrap gap-3">
              {PAIN_POINTS.map((p) => (
                <div key={p.title} className="bg-white border border-black/10 rounded-xl px-4 py-3 max-w-[180px]">
                  <p className="text-sm font-bold text-slate-900 mb-1">{p.title}</p>
                  <p className="text-xs text-slate-500 leading-snug">{p.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xl font-bold text-slate-900 pt-2">What if there was one place for everything?</p>
          </div>
          <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-bold text-slate-800">Patchwork stack</span>
              <span className="text-[10px] font-bold tracking-widest text-slate-500 border border-slate-200 rounded-full px-3 py-1 uppercase">India-First</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {PATCHWORK_TOOLS.map((tool) => (
                <div key={tool.tag} className="bg-slate-50 border border-black/6 rounded-xl p-3">
                  <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full border mb-2 ${tool.color}`}>{tool.tag}</span>
                  <p className="text-xs text-slate-500 leading-snug">{tool.label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="flex gap-1.5">
                <span className="w-6 h-2.5 rounded-full bg-orange-400" />
                <span className="w-6 h-2.5 rounded-full bg-violet-500" />
                <span className="w-6 h-2.5 rounded-full bg-slate-800" />
              </div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">Disconnected.&nbsp; Risky.&nbsp; Slow.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const SOLUTION_STEPS = [
  { num: '1.', title: 'See Everything', desc: 'Real-time visibility across startups, funds, and performance.' },
  { num: '2.', title: 'Decide Smarter', desc: 'AI-driven evaluation and predictive scoring.' },
  { num: '3.', title: 'Prove Impact',   desc: 'Automated reporting for governments, LPs, and audits.' },
];

function SolutionSection() {
  return (
    <section className="bg-stone-50 border-t border-black/6">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="text-xs font-bold tracking-[0.18em] text-slate-500 uppercase">Solution</span>
            <h2 className="text-5xl font-black text-slate-900 leading-[1.08] tracking-tight">
              One platform.<br />Total control.
            </h2>
            <p className="text-slate-600 text-[1.05rem] leading-relaxed max-w-lg">
              IncubatX replaces fragmented workflows with a unified intelligence layer. From intake to impact,
              every action, score, and <span className="font-semibold text-slate-800">dollar</span> is tracked, verified, and ready for audit.
            </p>
            <div className="space-y-3">
              {SOLUTION_STEPS.map((step) => (
                <div key={step.num} className="bg-white border border-black/8 rounded-2xl px-5 py-4">
                  <p className="text-sm font-bold text-slate-900 mb-1">{step.num} {step.title}</p>
                  <p className="text-sm text-slate-500 leading-snug">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden bg-[#d4dde8] flex items-center justify-center p-6 shadow-sm">
            <Image src="/dashboard-mock.png" alt="incubatX dashboard" width={560} height={400} className="w-full h-auto object-contain drop-shadow-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

const AI_CARDS = [
  { title: 'AI Application Engine',         desc: 'Turn messy applications into structured intelligence instantly.' },
  { title: 'AI Evaluation System',          desc: 'Remove bias. Rank startups with data, not opinions.' },
  { title: 'Fund Tracking & Fraud Detection', desc: 'Track every rupee. Flag every anomaly.' },
  { title: 'Cohort Management',             desc: 'From onboarding to graduation — fully automated.' },
  { title: 'Impact Intelligence Dashboard', desc: 'Jobs. Revenue. IP. Outcomes. All measurable. All real-time.' },
  { title: 'Ecosystem Knowledge Graph',     desc: "See connections others can't. Invest where others won't." },
];

function AIIntelligenceSection() {
  return (
    <section className="bg-stone-50 border-t border-black/6">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.22em] text-slate-400 uppercase mb-4">A.I. Integrated</p>
          <h2 className="text-5xl font-light text-slate-900 tracking-tight">Intelligence Omni Presence</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_CARDS.map((card) => (
            <div key={card.title} className="bg-white border border-black/8 rounded-2xl px-6 py-5">
              <p className="text-[0.95rem] font-semibold text-slate-900 mb-2 leading-snug">{card.title}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EnterpriseSection() {
  return (
    <section className="bg-[#5b1fa8] py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.22em] text-white/50 uppercase mb-5">Enterprise Grade</p>
          <h2 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight max-w-3xl mx-auto">
            Built for institutions that can&apos;t afford to be wrong.
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>,
              title: 'SOC2 Compliant',
              desc: 'Enterprise-grade security with full audit trails and access controls.',
            },
            {
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
              title: 'Data Sovereignty',
              desc: 'India-hosted infrastructure with GDPR and DPDP Act compliance.',
            },
            {
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
              title: '99.9% Uptime SLA',
              desc: 'Mission-critical reliability for government and institutional programs.',
            },
          ].map((card) => (
            <div key={card.title} className="bg-white/10 border border-white/15 rounded-2xl px-6 py-7 space-y-4">
              <div className="text-[#ff5c35]">{card.icon}</div>
              <div>
                <p className="text-white font-bold text-lg mb-2">{card.title}</p>
                <p className="text-white/60 text-sm leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  {
    quote: '"IncubatX reduced our development cycle by 40% and connected us with our Lead Series A investor within six months."',
    name: 'Ananya Sharma',
    role: 'Founder & CEO of EcoTrace',
    initials: 'AS',
  },
  {
    quote: '"As an investor, the technical vetting IncubatX provides is unparalleled. It significantly de-risks our early-stage allocations."',
    name: 'David Chen',
    role: 'Managing Partner at Vertex Ventures',
    initials: 'DC',
  },
];

function TestimonialsSection() {
  return (
    <section className="bg-stone-50 border-t border-black/6">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.22em] text-slate-400 uppercase mb-4">Testimonials</p>
          <h2 className="text-5xl font-light text-slate-900 tracking-tight">Trusted by ecosystem builders.</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white border border-black/8 rounded-2xl px-7 py-7 flex flex-col justify-between gap-8">
              <p className="text-slate-800 text-[1.05rem] leading-relaxed">{t.quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-500 text-xs font-bold">{t.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// keep unused-but-available components for future
const _FEATURES = [
  { icon: <Brain size={22} />, title: 'AI-Powered Intake', desc: 'Automatically score and classify startups on day one.' },
  { icon: <BarChart2 size={22} />, title: 'Real-time Leaderboard', desc: 'Track startup progress with live score updates.' },
  { icon: <Users size={22} />, title: 'Investor Connect', desc: 'Match startups with investors and track funding interest.' },
  { icon: <Layers size={22} />, title: 'Cohort Management', desc: 'Manage multiple cohorts and generate AI posters.' },
  { icon: <Shield size={22} />, title: 'Compliance & Audit', desc: 'Full audit trail of every action logged automatically.' },
  { icon: <Zap size={22} />, title: 'Smart Disbursements', desc: 'Streamline grants with multi-role approval workflows.' },
];
void _FEATURES; // silence unused warning

function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <Image src="/logo.png" alt="incubatX" width={120} height={36} className="h-8 w-auto object-contain mb-4" />
            <p className="text-slate-500 text-sm leading-relaxed">
              The operating system for startup ecosystems. Built for incubators, accelerators, and innovation programs.
            </p>
          </div>
          {[
            { heading: 'Platform', links: ['Overview', 'CEO Dashboard', 'Founder Portal', 'Investor Portal', 'Finance Module'] },
            { heading: 'Company',  links: ['About', 'Blog', 'Careers', 'Press', 'Contact'] },
            { heading: 'Legal',    links: ['Privacy Policy', 'Terms of Service', 'Security', 'Cookie Policy'] },
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

export default function LandingPage() {
  return (
    <div className="bg-black min-h-screen">
      <LandingNav />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <AIIntelligenceSection />
      <EnterpriseSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
