'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreBar } from '@/components/startups/ScoreBar';
import { Modal } from '@/components/ui/Modal';
import { FormField, inputCls, selectCls } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { startupsApi, intelligenceApi } from '@/lib/api/startups';
import { milestonesApi, financialsApi, foundersApi, evaluationsApi, documentsApi } from '@/lib/api';
import apiClient from '@/lib/api/client';
import {
  ArrowLeft, User, Target, DollarSign, Star, Zap,
  CheckCircle, Clock, AlertCircle, Plus, Flag, FileText,
} from 'lucide-react';
import { clsx } from 'clsx';

// ─── types ────────────────────────────────────────────────
type ModalType = 'founder' | 'milestone' | 'financial' | 'document' | 'milestone_update' | 'flag' | null;

const MILESTONE_COLOR: Record<string, any> = {
  completed: 'success', in_progress: 'info', pending: 'warning', delayed: 'danger', flagged: 'danger',
};
const DISBURSE_COLOR: Record<string, any> = {
  disbursed: 'success', approved: 'info', pending: 'warning', rejected: 'danger',
};
const MILESTONE_STATUSES = ['pending', 'in_progress', 'completed', 'delayed', 'flagged'];
const FUND_SOURCES = ['government_grant', 'institutional', 'private', 'cohort_fund', 'other'];
const DOC_TYPES = ['pitch_deck', 'financials', 'compliance', 'incorporation', 'audit_certificate', 'balance_sheet', 'other'];
const SKILLS_LIST = ['React', 'Node.js', 'Python', 'Machine Learning', 'Product', 'Sales', 'Marketing', 'Finance', 'Operations', 'Healthcare', 'Legal'];

// ─── helpers ──────────────────────────────────────────────
function fmt(date: string) {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function StartupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const [modal, setModal] = useState<ModalType>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [selectedFinancial, setSelectedFinancial] = useState<any>(null);

  // ── form states ──
  const [founderForm, setFounderForm] = useState({ name: '', email: '', skills: [] as string[], yearsOfExperience: 0, bio: '', linkedinUrl: '' });
  const [milestoneForm, setMilestoneForm] = useState({ title: '', description: '', deadline: '' });
  const [msUpdateForm, setMsUpdateForm] = useState({ status: '', progressPercent: 0, delayReason: '' });
  const [financialForm, setFinancialForm] = useState({ title: '', amount: '', currency: 'INR', disbursementDate: '', fundSource: 'government_grant', notes: '' });
  const [docForm, setDocForm] = useState({ type: 'pitch_deck', filename: '', url: '', description: '' });
  const [flagForm, setFlagForm] = useState({ isFlagged: false, flagReason: '' });

  // ─── queries ───────────────────────────────────────────
  const { data: startup, isLoading } = useQuery({ queryKey: ['startup', id], queryFn: () => startupsApi.getById(id).then((r) => r.data) });
  const { data: milestones } = useQuery({ queryKey: ['milestones', id], queryFn: () => milestonesApi.getByStartup(id).then((r) => r.data) });
  const { data: financials } = useQuery({ queryKey: ['financials', id], queryFn: () => financialsApi.getByStartup(id).then((r) => r.data) });
  const { data: founders } = useQuery({ queryKey: ['founders', id], queryFn: () => foundersApi.getByStartup(id).then((r) => r.data) });
  const { data: evaluations } = useQuery({ queryKey: ['evaluations', id], queryFn: () => evaluationsApi.getByStartup(id).then((r) => r.data) });
  const { data: documents } = useQuery({ queryKey: ['documents', id], queryFn: () => documentsApi.getByStartup(id).then((r) => r.data) });
  const { data: score } = useQuery({ queryKey: ['score', id], queryFn: () => intelligenceApi.getScore(id).then((r) => r.data) });
  const { data: recommendations } = useQuery({ queryKey: ['recommendations', id], queryFn: () => intelligenceApi.getRecommendations(id).then((r) => r.data) });

  // ─── mutations ────────────────────────────────────────
  function inv(...keys: string[]) { keys.forEach((k) => qc.invalidateQueries({ queryKey: [k, id] })); }

  const addFounder = useMutation({
    mutationFn: (d: any) => apiClient.post('/founders', d),
    onSuccess: () => { inv('founders'); setModal(null); },
  });

  const addMilestone = useMutation({
    mutationFn: (d: any) => apiClient.post('/milestones', d),
    onSuccess: () => { inv('milestones'); setModal(null); },
  });

  const updateMilestone = useMutation({
    mutationFn: ({ msId, data }: { msId: string; data: any }) => milestonesApi.update(msId, data),
    onSuccess: () => { inv('milestones'); setModal(null); },
  });

  const addFinancial = useMutation({
    mutationFn: (d: any) => apiClient.post('/financials', d),
    onSuccess: () => { inv('financials'); setModal(null); },
  });

  const updateFinancialStatus = useMutation({
    mutationFn: ({ fId, status }: { fId: string; status: string }) =>
      apiClient.patch(`/financials/${fId}/status`, { status }),
    onSuccess: () => { inv('financials'); },
  });

  const addDocument = useMutation({
    mutationFn: (d: any) => apiClient.post('/documents', d),
    onSuccess: () => { inv('documents'); setModal(null); },
  });

  const flagStartup = useMutation({
    mutationFn: (d: any) => startupsApi.update(id, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['startup', id] }); setModal(null); },
  });

  // ─── open helpers ─────────────────────────────────────
  function openMsUpdate(ms: any) {
    setSelectedMilestone(ms);
    setMsUpdateForm({ status: ms.status, progressPercent: ms.progressPercent, delayReason: ms.delayReason ?? '' });
    setModal('milestone_update');
  }

  function openFlag() {
    setFlagForm({ isFlagged: !startup?.isFlagged, flagReason: startup?.flagReason ?? '' });
    setModal('flag');
  }

  if (isLoading || !startup) {
    return <DashboardLayout><div className="py-20 text-center text-slate-400 text-sm">Loading...</div></DashboardLayout>;
  }

  const completedMs = (milestones ?? []).filter((m: any) => m.status === 'completed').length;
  const totalDisbursed = (financials?.records ?? [])
    .filter((f: any) => f.status === 'disbursed')
    .reduce((s: number, f: any) => s + f.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back + header */}
        <div>
          <button onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 mb-4">
            <ArrowLeft size={14} /> Back to startups
          </button>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900">{startup.name}</h1>
                {startup.isFlagged && <Badge variant="danger">⚠ Flagged</Badge>}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="info">{startup.sector?.primary}</Badge>
                <Badge variant="outline">{startup.stage?.replace('_', ' ')}</Badge>
                <Badge variant={startup.status === 'active' ? 'success' : 'warning'}>{startup.status}</Badge>
                <span className="text-slate-400 text-sm">Cohort {startup.cohortYear}</span>
              </div>
              {startup.description && <p className="text-slate-500 text-sm mt-3 max-w-2xl">{startup.description}</p>}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant={startup.isFlagged ? 'danger' : 'secondary'} size="sm" onClick={openFlag}>
                <Flag size={12} /> {startup.isFlagged ? 'Unflag' : 'Flag'}
              </Button>
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-0.5">Health Score</p>
                <p className="text-4xl font-black text-violet-600">{score ?? startup.latestScore ?? 0}</p>
                <p className="text-xs text-slate-400">/100</p>
              </div>
            </div>
          </div>
          <div className="mt-4 max-w-sm">
            <ScoreBar score={score ?? startup.latestScore ?? 0} label="Composite health" />
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Target size={16} />, value: `${completedMs}/${(milestones ?? []).length}`, label: 'Milestones done', color: 'text-violet-500' },
            { icon: <Star size={16} />, value: (evaluations ?? []).length, label: 'Evaluations', color: 'text-amber-500' },
            { icon: <DollarSign size={16} />, value: `₹${(totalDisbursed / 1000).toFixed(0)}K`, label: 'Disbursed', color: 'text-emerald-500' },
            { icon: <User size={16} />, value: (founders ?? []).length, label: 'Founders', color: 'text-blue-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <span className={clsx('flex justify-center mb-1', stat.color)}>{stat.icon}</span>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── Founders ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Founders</CardTitle>
                <Button size="sm" onClick={() => { setFounderForm({ name: '', email: '', skills: [], yearsOfExperience: 0, bio: '', linkedinUrl: '' }); setModal('founder'); }}>
                  <Plus size={12} /> Add
                </Button>
              </div>
            </CardHeader>
            {(founders ?? []).length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">No founders yet</p>
            ) : (
              <div className="space-y-3">
                {(founders ?? []).map((f: any) => (
                  <div key={f._id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-9 h-9 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{f.name[0]}</div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{f.name}</p>
                      <p className="text-xs text-slate-400">{f.email} · {f.yearsOfExperience}y exp</p>
                      {f.bio && <p className="text-xs text-slate-500 mt-1">{f.bio}</p>}
                      {f.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {f.skills.slice(0, 4).map((sk: string) => (
                            <span key={sk} className="text-xs bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{sk}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* ── AI Recommendations ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>AI Recommendations</CardTitle>
                <Zap size={14} className="text-violet-400" />
              </div>
            </CardHeader>
            <ul className="space-y-3">
              {(recommendations ?? []).map((rec: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  {rec}
                </li>
              ))}
            </ul>
          </Card>

          {/* ── Milestones ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Milestones</CardTitle>
                <Button size="sm" onClick={() => { setMilestoneForm({ title: '', description: '', deadline: '' }); setModal('milestone'); }}>
                  <Plus size={12} /> Add
                </Button>
              </div>
            </CardHeader>
            <div className="space-y-1">
              {(milestones ?? []).length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">No milestones yet</p>
              ) : (
                (milestones ?? []).map((m: any) => (
                  <div key={m._id} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0 gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {m.status === 'completed' ? <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                        : m.isDelayed ? <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                        : <Clock size={14} className="text-slate-300 flex-shrink-0" />}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{m.title}</p>
                        <p className="text-xs text-slate-400">Due {fmt(m.deadline)} · {m.progressPercent}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={MILESTONE_COLOR[m.status]}>{m.status.replace('_', ' ')}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => openMsUpdate(m)}>Update</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* ── Financials ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Financials</CardTitle>
                <Button size="sm" onClick={() => { setFinancialForm({ title: '', amount: '', currency: 'INR', disbursementDate: '', fundSource: 'government_grant', notes: '' }); setModal('financial'); }}>
                  <Plus size={12} /> Add
                </Button>
              </div>
            </CardHeader>
            <div className="space-y-1">
              {(financials?.records ?? []).length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">No financial records yet</p>
              ) : (
                (financials?.records ?? []).map((f: any) => (
                  <div key={f._id} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0 gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800 truncate">{f.title}</p>
                      <p className="text-xs text-slate-400">{fmt(f.disbursementDate)}{f.fundSource ? ` · ${f.fundSource.replace(/_/g, ' ')}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900">₹{f.amount.toLocaleString('en-IN')}</p>
                      <Badge variant={DISBURSE_COLOR[f.status]}>{f.status}</Badge>
                      {f.status === 'pending' && (
                        <Button variant="secondary" size="sm"
                          loading={updateFinancialStatus.isPending}
                          onClick={() => updateFinancialStatus.mutate({ fId: f._id, status: 'approved' })}>
                          Approve
                        </Button>
                      )}
                      {f.status === 'approved' && (
                        <Button size="sm"
                          loading={updateFinancialStatus.isPending}
                          onClick={() => updateFinancialStatus.mutate({ fId: f._id, status: 'disbursed' })}>
                          Disburse
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* ── Documents ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Documents</CardTitle>
                <Button size="sm" onClick={() => { setDocForm({ type: 'pitch_deck', filename: '', url: '', description: '' }); setModal('document'); }}>
                  <Plus size={12} /> Upload
                </Button>
              </div>
            </CardHeader>
            <div className="space-y-1">
              {(documents ?? []).length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">No documents uploaded</p>
              ) : (
                (documents ?? []).map((d: any) => (
                  <div key={d._id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                    <FileText size={14} className="text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{d.filename}</p>
                      <p className="text-xs text-slate-400">{d.type?.replace('_', ' ')} · {fmt(d.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {d.isVerified
                        ? <Badge variant="success">Verified</Badge>
                        : <Badge variant="warning">Unverified</Badge>}
                      <a href={d.url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-violet-600 hover:underline">View</a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* ── Evaluations ── */}
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Evaluations ({(evaluations ?? []).length})</CardTitle></CardHeader>
            {(evaluations ?? []).length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">No evaluations submitted yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(evaluations ?? []).map((ev: any) => (
                  <div key={ev._id} className="border border-slate-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{ev.reviewerId?.name ?? 'Reviewer'}</p>
                        <p className="text-xs text-slate-400 capitalize">{ev.reviewerId?.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-violet-600">{ev.totalScore}</p>
                        <p className="text-xs text-slate-400">/70</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-3">
                      {Object.entries(ev.scores ?? {}).map(([key, val]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-semibold text-slate-700">{String(val)}/10</span>
                        </div>
                      ))}
                    </div>
                    {ev.recommendation && (
                      <Badge variant={['strongly_recommend','recommend'].includes(ev.recommendation) ? 'success' : ev.recommendation === 'neutral' ? 'warning' : 'danger'}>
                        {ev.recommendation.replace('_', ' ')}
                      </Badge>
                    )}
                    {ev.notes && <p className="text-xs text-slate-500 mt-2 italic">"{ev.notes}"</p>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ── Add Founder Modal ── */}
      <Modal open={modal === 'founder'} onClose={() => setModal(null)} title="Add Founder">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Full Name" required>
              <input className={inputCls} value={founderForm.name} placeholder="Priya Sharma"
                onChange={(e) => setFounderForm((f) => ({ ...f, name: e.target.value }))} />
            </FormField>
            <FormField label="Email" required>
              <input className={inputCls} type="email" value={founderForm.email} placeholder="priya@startup.com"
                onChange={(e) => setFounderForm((f) => ({ ...f, email: e.target.value }))} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Years of Experience">
              <input className={inputCls} type="number" min={0} value={founderForm.yearsOfExperience}
                onChange={(e) => setFounderForm((f) => ({ ...f, yearsOfExperience: +e.target.value }))} />
            </FormField>
            <FormField label="LinkedIn URL" hint="Optional">
              <input className={inputCls} placeholder="https://linkedin.com/in/..." value={founderForm.linkedinUrl}
                onChange={(e) => setFounderForm((f) => ({ ...f, linkedinUrl: e.target.value }))} />
            </FormField>
          </div>
          <FormField label="Skills" hint="Select all that apply">
            <div className="flex flex-wrap gap-2 mt-1">
              {SKILLS_LIST.map((sk) => (
                <button key={sk} type="button"
                  onClick={() => setFounderForm((f) => ({
                    ...f,
                    skills: f.skills.includes(sk) ? f.skills.filter((s) => s !== sk) : [...f.skills, sk],
                  }))}
                  className={clsx(
                    'text-xs px-2.5 py-1 rounded-full border transition-colors',
                    founderForm.skills.includes(sk)
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'border-slate-200 text-slate-600 hover:border-violet-400',
                  )}>
                  {sk}
                </button>
              ))}
            </div>
          </FormField>
          <FormField label="Bio" hint="2-3 sentences about this founder">
            <textarea className={clsx(inputCls, 'resize-none')} rows={2} value={founderForm.bio}
              placeholder="Ex-Google engineer with 6 years in ML..."
              onChange={(e) => setFounderForm((f) => ({ ...f, bio: e.target.value }))} />
          </FormField>
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button loading={addFounder.isPending}
              onClick={() => addFounder.mutate({ ...founderForm, startupId: id })}>
              Add Founder
            </Button>
          </div>
          {addFounder.isError && <p className="text-xs text-red-500">{(addFounder.error as any)?.response?.data?.message}</p>}
        </div>
      </Modal>

      {/* ── Add Milestone Modal ── */}
      <Modal open={modal === 'milestone'} onClose={() => setModal(null)} title="Add Milestone">
        <div className="space-y-4">
          <FormField label="Title" required>
            <input className={inputCls} value={milestoneForm.title} placeholder="MVP Launch"
              onChange={(e) => setMilestoneForm((f) => ({ ...f, title: e.target.value }))} />
          </FormField>
          <FormField label="Description" hint="Optional">
            <textarea className={clsx(inputCls, 'resize-none')} rows={2} value={milestoneForm.description}
              onChange={(e) => setMilestoneForm((f) => ({ ...f, description: e.target.value }))} />
          </FormField>
          <FormField label="Deadline" required>
            <input className={inputCls} type="date" value={milestoneForm.deadline}
              onChange={(e) => setMilestoneForm((f) => ({ ...f, deadline: e.target.value }))} />
          </FormField>
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button loading={addMilestone.isPending}
              onClick={() => addMilestone.mutate({ ...milestoneForm, startupId: id })}>
              Create Milestone
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Update Milestone Modal ── */}
      <Modal open={modal === 'milestone_update'} onClose={() => setModal(null)} title={`Update: ${selectedMilestone?.title ?? ''}`} size="sm">
        <div className="space-y-4">
          <FormField label="Status">
            <select className={selectCls} value={msUpdateForm.status}
              onChange={(e) => setMsUpdateForm((f) => ({ ...f, status: e.target.value }))}>
              {MILESTONE_STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </FormField>
          <FormField label={`Progress: ${msUpdateForm.progressPercent}%`}>
            <input type="range" min={0} max={100} value={msUpdateForm.progressPercent}
              className="w-full accent-violet-600"
              onChange={(e) => setMsUpdateForm((f) => ({ ...f, progressPercent: +e.target.value }))} />
          </FormField>
          {(msUpdateForm.status === 'delayed' || msUpdateForm.status === 'flagged') && (
            <FormField label="Reason">
              <input className={inputCls} value={msUpdateForm.delayReason} placeholder="Explain the delay..."
                onChange={(e) => setMsUpdateForm((f) => ({ ...f, delayReason: e.target.value }))} />
            </FormField>
          )}
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button loading={updateMilestone.isPending}
              onClick={() => updateMilestone.mutate({ msId: selectedMilestone._id, data: msUpdateForm })}>
              Save Update
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Add Financial Modal ── */}
      <Modal open={modal === 'financial'} onClose={() => setModal(null)} title="Add Disbursement">
        <div className="space-y-4">
          <FormField label="Title" required>
            <input className={inputCls} value={financialForm.title} placeholder="DPIIT Seed Grant Q1"
              onChange={(e) => setFinancialForm((f) => ({ ...f, title: e.target.value }))} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Amount (₹)" required>
              <input className={inputCls} type="number" min={0} value={financialForm.amount} placeholder="500000"
                onChange={(e) => setFinancialForm((f) => ({ ...f, amount: e.target.value }))} />
            </FormField>
            <FormField label="Disbursement Date" required>
              <input className={inputCls} type="date" value={financialForm.disbursementDate}
                onChange={(e) => setFinancialForm((f) => ({ ...f, disbursementDate: e.target.value }))} />
            </FormField>
          </div>
          <FormField label="Fund Source">
            <select className={selectCls} value={financialForm.fundSource}
              onChange={(e) => setFinancialForm((f) => ({ ...f, fundSource: e.target.value }))}>
              {FUND_SOURCES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </FormField>
          <FormField label="Notes" hint="Optional">
            <textarea className={clsx(inputCls, 'resize-none')} rows={2} value={financialForm.notes}
              onChange={(e) => setFinancialForm((f) => ({ ...f, notes: e.target.value }))} />
          </FormField>
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button loading={addFinancial.isPending}
              onClick={() => addFinancial.mutate({ ...financialForm, amount: +financialForm.amount, startupId: id })}>
              Add Disbursement
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Upload Document Modal ── */}
      <Modal open={modal === 'document'} onClose={() => setModal(null)} title="Upload Document" size="sm">
        <div className="space-y-4">
          <FormField label="Document Type" required>
            <select className={selectCls} value={docForm.type}
              onChange={(e) => setDocForm((f) => ({ ...f, type: e.target.value }))}>
              {DOC_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
            </select>
          </FormField>
          <FormField label="File Name" required>
            <input className={inputCls} value={docForm.filename} placeholder="pitch-deck-2026.pdf"
              onChange={(e) => setDocForm((f) => ({ ...f, filename: e.target.value }))} />
          </FormField>
          <FormField label="Document URL" required hint="Paste a Google Drive, Dropbox, or S3 link">
            <input className={inputCls} value={docForm.url} placeholder="https://drive.google.com/..."
              onChange={(e) => setDocForm((f) => ({ ...f, url: e.target.value }))} />
          </FormField>
          <FormField label="Description" hint="Optional">
            <input className={inputCls} value={docForm.description}
              onChange={(e) => setDocForm((f) => ({ ...f, description: e.target.value }))} />
          </FormField>
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button loading={addDocument.isPending}
              onClick={() => addDocument.mutate({ ...docForm, startupId: id })}>
              Save Document
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Flag / Unflag Modal ── */}
      <Modal open={modal === 'flag'} onClose={() => setModal(null)} title={startup.isFlagged ? 'Remove Flag' : 'Flag Startup'} size="sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            {startup.isFlagged
              ? 'Are you sure you want to remove the risk flag from this startup?'
              : 'Flagging marks this startup for review. Provide a reason below.'}
          </p>
          {!startup.isFlagged && (
            <FormField label="Flag Reason" required>
              <input className={inputCls} value={flagForm.flagReason} placeholder="e.g. Missing compliance documents"
                onChange={(e) => setFlagForm((f) => ({ ...f, flagReason: e.target.value }))} />
            </FormField>
          )}
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button variant={startup.isFlagged ? 'secondary' : 'danger'} loading={flagStartup.isPending}
              onClick={() => flagStartup.mutate({ isFlagged: !startup.isFlagged, flagReason: flagForm.flagReason })}>
              {startup.isFlagged ? 'Remove Flag' : 'Flag Startup'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
