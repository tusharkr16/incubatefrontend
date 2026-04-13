'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { accountManagerApi, grantsApi } from '@/lib/api';
import { Building2, Star, MessageSquare, Award, TrendingUp, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { GRANT_STATUS_COLORS, GRANT_STATUS_LABELS } from '@/lib/data/grants';

export default function AccountManagerDashboard() {
  const qc = useQueryClient();
  const [selectedStartup, setSelectedStartup] = useState<any>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ category: 'general', content: '', rating: '', visibleToFounder: true });

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['am-my-startups'],
    queryFn: () => accountManagerApi.getMyStartups().then((r) => r.data as any[]),
  });

  const startups = assignments.map((a: any) => a.startupId).filter(Boolean);

  const createReviewMutation = useMutation({
    mutationFn: (data: any) => accountManagerApi.createReview(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['am-reviews'] });
      setShowReviewForm(false);
      setReviewForm({ category: 'general', content: '', rating: '', visibleToFounder: true });
    },
  });

  function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStartup) return;
    createReviewMutation.mutate({
      startupId: selectedStartup._id,
      category: reviewForm.category,
      content: reviewForm.content,
      rating: reviewForm.rating ? Number(reviewForm.rating) : undefined,
      visibleToFounder: reviewForm.visibleToFounder,
    });
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Assigned Startups</h1>
            <p className="text-slate-500 text-sm mt-1">{startups.length} startup{startups.length !== 1 ? 's' : ''} assigned to you</p>
          </div>
          <Link
            href="/dashboard/account-manager/reviews"
            className="flex items-center gap-2 border border-violet-200 text-violet-700 hover:bg-violet-50 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            <MessageSquare size={14} /> All Reviews
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Assigned Startups', value: startups.length, icon: <Building2 size={16} className="text-violet-500" /> },
            { label: 'Reviews Posted', value: '-', icon: <MessageSquare size={16} className="text-blue-500" /> },
            { label: 'Avg. Rating Given', value: '-', icon: <Star size={16} className="text-yellow-500" /> },
            { label: 'Grants Tracked', value: '-', icon: <Award size={16} className="text-orange-500" /> },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">{stat.icon}<p className="text-xs text-slate-500">{stat.label}</p></div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Startup list */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => <div key={i} className="h-40 rounded-xl bg-slate-100 animate-pulse" />)}
          </div>
        ) : startups.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 py-16 text-center text-slate-400">
            <Building2 size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No startups assigned yet</p>
            <p className="text-sm mt-1">Ask your admin to assign startups to your account.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {startups.map((startup: any) => (
              <StartupCard
                key={startup._id}
                startup={startup}
                onAddReview={() => { setSelectedStartup(startup); setShowReviewForm(true); }}
              />
            ))}
          </div>
        )}

        {/* Review Modal */}
        {showReviewForm && selectedStartup && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-900">Add Review for {selectedStartup.name}</h2>
                <button onClick={() => setShowReviewForm(false)} className="text-slate-400 hover:text-slate-700 text-xl leading-none">&times;</button>
              </div>
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Category</label>
                  <select
                    value={reviewForm.category}
                    onChange={(e) => setReviewForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    {['general', 'insight', 'evaluation', 'recommendation', 'risk'].map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Review / Insight</label>
                  <textarea
                    required
                    rows={4}
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm((f) => ({ ...f, content: e.target.value }))}
                    placeholder="Share your evaluation, insights, or recommendations for this startup…"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Rating (1–10, optional)</label>
                    <input
                      type="number" min={1} max={10}
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm((f) => ({ ...f, rating: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reviewForm.visibleToFounder}
                        onChange={(e) => setReviewForm((f) => ({ ...f, visibleToFounder: e.target.checked }))}
                        className="rounded"
                      />
                      Visible to founder
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowReviewForm(false)}
                    className="flex-1 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={createReviewMutation.isPending}
                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 transition-colors">
                    {createReviewMutation.isPending ? 'Posting…' : 'Post Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

function StartupCard({ startup, onAddReview }: { startup: any; onAddReview: () => void }) {
  const score = startup.latestScore ?? 0;
  const { data: grantApps = [] } = useQuery({
    queryKey: ['grant-applications', startup._id],
    queryFn: () => grantsApi.getByStartup(startup._id).then((r) => r.data as any[]),
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 text-sm truncate">{startup.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{startup.sector?.primary} · {startup.stage?.replace('_', ' ')}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xl font-black text-violet-600 leading-none">{score}</p>
          <p className="text-xs text-slate-400">/100</p>
        </div>
      </div>

      {/* Grant badges */}
      {grantApps.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {grantApps.slice(0, 2).map((app: any) => (
            <span key={app._id} className={`text-xs px-2 py-0.5 rounded-full font-semibold ${GRANT_STATUS_COLORS[app.status]}`}>
              {app.grantName.split('(')[0].trim().slice(0, 20)}…
            </span>
          ))}
          {grantApps.length > 2 && (
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">+{grantApps.length - 2}</span>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-auto">
        <button
          onClick={onAddReview}
          className="flex-1 flex items-center justify-center gap-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
        >
          <Plus size={12} /> Add Review
        </button>
        <Link
          href={`/dashboard/ceo/startups/${startup._id}`}
          className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
        >
          View <ChevronRight size={12} />
        </Link>
      </div>
    </div>
  );
}
