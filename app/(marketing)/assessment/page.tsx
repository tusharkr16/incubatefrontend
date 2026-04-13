'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Globe, ArrowRight, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';
import { LandingNav } from '@/components/LandingNav';

const QUESTIONS = [
  {
    id: 'q1',
    section: 'Operations and Data Management',
    question: 'Is your entire incubator workflow and startup data managed in one unified, real-time system?',
    options: [
      { id: 'a', label: 'Yes, fully integrated' },
      { id: 'b', label: 'Partially integrated' },
      { id: 'c', label: 'No, data is scattered across tools' },
    ],
    insight: 'Fragmented systems slow down decisions and lead to data loss.',
    solution: 'A single integrated platform that centralizes applications, workflows, and startup data in real time.',
  },
  {
    id: 'q2',
    section: 'Funding and Compliance Tracking',
    question: 'How do you currently track fund disbursement and utilization across startups?',
    options: [
      { id: 'a', label: 'Fully automated and trackable' },
      { id: 'b', label: 'Semi-manual tracking' },
      { id: 'c', label: 'Mostly manual follow-ups' },
    ],
    insight: 'Most audit risks arise from poor fund tracking and documentation gaps.',
    solution: 'Automated fund tracking with built-in compliance, making every transaction and milestone audit-ready.',
  },
  {
    id: 'q3',
    section: 'Reporting and Impact Measurement',
    question: 'How quickly can you generate accurate reports for stakeholders, government bodies, or partners?',
    options: [
      { id: 'a', label: 'Instantly or real-time' },
      { id: 'b', label: 'Within a few hours' },
      { id: 'c', label: 'Takes days and manual effort' },
    ],
    insight: 'Reporting consumes up to 25% of operational bandwidth in most incubators.',
    solution: 'Real-time dashboards and automated reports, reducing manual effort and improving accuracy.',
  },
  {
    id: 'q4',
    section: 'Mentorship and Outcome Tracking',
    question: 'Can you measure actual startup progress and outcomes from your programs and mentors?',
    options: [
      { id: 'a', label: 'Yes, with clear metrics' },
      { id: 'b', label: 'Partially (basic tracking)' },
      { id: 'c', label: 'No, only attendance or activity' },
    ],
    insight: 'Most incubators track activity, not outcomes, leading to weak impact visibility.',
    solution: 'Outcome-based tracking with measurable KPIs, giving real visibility into startup growth and program effectiveness.',
  },
  {
    id: 'q5',
    section: 'Scalability and System Readiness',
    question: 'If your startup cohorts double in size, will your current system handle it efficiently?',
    options: [
      { id: 'a', label: 'Yes, fully scalable' },
      { id: 'b', label: 'Possibly, with adjustments' },
      { id: 'c', label: 'No, it will create operational challenges' },
    ],
    insight: 'Systems typically break before programs scale, not after.',
    solution: 'Built for scale, enabling you to handle growth without increasing operational complexity.',
  },
];

const SCORE_MAP: Record<string, number> = { a: 3, b: 2, c: 1 };

function ScoreLabel({ score }: { score: number }) {
  if (score >= 13) return { label: 'Data-Driven & Scalable', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', desc: 'Your incubator is well-positioned for scale. IncubatX can help you optimize further.' };
  if (score >= 9) return { label: 'Partially Structured', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', desc: 'You have some processes in place but significant gaps remain. IncubatX can help you close them quickly.' };
  return { label: 'Needs Transformation', color: 'text-red-600', bg: 'bg-red-50 border-red-200', desc: 'Your incubator is running on manual, fragmented processes. IncubatX can help you transform operations in weeks.' };
}

function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-10 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-slate-600 text-sm">© 2025 incubatX. All rights reserved.</p>
        <div className="flex items-center gap-5 text-slate-600 text-sm">
          <Globe size={14} /><span>English</span>
        </div>
      </div>
    </footer>
  );
}

export default function AssessmentPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const q = QUESTIONS[current];
  const isLast = current === QUESTIONS.length - 1;
  const totalScore = Object.entries(answers).reduce((sum, [, v]) => sum + (SCORE_MAP[v] ?? 0), 0);
  const result = ScoreLabel({ score: totalScore });

  function handleNext() {
    if (!selected) return;
    const newAnswers = { ...answers, [q.id]: selected };
    setAnswers(newAnswers);
    if (isLast) {
      setShowResult(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }

  function handleBack() {
    setCurrent((c) => c - 1);
    setSelected(answers[QUESTIONS[current - 1].id] ?? null);
  }

  const progressPct = ((current + (selected ? 1 : 0)) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-[#111111]">
      <LandingNav activeHref="/assessment" />

      <div className="pt-28 pb-16 px-4 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          {/* Heading */}
          {!showResult && (
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Zap size={16} className="text-[#ff5c35]" />
                <span className="text-[#ff5c35] text-xs font-bold tracking-widest uppercase">Free Assessment</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Incubator Efficiency and<br />Intelligence Assessment
              </h1>
              <p className="text-slate-400 text-sm mt-3">
                A quick 2-minute check to understand how scalable, data-driven, and audit-ready your incubation system really is.
              </p>
            </div>
          )}

          {/* Result */}
          {showResult ? (
            <div className="space-y-6">
              <div className={`border rounded-2xl p-8 text-center ${result.bg}`}>
                <CheckCircle2 size={40} className={`mx-auto mb-4 ${result.color}`} />
                <h2 className={`text-2xl font-bold mb-2 ${result.color}`}>{result.label}</h2>
                <p className="text-slate-600 leading-relaxed mb-4">{result.desc}</p>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <span>Your score:</span>
                  <span className={`text-2xl font-black ${result.color}`}>{totalScore}</span>
                  <span>/ 15</span>
                </div>
              </div>

              {/* Per-question breakdown */}
              <div className="bg-white rounded-2xl p-6 space-y-5">
                <h3 className="font-bold text-slate-900 text-lg">What this means for you</h3>
                {QUESTIONS.map((q) => (
                  <div key={q.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">{q.section}</p>
                    <p className="text-sm font-semibold text-slate-700 mb-2">{q.question}</p>
                    <div className="bg-amber-50 rounded-xl p-3 mb-2">
                      <p className="text-xs font-bold text-amber-700 mb-0.5">Insight</p>
                      <p className="text-xs text-amber-800">{q.insight}</p>
                    </div>
                    <div className="bg-violet-50 rounded-xl p-3">
                      <p className="text-xs font-bold text-violet-700 mb-0.5">How IncubatX solves this</p>
                      <p className="text-xs text-violet-800">{q.solution}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Popup-style CTA */}
              <div className="bg-slate-900 rounded-2xl p-8 text-center">
                <h3 className="text-white text-xl font-bold mb-2">
                  IncubatX helps transform fragmented operations into a structured, measurable, and intelligent system.
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  <strong className="text-slate-300">Next step:</strong> Schedule a quick walkthrough to see how your incubator can move from manual processes to a data-driven, scalable system.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/register"
                    className="flex items-center gap-2 bg-[#ff5c35] hover:bg-[#e84e2a] text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-all shadow-lg shadow-orange-600/30"
                  >
                    Schedule a Walkthrough <ArrowRight size={14} />
                  </Link>
                  <button
                    onClick={() => { setCurrent(0); setAnswers({}); setSelected(null); setShowResult(false); }}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    Retake assessment
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Question card */
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Progress */}
              <div className="h-1.5 bg-slate-100">
                <div
                  className="h-1.5 bg-[#ff5c35] transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <div className="p-8">
                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Question {current + 1} of {QUESTIONS.length}
                  </span>
                  <span className="text-slate-200">·</span>
                  <span className="text-xs text-violet-600 font-semibold">{q.section}</span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-6 leading-snug">{q.question}</h2>

                {/* Options */}
                <div className="space-y-3 mb-8">
                  {q.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelected(opt.id)}
                      className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all text-sm font-medium ${
                        selected === opt.id
                          ? 'border-violet-600 bg-violet-50 text-violet-800'
                          : 'border-slate-200 hover:border-violet-300 text-slate-700'
                      }`}
                    >
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold mr-3 ${
                        selected === opt.id ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {opt.id.toUpperCase()}
                      </span>
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Insight preview (shown only if answered) */}
                {selected && (
                  <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Insight</p>
                    <p className="text-sm text-slate-600">{q.insight}</p>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleBack}
                    disabled={current === 0}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-700 disabled:opacity-30 text-sm transition-colors"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!selected}
                    className="flex items-center gap-2 bg-[#ff5c35] hover:bg-[#e84e2a] disabled:opacity-40 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-all"
                  >
                    {isLast ? 'See Results' : 'Next'} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
