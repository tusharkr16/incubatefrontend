'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreBar } from '@/components/startups/ScoreBar';
import { startupsApi } from '@/lib/api/startups';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';

const SCORE_PARAMS = [
  { key: 'sector', label: 'Sector Relevance' },
  { key: 'stage', label: 'Stage Appropriateness' },
  { key: 'founderStrength', label: 'Founder Strength' },
  { key: 'incorporation', label: 'Legal Readiness' },
  { key: 'problemMarket', label: 'Problem-Market Fit' },
  { key: 'gtm', label: 'Go-to-Market Strategy' },
  { key: 'marketValidation', label: 'Market Validation' },
] as const;

type ScoreKey = typeof SCORE_PARAMS[number]['key'];

export default function InvestorDashboard() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedStartup, setSelectedStartup] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<ScoreKey, number>>({
    sector: 5, stage: 5, founderStrength: 5, incorporation: 5,
    problemMarket: 5, gtm: 5, marketValidation: 5,
  });
  const [notes, setNotes] = useState('');
  const [recommendation, setRecommendation] = useState('neutral');

  const { data: startupsData } = useQuery({
    queryKey: ['assigned-startups'],
    queryFn: () => startupsApi.getAll({ limit: 50 }).then((r) => r.data),
  });

  const submitMutation = useMutation({
    mutationFn: (data: any) => apiClient.post('/evaluations', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assigned-startups'] });
      setSelectedStartup(null);
      setNotes('');
    },
  });

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleSubmit = () => {
    if (!selectedStartup) return;
    submitMutation.mutate({ startupId: selectedStartup, scores, notes, recommendation });
  };

  const startups = startupsData?.startups ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Investor Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Your assigned portfolio · {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assigned Startups */}
          <Card>
            <CardHeader><CardTitle>Assigned Startups ({startups.length})</CardTitle></CardHeader>
            <div className="space-y-3">
              {startups.map((s: any) => (
                <button
                  key={s._id}
                  onClick={() => setSelectedStartup(selectedStartup === s._id ? null : s._id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedStartup === s._id
                      ? 'border-violet-400 bg-violet-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-900 text-sm">{s.name}</span>
                    <Badge variant="outline">{s.stage}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="info" className="text-xs">{s.sector?.primary}</Badge>
                  </div>
                  <ScoreBar score={s.latestScore ?? 0} label="Current score" />
                </button>
              ))}
              {startups.length === 0 && (
                <p className="text-slate-400 text-sm text-center py-8">No startups assigned yet</p>
              )}
            </div>
          </Card>

          {/* Evaluation Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedStartup
                  ? `Evaluate: ${startups.find((s: any) => s._id === selectedStartup)?.name}`
                  : 'Select a startup to evaluate'}
              </CardTitle>
            </CardHeader>
            {selectedStartup ? (
              <div className="space-y-4">
                {SCORE_PARAMS.map(({ key, label }) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-700 font-medium">{label}</span>
                      <span className="font-bold text-violet-600">{scores[key]}/10</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      step={1}
                      value={scores[key]}
                      onChange={(e) => setScores((prev) => ({ ...prev, [key]: +e.target.value }))}
                      className="w-full accent-violet-600"
                    />
                  </div>
                ))}

                <div className="flex items-center justify-between py-3 border-t border-slate-100 mt-2">
                  <span className="text-sm font-semibold text-slate-700">Total Score</span>
                  <span className="text-2xl font-black text-violet-600">{totalScore}/70</span>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Recommendation</label>
                  <select
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm text-slate-700"
                  >
                    <option value="strongly_recommend">Strongly Recommend</option>
                    <option value="recommend">Recommend</option>
                    <option value="neutral">Neutral</option>
                    <option value="not_recommend">Not Recommend</option>
                  </select>
                </div>

                <textarea
                  placeholder="Notes (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300"
                />

                <button
                  onClick={handleSubmit}
                  disabled={submitMutation.isPending}
                  className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                >
                  {submitMutation.isPending ? 'Submitting...' : 'Submit Evaluation'}
                </button>

                {submitMutation.isSuccess && (
                  <p className="text-emerald-600 text-sm text-center">✓ Evaluation submitted successfully</p>
                )}
                {submitMutation.isError && (
                  <p className="text-red-500 text-sm text-center">Failed to submit. Try again.</p>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <p className="text-sm">Select a startup from the list to start your evaluation.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
