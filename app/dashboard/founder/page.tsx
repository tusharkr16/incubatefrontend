'use client';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreBar } from '@/components/startups/ScoreBar';
import { Modal } from '@/components/ui/Modal';
import { FormField, selectCls, inputCls } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';
import { Plus, Building2, Globe, Calendar, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';

const STAGES = ['ideation', 'validation', 'early_traction', 'growth', 'scale'];

const EMPTY_FORM = {
  name: '',
  sector: { primary: '', tags: '' },
  stage: 'ideation',
  cohortYear: new Date().getFullYear(),
  description: '',
  website: '',
};

const STATUS_VARIANT: Record<string, any> = {
  active: 'success', inactive: 'warning', graduated: 'info', suspended: 'danger',
};

export default function FounderDashboard() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const { data: startups = [], isLoading } = useQuery<any[]>({
    queryKey: ['my-startups', user?._id],
    queryFn: () => apiClient.get('/founders/my/startups').then((r) => r.data),
    enabled: !!user?._id,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiClient.post('/founders/my/startup', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-startups', user?._id] });
      setShowForm(false);
      setForm(EMPTY_FORM);
      setFormError('');
    },
    onError: (err: any) => {
      setFormError(err?.response?.data?.message ?? 'Failed to create startup.');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    const tags = form.sector.tags.split(',').map((t) => t.trim()).filter(Boolean);
    createMutation.mutate({
      name: form.name,
      sector: { primary: form.sector.primary, tags },
      stage: form.stage,
      cohortYear: Number(form.cohortYear),
      description: form.description || undefined,
      website: form.website || undefined,
    });
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Startups</h1>
            <p className="text-slate-500 text-sm mt-1">Welcome back, {user?.name}</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus size={15} className="mr-1.5" /> Add Startup
          </Button>
        </div>

        {/* Startups grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2].map((i) => (
              <div key={i} className="h-52 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : startups.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center">
                <Building2 size={28} className="text-violet-400" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-800">No startups yet</p>
                <p className="text-slate-400 text-sm mt-1">
                  Register your first startup to get started
                </p>
              </div>
              <Button onClick={() => setShowForm(true)}>
                <Plus size={15} className="mr-1.5" /> Add Your First Startup
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {startups.map((s: any) => (
              <StartupCard key={s._id} startup={s} />
            ))}

            {/* Add another card */}
            <button
              onClick={() => setShowForm(true)}
              className={clsx(
                'rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 py-10',
                'hover:border-violet-300 hover:bg-violet-50/40 transition-colors text-slate-400 hover:text-violet-500',
              )}
            >
              <Plus size={22} />
              <span className="text-sm font-medium">Add Another Startup</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Startup Modal */}
      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setForm(EMPTY_FORM); setFormError(''); }}
        title="Register New Startup"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Startup Name" required>
              <input
                className={inputCls}
                placeholder="e.g. AquaTech Solutions"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </FormField>

            <FormField label="Primary Sector" required>
              <input
                className={inputCls}
                placeholder="FinTech, AgriTech…"
                value={form.sector.primary}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sector: { ...f.sector, primary: e.target.value } }))
                }
                required
              />
            </FormField>

            <FormField label="Stage" required>
              <select
                className={selectCls}
                value={form.stage}
                onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value }))}
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Cohort Year" required>
              <input
                className={inputCls}
                type="number"
                min={2000}
                max={2100}
                value={form.cohortYear}
                onChange={(e) => setForm((f) => ({ ...f, cohortYear: +e.target.value }))}
                required
              />
            </FormField>

            <FormField label="Sector Tags" hint="Comma-separated">
              <input
                className={inputCls}
                placeholder="IoT, B2B, SaaS"
                value={form.sector.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sector: { ...f.sector, tags: e.target.value } }))
                }
              />
            </FormField>

            <FormField label="Website">
              <input
                className={inputCls}
                type="url"
                placeholder="https://yourstartup.com"
                value={form.website}
                onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              />
            </FormField>
          </div>

          <FormField label="Description">
            <textarea
              className={clsx(inputCls, 'resize-none')}
              rows={3}
              placeholder="What problem are you solving?"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </FormField>

          {formError && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <Button
              variant="secondary"
              type="button"
              onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setFormError(''); }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              Register Startup
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

function StartupCard({ startup }: { startup: any }) {
  const score = startup.latestScore ?? 0;

  return (
    <Card className="flex flex-col gap-4">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
            {startup.name}
          </h3>
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <Badge variant="info">{startup.sector?.primary}</Badge>
            <Badge variant="outline">{startup.stage?.replace('_', ' ')}</Badge>
            <Badge variant={STATUS_VARIANT[startup.status] ?? 'default'}>{startup.status}</Badge>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-slate-400">Score</p>
          <p className="text-2xl font-black text-violet-600 leading-none mt-0.5">{score}</p>
          <p className="text-xs text-slate-400">/100</p>
        </div>
      </div>

      {/* Score bar */}
      <ScoreBar score={score} label="" />

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 border-t border-slate-50">
        <span className="flex items-center gap-1">
          <Calendar size={11} /> {startup.cohortYear}
        </span>
        {startup.website && (
          <a
            href={startup.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-violet-500 transition-colors"
          >
            <Globe size={11} /> Website
          </a>
        )}
        <span className="flex items-center gap-1 ml-auto">
          <TrendingUp size={11} /> {(startup.founderIds ?? []).length} founder(s)
        </span>
      </div>

      {startup.description && (
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 -mt-2">
          {startup.description}
        </p>
      )}
    </Card>
  );
}
