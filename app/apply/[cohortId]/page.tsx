'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { clsx } from 'clsx';
import { CheckCircle, Zap, AlertCircle, Loader2, Building2, User } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

const publicApi = axios.create({ baseURL: API, headers: { 'Content-Type': 'application/json' } });

const SECTORS = [
  'FinTech', 'HealthTech', 'EdTech', 'AgriTech', 'CleanTech',
  'LogisTech', 'RetailTech', 'LegalTech', 'HRTech', 'AI/ML',
  'Web3', 'SaaS', 'DeepTech', 'Other',
];
const STAGES = [
  { value: 'ideation', label: 'Ideation — idea stage, no product yet' },
  { value: 'validation', label: 'Validation — building & testing with users' },
  { value: 'early_traction', label: 'Early Traction — paying customers / active users' },
  { value: 'growth', label: 'Growth — scaling revenue' },
];

const inputCls = clsx(
  'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900',
  'placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent',
  'bg-white transition-shadow',
);
const selectCls = clsx(inputCls, 'cursor-pointer');

const EMPTY = {
  companyName: '', sector: '', stage: 'ideation',
  description: '', website: '',
  founderName: '', founderEmail: '', founderLinkedin: '', founderBio: '', founderSkills: '',
};

export default function ApplyPage() {
  const { cohortId } = useParams<{ cohortId: string }>();
  const [cohort, setCohort] = useState<any>(null);
  const [cohortLoading, setCohortLoading] = useState(true);
  const [cohortError, setCohortError] = useState<string | null>(null);

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ cohortName: string; cohortYear: number } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    publicApi
      .get(`/cohorts/${cohortId}`)
      .then((r) => setCohort(r.data))
      .catch(() => setCohortError('Cohort not found or no longer accepting applications.'))
      .finally(() => setCohortLoading(false));
  }, [cohortId]);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.companyName.trim()) e.companyName = 'Company name is required';
    if (!form.sector) e.sector = 'Sector is required';
    if (!form.founderName.trim()) e.founderName = 'Your name is required';
    if (!form.founderEmail.trim()) e.founderEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.founderEmail)) e.founderEmail = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await publicApi.post(`/cohorts/${cohortId}/apply`, form);
      setSuccess({ cohortName: res.data.cohortName, cohortYear: res.data.cohortYear });
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setSubmitError(Array.isArray(msg) ? msg[0] : (msg ?? 'Something went wrong. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  // ── Loading / error states ────────────────────────────────────────────────
  if (cohortLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 flex items-center justify-center">
        <Loader2 size={28} className="text-violet-300 animate-spin" />
      </div>
    );
  }
  if (cohortError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
          <p className="text-slate-700 font-semibold">{cohortError}</p>
        </div>
      </div>
    );
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
          <p className="text-slate-500 text-sm mb-6">
            Your startup has been added to <strong>{success.cohortName}</strong> ({success.cohortYear}).
            The incubateX team will be in touch soon.
          </p>
          <div className="flex items-center justify-center gap-2 text-violet-600 font-semibold text-sm">
            <Zap size={15} /> incubateX
          </div>
        </div>
      </div>
    );
  }

  // ── Application form ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-violet-300 font-semibold text-sm mb-3">
            <Zap size={14} /> incubateX
          </div>
          <h1 className="text-3xl font-black text-white mb-2">{cohort.name}</h1>
          <p className="text-violet-300 text-sm">Cohort {cohort.year} · Application Form</p>
          {cohort.tagline && (
            <p className="text-indigo-300 text-sm mt-2 italic">"{cohort.tagline}"</p>
          )}
          {cohort.applicationDeadline && (
            <p className="mt-3 inline-block bg-violet-800/60 text-violet-200 text-xs px-3 py-1 rounded-full">
              Deadline: {new Date(cohort.applicationDeadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Company section */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                <Building2 size={14} className="text-violet-600" />
              </div>
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Company Details</h2>
            </div>

            <div className="space-y-4">
              <Field label="Company / Startup Name" required error={errors.companyName}>
                <input className={inputCls} placeholder="e.g. GreenStack AI"
                  value={form.companyName} onChange={(e) => set('companyName', e.target.value)} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Sector" required error={errors.sector}>
                  <select className={selectCls} value={form.sector} onChange={(e) => set('sector', e.target.value)}>
                    <option value="">Select sector</option>
                    {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>

                <Field label="Stage">
                  <select className={selectCls} value={form.stage} onChange={(e) => set('stage', e.target.value)}>
                    {STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Description" hint="What does your startup do? (2-3 sentences)">
                <textarea className={clsx(inputCls, 'resize-none')} rows={3}
                  placeholder="We build AI-driven energy optimization tools for SMEs..."
                  value={form.description} onChange={(e) => set('description', e.target.value)} />
              </Field>

              <Field label="Website" hint="Optional">
                <input className={inputCls} placeholder="https://yourstartup.com"
                  value={form.website} onChange={(e) => set('website', e.target.value)} />
              </Field>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-8 border-t border-slate-100" />

          {/* Founder section */}
          <div className="px-8 py-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                <User size={14} className="text-violet-600" />
              </div>
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Founder Details</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full Name" required error={errors.founderName}>
                  <input className={inputCls} placeholder="Jane Doe"
                    value={form.founderName} onChange={(e) => set('founderName', e.target.value)} />
                </Field>

                <Field label="Email Address" required error={errors.founderEmail}>
                  <input className={inputCls} type="email" placeholder="jane@startup.com"
                    value={form.founderEmail} onChange={(e) => set('founderEmail', e.target.value)} />
                </Field>
              </div>

              <Field label="LinkedIn Profile" hint="Optional">
                <input className={inputCls} placeholder="https://linkedin.com/in/jane"
                  value={form.founderLinkedin} onChange={(e) => set('founderLinkedin', e.target.value)} />
              </Field>

              <Field label="Skills" hint="Comma-separated — e.g. Machine Learning, React, Product Management">
                <input className={inputCls} placeholder="AI, Product, Growth, Finance"
                  value={form.founderSkills} onChange={(e) => set('founderSkills', e.target.value)} />
              </Field>

              <Field label="Brief Bio" hint="Tell us about yourself">
                <textarea className={clsx(inputCls, 'resize-none')} rows={3}
                  placeholder="Ex-Google engineer with 5 years in energy sector..."
                  value={form.founderBio} onChange={(e) => set('founderBio', e.target.value)} />
              </Field>
            </div>
          </div>

          {/* Error */}
          {submitError && (
            <div className="mx-8 mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              {submitError}
            </div>
          )}

          {/* Submit */}
          <div className="px-8 pb-8">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              {submitting
                ? <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                : <><Zap size={15} /> Submit Application</>
              }
            </button>
            <p className="text-xs text-slate-400 text-center mt-3">
              By submitting you agree to be contacted by the incubateX team.
            </p>
          </div>
        </form>

        <p className="text-center text-violet-400 text-xs mt-6">
          Powered by <span className="font-semibold text-violet-300">incubateX</span>
        </p>
      </div>
    </div>
  );
}

function Field({
  label, required, error, hint, children,
}: {
  label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
