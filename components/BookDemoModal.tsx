'use client';
import { useEffect } from 'react';
import { X, Calendar } from 'lucide-react';

// ── Replace this with your actual Calendly link ───────────────────────────────
const CALENDLY_URL =
  'https://calendly.com/tusharkr1612/30min';

export function BookDemoModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ height: 'min(680px, 90vh)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ff5c35]/10 flex items-center justify-center">
              <Calendar size={18} className="text-[#ff5c35]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">Book a Demo</h2>
              <p className="text-xs text-slate-500">30-min walkthrough with our team</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500 hover:text-slate-700 flex-shrink-0"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Calendly embed */}
        <iframe
          src={CALENDLY_URL}
          width="100%"
          height="100%"
          className="flex-1 border-0"
          title="Book a Demo — incubatX"
          loading="lazy"
        />
      </div>
    </div>
  );
}
