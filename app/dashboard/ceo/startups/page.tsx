'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreBar } from '@/components/startups/ScoreBar';
import { Modal } from '@/components/ui/Modal';
import { FormField, inputCls, selectCls } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { startupsApi } from '@/lib/api/startups';
import { Search, Filter, ChevronRight, AlertTriangle, Building2, Plus } from 'lucide-react';
import { clsx } from 'clsx';

const STAGES = ['ideation', 'validation', 'early_traction', 'growth', 'scale'];
const STAGE_FILTER = ['', ...STAGES];
const STATUSES = ['', 'active', 'inactive', 'graduated', 'suspended'];
const SECTORS = ['FinTech', 'HealthTech', 'EdTech', 'AgriTech', 'CleanTech', 'LogisTech', 'RetailTech', 'LegalTech', 'HRTech', 'Other'];

const STAGE_COLOR: Record<string, 'info' | 'warning' | 'success' | 'outline'> = {
  ideation: 'outline', validation: 'warning', early_traction: 'info', growth: 'success', scale: 'success',
};
const STATUS_COLOR: Record<string, any> = {
  active: 'success', inactive: 'warning', graduated: 'info', suspended: 'danger',
};

const EMPTY_FORM = {
  name: '', sector: { primary: '', tags: '' }, stage: 'ideation',
  cohortYear: new Date().getFullYear(), description: '', website: '',
};

export default function StartupsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['startups-list', stageFilter, statusFilter, page],
    queryFn: () =>
      startupsApi.getAll({ stage: stageFilter || undefined, status: statusFilter || undefined, page, limit: 15 })
        .then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => startupsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['startups-list'] });
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => startupsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['startups-list'] });
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      closeModal();
    },
  });

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(s: any, e: React.MouseEvent) {
    e.stopPropagation();
    setEditTarget(s);
    setForm({
      name: s.name,
      sector: { primary: s.sector?.primary ?? '', tags: (s.sector?.tags ?? []).join(', ') },
      stage: s.stage,
      cohortYear: s.cohortYear,
      description: s.description ?? '',
      website: s.website ?? '',
    });
    setErrors({});
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
    setErrors({});
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.sector.primary) e.sector = 'Sector is required';
    if (!form.cohortYear || form.cohortYear < 2000 || form.cohortYear > 2100) e.cohortYear = 'Enter a valid year (2000–2100)';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const payload = {
      name: form.name.trim(),
      sector: {
        primary: form.sector.primary,
        tags: form.sector.tags ? form.sector.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      },
      stage: form.stage,
      cohortYear: +form.cohortYear,
      description: form.description.trim() || undefined,
      website: form.website.trim() || undefined,
    };
    if (editTarget) {
      updateMutation.mutate({ id: editTarget._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutError = (createMutation.error || updateMutation.error) as any;

  const startups = (data?.startups ?? []).filter((s: any) =>
    search ? s.name.toLowerCase().includes(search.toLowerCase()) : true,
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Startups</h1>
            <p className="text-slate-500 text-sm mt-1">{data?.total ?? 0} total · showing {startups.length}</p>
          </div>
          <Button onClick={openCreate} className="gap-1.5">
            <Plus size={14} /> Add Startup
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search startups..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <select value={stageFilter} onChange={(e) => { setStageFilter(e.target.value); setPage(1); }}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300">
              {STAGE_FILTER.map((s) => <option key={s} value={s}>{s ? s.replace('_', ' ') : 'All stages'}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300">
              {STATUSES.map((s) => <option key={s} value={s}>{s || 'All statuses'}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <Card padding={false}>
          {isLoading ? (
            <div className="py-16 text-center text-slate-400 text-sm">Loading startups...</div>
          ) : startups.length === 0 ? (
            <div className="py-16 text-center">
              <Building2 size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No startups found</p>
              <button onClick={openCreate} className="mt-3 text-sm text-violet-600 hover:underline">+ Add first startup</button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide bg-slate-50 rounded-t-xl">
                <span className="col-span-4">Startup</span>
                <span className="col-span-2">Sector</span>
                <span className="col-span-2">Stage</span>
                <span className="col-span-2">Score</span>
                <span className="col-span-1">Status</span>
                <span className="col-span-1"></span>
              </div>
              {startups.map((s: any) => (
                <div key={s._id} onClick={() => router.push(`/dashboard/ceo/startups/${s._id}`)}
                  className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {s.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{s.name}</p>
                      {s.isFlagged && (
                        <span className="flex items-center gap-1 text-xs text-red-500">
                          <AlertTriangle size={10} /> Flagged
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-slate-600 truncate">{s.sector?.primary}</div>
                  <div className="col-span-2">
                    <Badge variant={STAGE_COLOR[s.stage] ?? 'outline'}>{s.stage?.replace('_', ' ')}</Badge>
                  </div>
                  <div className="col-span-2 pr-4">
                    <ScoreBar score={s.latestScore ?? 0} showValue={false} />
                    <span className="text-xs text-slate-500 mt-0.5 block">{s.latestScore ?? 0}/100</span>
                  </div>
                  <div className="col-span-1">
                    <Badge variant={STATUS_COLOR[s.status] ?? 'outline'}>{s.status}</Badge>
                  </div>
                  <div className="col-span-1 flex items-center justify-end gap-1">
                    <button onClick={(e) => openEdit(s, e)}
                      className="text-xs text-slate-400 hover:text-violet-600 px-2 py-1 rounded hover:bg-violet-50 transition-colors">
                      Edit
                    </button>
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button variant="secondary" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <span className="text-sm text-slate-500">Page {page} of {data.totalPages}</span>
            <Button variant="secondary" disabled={page === data.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal open={modalOpen} onClose={closeModal} title={editTarget ? `Edit: ${editTarget.name}` : 'Add New Startup'} size="lg">
        <div className="space-y-4">
          <FormField label="Startup Name" required error={errors.name}>
            <input className={inputCls} placeholder="e.g. GreenStack AI" value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Primary Sector" required error={errors.sector}>
              <select className={selectCls} value={form.sector.primary}
                onChange={(e) => setForm((f) => ({ ...f, sector: { ...f.sector, primary: e.target.value } }))}>
                <option value="">Select sector</option>
                {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>

            <FormField label="Tags" hint="Comma-separated e.g. AI, SaaS">
              <input className={inputCls} placeholder="AI, SaaS, B2B" value={form.sector.tags}
                onChange={(e) => setForm((f) => ({ ...f, sector: { ...f.sector, tags: e.target.value } }))} />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Stage" required>
              <select className={selectCls} value={form.stage}
                onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value }))}>
                {STAGES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </FormField>

            <FormField label="Cohort Year" required error={errors.cohortYear}>
              <input className={inputCls} type="number" min={2000} max={2100} value={form.cohortYear}
                onChange={(e) => setForm((f) => ({ ...f, cohortYear: +e.target.value }))} />
            </FormField>
          </div>

          <FormField label="Description" hint="Brief overview of what the startup does">
            <textarea className={clsx(inputCls, 'resize-none')} rows={3}
              placeholder="AI-driven energy optimization for SMEs..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </FormField>

          <FormField label="Website" hint="Optional — include https://">
            <input className={inputCls} placeholder="https://startup.com" value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} />
          </FormField>

          {mutError && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {mutError?.response?.data?.message?.[0] ?? mutError?.response?.data?.message ?? 'Something went wrong'}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSubmit} loading={isPending}>
              {editTarget ? 'Save Changes' : 'Create Startup'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
