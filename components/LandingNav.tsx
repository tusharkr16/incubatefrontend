'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

// ── dropdown data ────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    label: 'Platform',
    href: '/platform',
    dropdown: {
      heading: 'Platform Overview',
      links: [
        'Program Management',
        'Mentor Engine',
        'Evaluation Suite',
        'Analytics & Reporting',
        'Capital Access',
        'Marketplace',
        'IncubatxGrants',
      ],
    },
  },
  {
    label: 'Solutions',
    href: undefined,
    dropdown: {
      heading: null,
      links: [
        'Incubators',
        'Accelerators',
        'Universities',
        'Government',
        'Corporates',
        'Founders',
      ],
    },
  },
  {
    label: 'Resources',
    href: undefined,
    dropdown: {
      heading: null,
      links: ['Blog', 'Case Studies', 'Docs', 'Webinars', 'Changelog'],
    },
  },
];

// ── single dropdown item ─────────────────────────────────────────────────────
function DropdownMenu({
  heading,
  links,
}: {
  heading: string | null;
  links: string[];
}) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-black/8 py-4 px-2 z-50">
      {/* little arrow */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-l border-t border-black/8" />

      {heading && (
        <p className="text-violet-700 font-bold text-sm px-3 pb-2 mb-1 border-b border-slate-100">
          {heading}
        </p>
      )}
      <ul className="space-y-0.5">
        {links.map((link) => (
          <li key={link}>
            <span className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl cursor-pointer transition-colors">
              {link}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── nav item with dropdown ────────────────────────────────────────────────────
function NavItem({
  label,
  href,
  dropdown,
  active,
}: {
  label: string;
  href?: string;
  dropdown: { heading: string | null; links: string[] };
  active?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={`flex items-center gap-1 hover:text-white transition-colors text-sm ${active ? 'text-white font-semibold' : 'text-white/80'}`}
        onClick={() => { if (href) window.location.href = href; else setOpen((v) => !v); }}
      >
        {label}
        <ChevronDown
          size={13}
          className={`mt-0.5 opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && <DropdownMenu heading={dropdown.heading} links={dropdown.links} />}
    </div>
  );
}

// ── exported navbar ───────────────────────────────────────────────────────────
export function LandingNav({ activeHref }: { activeHref?: string }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-black/30 backdrop-blur-md border-b border-white/10">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 flex-shrink-0">
        <Image
          src="/logo.png"
          alt="incubatX"
          width={140}
          height={40}
          className="h-9 w-auto object-contain"
          priority
        />
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-7">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.label}
            label={item.label}
            href={item.href}
            dropdown={item.dropdown}
            active={activeHref === item.href}
          />
        ))}
        <Link
          href="/#pricing"
          className="text-sm text-white/80 hover:text-white transition-colors"
        >
          Pricing
        </Link>
        <Link
          href="/grants"
          className={`text-sm transition-colors ${
            activeHref === '/grants' ? 'text-violet-400 font-semibold' : 'text-white/80 hover:text-white'
          }`}
        >
          IncubatxGrants
        </Link>
        <Link
          href="/assessment"
          className={`text-sm transition-colors ${
            activeHref === '/assessment' ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
          }`}
        >
          Free Assessment
        </Link>
        <Link
          href="/membership"
          className={`text-sm transition-colors font-semibold ${
            activeHref === '/membership'
              ? 'text-amber-400'
              : 'text-amber-400/80 hover:text-amber-400'
          }`}
        >
          Membership
        </Link>
        <Link
          href="/about"
          className={`text-sm transition-colors ${
            activeHref === '/about' ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
          }`}
        >
          About
        </Link>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm text-white/80 hover:text-white transition-colors">
          Log In
        </Link>
        <Link
          href="/register"
          className="flex items-center gap-2 text-sm font-semibold bg-[#ff5c35] hover:bg-[#e84e2a] text-white px-5 py-2 rounded-full transition-colors shadow-lg shadow-orange-600/30"
        >
          Book a Demo <ArrowRight size={14} />
        </Link>
      </div>
    </nav>
  );
}
