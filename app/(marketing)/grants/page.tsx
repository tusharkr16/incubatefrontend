import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Globe, Award, Search, FileText, CalendarClock, UserCheck, Landmark, BarChart3, Target, Network, CheckCircle2 } from 'lucide-react';
import { LandingNav } from '@/components/LandingNav';

const SERVICES = [
  {
    icon: Search,
    title: 'Grant discovery and strategy',
    description: 'We identify the right government grants, schemes, and funding opportunities tailored to your startup, and help you focus only on what is worth applying for.',
  },
  {
    icon: FileText,
    title: 'End-to-end application filing',
    description: "From drafting to submission, we manage the complete process so you don't have to deal with complex forms, portals, and unclear guidelines.",
  },
  {
    icon: CalendarClock,
    title: 'Weekly expert guidance',
    description: 'A structured weekly call with a senior consultant to refine applications, address gaps, and align your strategy.',
  },
  {
    icon: UserCheck,
    title: 'Dedicated account manager',
    description: 'A single point of contact who handles documentation, submissions, and coordination, ensuring smooth execution.',
  },
  {
    icon: Landmark,
    title: 'Government liaison and follow-ups',
    description: 'We actively follow up with relevant authorities to move your applications forward and avoid unnecessary delays.',
  },
  {
    icon: BarChart3,
    title: 'Continuous progress tracking',
    description: 'Regular updates on application status, next steps, and required inputs so you are always informed.',
  },
  {
    icon: Target,
    title: 'Higher approval focus',
    description: 'We prioritize quality over quantity, improving your chances of securing approvals through better positioning.',
  },
  {
    icon: Network,
    title: 'Access to opportunities and networks',
    description: 'Get exposure to relevant government programs, innovation schemes, and key ecosystem connections.',
  },
];

const STATS = [
  { value: '100+', label: 'Grants in our database' },
  { value: '500+', label: 'Applications managed' },
  { value: '68%', label: 'Approval rate' },
  { value: '₹12Cr+', label: 'Funding secured' },
];

const GRANTS_PREVIEW = [
  { name: 'Startup India Seed Fund Scheme', amount: '₹20L – ₹5Cr', ministry: 'DPIIT', badge: 'bg-blue-100 text-blue-700' },
  { name: 'BIRAC BIG Grant', amount: 'Up to ₹50L', ministry: 'BIRAC', badge: 'bg-green-100 text-green-700' },
  { name: 'NIDHI-PRAYAS', amount: 'Up to ₹10L', ministry: 'DST', badge: 'bg-orange-100 text-orange-700' },
  { name: 'Atal Innovation Mission', amount: '₹10L – ₹10Cr', ministry: 'NITI Aayog', badge: 'bg-purple-100 text-purple-700' },
  { name: 'TIDE 2.0', amount: 'Up to ₹75L', ministry: 'MeitY', badge: 'bg-indigo-100 text-indigo-700' },
  { name: 'Stand-Up India', amount: '₹10L – ₹1Cr', ministry: 'SIDBI', badge: 'bg-yellow-100 text-yellow-700' },
];

function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
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

export default function GrantsLandingPage() {
  return (
    <div className="min-h-screen bg-[#111111]">
      <LandingNav activeHref="/grants" />

      {/* Hero */}
      <section className="pt-32 pb-20 px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-7">
          <div className="flex items-center justify-center gap-2">
            <Award size={18} className="text-violet-400" />
            <span className="text-violet-400 text-sm font-bold tracking-widest uppercase">IncubatxGrants</span>
          </div>
          <h1 className="text-6xl lg:text-7xl font-light text-white leading-[1.08] tracking-tight">
            Government grants.<br />
            <span className="text-violet-400">Without the complexity.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto">
            We find the right grants, build the applications, and get them across the line — so your team can stay focused on building.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="flex items-center gap-2 bg-[#ff5c35] hover:bg-[#e84e2a] text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-all shadow-xl shadow-orange-600/30"
            >
              Get Started <ArrowRight size={14} />
            </Link>
            <Link
              href="/assessment"
              className="flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-all hover:bg-white/5"
            >
              Take Free Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-8 border-t border-white/6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-bold text-white">{s.value}</p>
              <p className="text-slate-400 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Grant preview */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold tracking-[0.22em] text-slate-400 uppercase mb-3">Grant Database</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Curated government grants<br />for Indian startups</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {GRANTS_PREVIEW.map((grant) => (
              <div key={grant.name} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${grant.badge}`}>{grant.ministry}</span>
                <h3 className="font-bold text-slate-900 text-sm mt-3 mb-1">{grant.name}</h3>
                <div className="bg-slate-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-slate-500">Amount</p>
                  <p className="text-sm font-bold text-slate-800">{grant.amount}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-all"
            >
              View all grants in dashboard <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-8 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold tracking-[0.22em] text-slate-400 uppercase mb-3">What&apos;s Included</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Everything handled for you</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white border border-black/8 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
                  <Icon size={18} />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-2">{title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#6c31c8] py-20 px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl font-light text-white">Ready to unlock government funding?</h2>
          <p className="text-violet-200 leading-relaxed">
            Start with a free eligibility assessment and let our experts map the right grants for your startup.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 bg-white text-violet-800 hover:bg-violet-50 font-semibold px-7 py-3.5 rounded-full text-sm transition-all"
            >
              Book a Free Consultation <ArrowRight size={14} />
            </Link>
            <Link
              href="/assessment"
              className="flex items-center gap-2 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-white/10 transition-all"
            >
              Take the Assessment
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
