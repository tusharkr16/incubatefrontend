'use client';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { BookDemoModal } from './BookDemoModal';

export function HeroBookDemoButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <BookDemoModal isOpen={open} onClose={() => setOpen(false)} />
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-[#ff5c35] hover:bg-[#e84e2a] text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-all shadow-xl shadow-orange-600/30 hover:shadow-orange-600/50 hover:scale-[1.02]"
      >
        Book a Demo <ArrowRight size={15} />
      </button>
    </>
  );
}
