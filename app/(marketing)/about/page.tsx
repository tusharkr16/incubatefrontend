import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, Users, Zap, Target } from 'lucide-react';
import { LandingNav } from '@/components/LandingNav';

function AboutHero() {
  return (
    <section className="relative min-h-[55vh] flex items-end pb-16 pt-32 px-8 overflow-hidden bg-slate-900">
      <Image src="/gurgaon-hero.png" alt="Gurgaon skyline" fill className="object-cover object-center opacity-60" priority />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <p className="text-xs font-bold tracking-[0.22em] text-white/50 uppercase mb-4">About incubatX</p>
        <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight max-w-3xl">
          We build the rails for India&apos;s startup ecosystem.
        </h1>
      </div>
    </section>
  );
}

function NCRAdvantage() {
  return (
    <section className="bg-stone-50 py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-5xl font-black text-slate-900 leading-[1.08] tracking-tight">
              The NCR<br />Advantage
            </h2>
            <p className="text-slate-500 text-[1.02rem] leading-relaxed max-w-md">
              Founded in the heart of India&apos;s tech corridor, IncubatX was born from a simple observation:
              great ideas often fail due to technical fragility. By anchoring our headquarters in Noida, we
              provide startups with immediate access to a world-class IT ecosystem and the engineering talent
              required for global scale.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin size={14} className="text-[#ff5c35]" />
              <span>Noida, NCR — India&apos;s IT Capital</span>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <Image src="/ncr-building.png" alt="NCR tech office building" width={700} height={500} className="w-full h-auto object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

const VALUES = [
  { icon: <Target size={20} />, title: 'Mission-First',        desc: 'Every feature exists to help incubators run better programs and founders build faster.' },
  { icon: <Users size={20} />,  title: 'Ecosystem Thinking',   desc: 'We build for the whole network — founders, investors, mentors, and governments alike.' },
  { icon: <Zap size={20} />,   title: 'Radical Transparency', desc: 'Full audit trails, open scoring, and real-time data — no black boxes.' },
];

function MissionSection() {
  return (
    <section className="bg-stone-50 border-t border-black/6 py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-5">
            <p className="text-xs font-bold tracking-[0.22em] text-slate-400 uppercase">Our Mission</p>
            <h2 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">
              Replace guesswork with intelligence at every stage of the startup journey.
            </h2>
            <p className="text-slate-500 leading-relaxed">
              incubatX is built on the belief that every rupee of grant funding, every hour of mentor time,
              and every investor introduction should be traceable, optimised, and measurable —
              not lost in spreadsheets.
            </p>
          </div>
          <div className="space-y-4 pt-2">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white border border-black/8 rounded-2xl px-6 py-5 flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#ff5c35]/10 text-[#ff5c35] flex items-center justify-center flex-shrink-0">{v.icon}</div>
                <div>
                  <p className="font-bold text-slate-900 text-sm mb-1">{v.title}</p>
                  <p className="text-sm text-slate-500 leading-snug">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const EXPERTS = [
  { name: 'Vikram Singh', role: 'Managing Director',    bio: 'Former CTO at GlobalTech India.',   photo: '/expert-vikram.png' },
  { name: 'Sarah Jha',    role: 'Head of Acceleration', bio: 'Ex-Partner at Impact Capital.',     photo: '/expert-sarah.png' },
];

function GuidedByExperts() {
  return (
    <section className="bg-[#1a1a1a] py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-black text-white text-center mb-12 tracking-tight">Guided by Experts</h2>
        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {EXPERTS.map((e) => (
            <div key={e.name} className="bg-[#2a2a2a] border border-white/8 rounded-2xl p-7 flex items-center gap-7">
              <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={e.photo} alt={e.name} width={112} height={112} className="w-full h-full object-cover grayscale" />
              </div>
              <div>
                <p className="text-white font-bold text-2xl leading-tight">{e.name}</p>
                <p className="text-[#ff5c35] text-xs font-bold tracking-[0.16em] uppercase mt-2 mb-3">{e.role}</p>
                <p className="text-slate-400 text-base leading-relaxed">{e.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-white/10 py-10 px-8 text-center">
      <Image src="/logo.png" alt="incubatX" width={100} height={30} className="h-7 w-auto mx-auto mb-4 object-contain" />
      <p className="text-slate-500 text-sm">© 2025 incubatX. All rights reserved.</p>
    </footer>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-stone-50 min-h-screen">
      <LandingNav activeHref="/about" />
      <AboutHero />
      <NCRAdvantage />
      <MissionSection />
      <GuidedByExperts />
      <Footer />
    </div>
  );
}
