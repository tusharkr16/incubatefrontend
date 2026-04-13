'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GRANTS, GRANT_STATUS_COLORS, GRANT_STATUS_LABELS } from '@/lib/data/grants';
import { grantsApi } from '@/lib/api';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';
import {
  ArrowLeft, ExternalLink, CheckCircle2, Circle,
  FileText, ListChecks, Users, Banknote, Award, BookOpen, StickyNote,
} from 'lucide-react';
import Link from 'next/link';

export default function GrantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: myStartups } = useQuery<any[]>({
    queryKey: ['my-startups-grants', user?._id],
    queryFn: () => apiClient.get('/founders/my/startups').then((r) => r.data),
    enabled: user?.role === 'founder',
  });
  const startupId: string | undefined = myStartups?.[0]?._id;

  const grant = GRANTS.find((g) => g.id === id);

  const { data: applications } = useQuery({
    queryKey: ['grant-applications', startupId],
    queryFn: () => grantsApi.getByStartup(startupId!).then((r) => r.data as any[]),
    enabled: !!startupId,
  });

  const myApplication = applications?.find((a: any) => a.grantId === id);

  const applyMutation = useMutation({
    mutationFn: () =>
      grantsApi.apply({ startupId: startupId!, grantId: grant!.id, grantName: grant!.name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grant-applications', startupId] });
    },
  });

  const toggleStepMutation = useMutation({
    mutationFn: ({ appId, steps }: { appId: string; steps: any[] }) =>
      grantsApi.update(appId, { steps }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grant-applications', startupId] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ appId, status }: { appId: string; status: string }) =>
      grantsApi.update(appId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grant-applications', startupId] });
    },
  });

  const updateNotesMutation = useMutation({
    mutationFn: ({ appId, notes }: { appId: string; notes: string }) =>
      grantsApi.update(appId, { notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grant-applications', startupId] });
    },
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'process' | 'documents' | 'eligibility'>('overview');
  const [notesValue, setNotesValue] = useState<string | null>(null);

  if (!grant) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 text-slate-400">Grant not found.</div>
      </DashboardLayout>
    );
  }

  const completedSteps = myApplication?.steps?.filter((s: any) => s.completed).length ?? 0;
  const totalSteps = myApplication?.steps?.length ?? grant.process.length;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BookOpen size={14} /> },
    { id: 'eligibility', label: 'Eligibility', icon: <Users size={14} /> },
    { id: 'process', label: 'Process', icon: <ListChecks size={14} /> },
    { id: 'documents', label: 'Documents', icon: <FileText size={14} /> },
  ] as const;

  function toggleStep(stepIdx: number) {
    if (!myApplication) return;
    const newSteps = myApplication.steps.map((s: any, i: number) =>
      i === stepIdx ? { ...s, completed: !s.completed } : s,
    );
    toggleStepMutation.mutate({ appId: myApplication._id, steps: newSteps });
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back */}
        <Link href="/dashboard/grants" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors w-fit">
          <ArrowLeft size={14} /> Back to Grants
        </Link>

        {/* Header card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${grant.badgeColor}`}>
                  {grant.badge}
                </span>
                {myApplication && (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${GRANT_STATUS_COLORS[myApplication.status]}`}>
                    {GRANT_STATUS_LABELS[myApplication.status]}
                  </span>
                )}
              </div>
              <h1 className="text-xl font-bold text-slate-900 mb-1">{grant.name}</h1>
              <p className="text-sm text-slate-500 mb-3">{grant.ministry}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{grant.description}</p>
            </div>

            <div className="flex flex-col gap-2 min-w-[180px]">
              <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 text-center">
                <Banknote size={18} className="mx-auto text-violet-500 mb-1" />
                <p className="text-xs text-violet-500 font-medium">Grant Amount</p>
                <p className="text-base font-bold text-violet-800">{grant.amount}</p>
              </div>
              <a
                href={grant.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors"
              >
                Official Portal <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">Deadline: <strong className="text-slate-700">{grant.deadline}</strong></span>
            <span className="text-slate-300">|</span>
            {grant.stage.map((s) => (
              <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{s}</span>
            ))}
          </div>
        </div>

        {/* Progress card — only shown when applied */}
        {myApplication && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-slate-900">Your Application Progress</h2>
                <p className="text-xs text-slate-500 mt-0.5">{completedSteps} of {totalSteps} steps completed</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['approved', 'rejected'] as const).includes(myApplication.status) ? (
                  <span className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${GRANT_STATUS_COLORS[myApplication.status]}`}>
                    {GRANT_STATUS_LABELS[myApplication.status]}
                  </span>
                ) : (
                  (['in_progress', 'submitted'] as const).map((s) => (
                    <button
                      key={s}
                      disabled={myApplication.status === s || updateStatusMutation.isPending}
                      onClick={() => updateStatusMutation.mutate({ appId: myApplication._id, status: s })}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition-colors ${
                        myApplication.status === s
                          ? GRANT_STATUS_COLORS[s] + ' border-transparent'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      Mark {GRANT_STATUS_LABELS[s]}
                    </button>
                  ))
                )}
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-5">
              <div
                className="bg-violet-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="space-y-2.5">
              {myApplication.steps.map((step: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className="w-full flex items-center gap-3 text-left hover:bg-slate-50 rounded-xl px-3 py-2.5 transition-colors group"
                >
                  {step.completed
                    ? <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                    : <Circle size={18} className="text-slate-300 group-hover:text-violet-400 flex-shrink-0 transition-colors" />
                  }
                  <span className={`text-sm ${step.completed ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>
                    {step.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes card — only when applied */}
        {myApplication && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <StickyNote size={15} className="text-violet-500" />
              <h2 className="font-bold text-slate-900">Notes</h2>
            </div>
            {notesValue === null ? (
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-slate-500 leading-relaxed flex-1">
                  {myApplication.notes || <span className="italic text-slate-400">No notes yet. Add reminders, contacts, or key details about your application.</span>}
                </p>
                <button
                  onClick={() => setNotesValue(myApplication.notes ?? '')}
                  className="flex-shrink-0 text-xs text-violet-600 font-semibold hover:underline"
                >
                  {myApplication.notes ? 'Edit' : 'Add notes'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  autoFocus
                  rows={4}
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  placeholder="Add reminders, contacts, or key details…"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-700 placeholder:text-slate-400"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setNotesValue(null)}
                    className="text-xs px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={updateNotesMutation.isPending}
                    onClick={() => {
                      updateNotesMutation.mutate(
                        { appId: myApplication._id, notes: notesValue },
                        { onSuccess: () => setNotesValue(null) },
                      );
                    }}
                    className="text-xs px-4 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 font-semibold disabled:opacity-60"
                  >
                    {updateNotesMutation.isPending ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Apply / Track button */}
        {!myApplication && startupId && (
          <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Award size={16} className="text-violet-600" />
                <p className="font-semibold text-violet-900">Start tracking this grant</p>
              </div>
              <p className="text-sm text-violet-600">Add to your dashboard and track your application progress step by step.</p>
            </div>
            <button
              onClick={() => applyMutation.mutate()}
              disabled={applyMutation.isPending}
              className="flex-shrink-0 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
            >
              {applyMutation.isPending ? 'Adding…' : 'Track this Grant'}
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex border-b border-slate-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-violet-700 border-b-2 border-violet-600 bg-violet-50/50'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Key Benefits</h3>
                <ul className="space-y-2.5">
                  {grant.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'eligibility' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Eligibility Criteria</h3>
                <ul className="space-y-2.5">
                  {grant.eligibility.map((e) => (
                    <li key={e} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0 mt-2" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'process' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Application Process</h3>
                <div className="space-y-4">
                  {grant.process.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {step.step}
                        </div>
                        {idx < grant.process.length - 1 && <div className="w-px flex-1 bg-violet-200 my-1" />}
                      </div>
                      <div className="pb-4">
                        <p className="font-semibold text-slate-900 text-sm">{step.label}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Required Documents</h3>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {grant.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-4 py-3">
                      <FileText size={14} className="text-slate-400 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
