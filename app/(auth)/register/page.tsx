'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/auth.store';
import { clsx } from 'clsx';
import { Zap, Building2, TrendingUp, Eye, EyeOff, CheckCircle } from 'lucide-react';

const ROLE_REDIRECT: Record<string, string> = {
  founder:  '/dashboard/founder',
  investor: '/dashboard/investor',
};

const ROLES = [
  {
    id: 'founder',
    label: 'Founder',
    icon: Building2,
    description: 'Building a startup in the incubator program',
  },
  {
    id: 'investor',
    label: 'Investor',
    icon: TrendingUp,
    description: 'Mentoring and evaluating portfolio startups',
  },
];

const inputCls = clsx(
  'w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5',
  'text-white placeholder-slate-500 text-sm',
  'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
);

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [role, setRole] = useState<'founder' | 'investor'>('founder');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
    setError('');
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await authApi.register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role,
      });
      setAuth(data.user, data.token);
      router.push(ROLE_REDIRECT[data.user.role] ?? '/dashboard/founder');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : (msg ?? 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  }

  // Password strength indicator
  const strength = !form.password ? 0
    : form.password.length >= 12 && /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) ? 3
    : form.password.length >= 8 ? 2
    : 1;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400'][strength];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-1">
            <Zap size={20} className="text-violet-400" />
            <h1 className="text-3xl font-black text-white tracking-tight">
              incubate<span className="text-violet-400">X</span>
            </h1>
          </div>
          <p className="text-slate-400 text-sm">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h2 className="text-white font-semibold text-lg mb-5">Get started</h2>

          {/* Role picker */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id as any)}
                  className={clsx(
                    'flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-center transition-all',
                    active
                      ? 'border-violet-500 bg-violet-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-300',
                  )}
                >
                  <Icon size={18} className={active ? 'text-violet-400' : ''} />
                  <span className="text-xs font-semibold">{r.label}</span>
                  <span className="text-[10px] leading-tight opacity-70">{r.description}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Jane Doe"
                className={inputCls}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="you@startup.com"
                className={inputCls}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder="Min. 8 characters"
                  className={clsx(inputCls, 'pr-10')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={clsx(
                          'h-1 flex-1 rounded-full transition-all',
                          strength >= i ? strengthColor : 'bg-white/10',
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">{strengthLabel}</span>
                </div>
              )}
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.confirm}
                  onChange={(e) => set('confirm', e.target.value)}
                  placeholder="Re-enter password"
                  className={clsx(inputCls, 'pr-10')}
                />
                {form.confirm && form.confirm === form.password && (
                  <CheckCircle size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                )}
              </div>
              {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
            </div>

            {/* API error */}
            {error && (
              <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={clsx(
                'w-full font-semibold py-2.5 rounded-lg text-sm transition-all mt-1',
                loading
                  ? 'bg-violet-700 text-violet-300 cursor-not-allowed'
                  : 'bg-violet-600 hover:bg-violet-500 text-white',
              )}
            >
              {loading ? 'Creating account…' : `Create ${role === 'founder' ? 'Founder' : 'Investor'} Account`}
            </button>
          </form>

          <p className="text-slate-500 text-xs text-center mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
