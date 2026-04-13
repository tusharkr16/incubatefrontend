'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { accountManagerApi } from '@/lib/api';
import { MessageSquare, Trash2, Star } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  insight: 'bg-blue-100 text-blue-700',
  evaluation: 'bg-violet-100 text-violet-700',
  recommendation: 'bg-emerald-100 text-emerald-700',
  risk: 'bg-red-100 text-red-700',
  general: 'bg-slate-100 text-slate-600',
};

export default function AMReviewsPage() {
  const qc = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['am-my-reviews'],
    queryFn: () => accountManagerApi.getMyReviews().then((r) => r.data as any[]),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => accountManagerApi.deleteReview(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['am-my-reviews'] }),
  });

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare size={20} className="text-violet-600" /> My Reviews & Insights
          </h1>
          <p className="text-slate-500 text-sm mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''} posted</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-xl bg-slate-100 animate-pulse" />)}
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 py-16 text-center text-slate-400">
            <MessageSquare size={36} className="mx-auto mb-3 opacity-30" />
            <p>No reviews posted yet. Go to your assigned startups to add reviews.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div key={review._id} className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${CATEGORY_COLORS[review.category] ?? CATEGORY_COLORS.general}`}>
                        {review.category}
                      </span>
                      {review.rating && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-yellow-600">
                          <Star size={11} className="fill-yellow-400 text-yellow-400" /> {review.rating}/10
                        </span>
                      )}
                      {review.startupId && (
                        <span className="text-xs text-slate-400">
                          → <strong className="text-slate-600">{review.startupId.name}</strong>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{review.content}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-xs text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      {!review.visibleToFounder && (
                        <span className="text-xs text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full">Internal only</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(review._id)}
                    disabled={deleteMutation.isPending}
                    className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
