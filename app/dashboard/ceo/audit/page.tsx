'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { auditApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store/auth.store';
import { ShieldCheck, User, Building2, Star, Target, DollarSign, FileText } from 'lucide-react';
import { clsx } from 'clsx';

const ENTITY_TYPES = ['startup', 'user', 'founder', 'evaluation', 'milestone', 'financial', 'document'];
const ACTIONS = ['create', 'update', 'delete', 'login', 'evaluate', 'approve', 'disburse'];

const ACTION_COLOR: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'outline'> = {
  create: 'success',
  update: 'info',
  delete: 'danger',
  login: 'outline',
  evaluate: 'info',
  approve: 'success',
  disburse: 'success',
  reject: 'danger',
};

const ENTITY_ICON: Record<string, React.ReactNode> = {
  startup: <Building2 size={12} />,
  user: <User size={12} />,
  founder: <User size={12} />,
  evaluation: <Star size={12} />,
  milestone: <Target size={12} />,
  financial: <DollarSign size={12} />,
  document: <FileText size={12} />,
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AuditLogsPage() {
  const { user } = useAuthStore();
  const [entityType, setEntityType] = useState('startup');
  const [entityId, setEntityId] = useState('');
  const [lookupId, setLookupId] = useState('');
  const [mode, setMode] = useState<'entity' | 'user'>('entity');
  const [page, setPage] = useState(1);

  const { data: entityLogs, isLoading: loadingEntity } = useQuery({
    queryKey: ['audit-entity', entityType, lookupId, page],
    queryFn: () => auditApi.getEntityHistory(entityType, lookupId, page).then((r) => r.data),
    enabled: mode === 'entity' && lookupId.length === 24,
  });

  const { data: userLogs, isLoading: loadingUser } = useQuery({
    queryKey: ['audit-user', lookupId, page],
    queryFn: () => auditApi.getUserActivity(lookupId, page).then((r) => r.data),
    enabled: mode === 'user' && lookupId.length === 24,
  });

  const data = mode === 'entity' ? entityLogs : userLogs;
  const logs = data?.logs ?? [];
  const isLoading = loadingEntity || loadingUser;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={22} className="text-violet-500" />
            Audit Logs
          </h1>
          <p className="text-slate-500 text-sm mt-1">Immutable history of all system actions</p>
        </div>

        {/* Lookup controls */}
        <Card>
          <div className="space-y-4">
            {/* Mode toggle */}
            <div className="flex gap-2">
              {(['entity', 'user'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setLookupId(''); setPage(1); }}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    mode === m
                      ? 'bg-violet-600 text-white'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50',
                  )}
                >
                  {m === 'entity' ? 'By Entity' : 'By User'}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {mode === 'entity' && (
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value)}
                  className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300"
                >
                  {ENTITY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              )}

              <input
                type="text"
                placeholder={mode === 'entity' ? `Paste ${entityType} _id here` : 'Paste user _id here'}
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                className="flex-1 min-w-60 text-sm border border-slate-200 rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-violet-300"
              />

              <button
                onClick={() => { setLookupId(entityId); setPage(1); }}
                disabled={entityId.length !== 24}
                className="px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-200 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Search
              </button>

              {user?._id && (
                <button
                  onClick={() => { setMode('user'); setEntityId(user._id); setLookupId(user._id); setPage(1); }}
                  className="px-4 py-2 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  My activity
                </button>
              )}
            </div>

            <p className="text-xs text-slate-400">
              MongoDB ObjectId is 24 hex characters. Find IDs from the Startups or Users pages.
            </p>
          </div>
        </Card>

        {/* Logs */}
        {!lookupId ? (
          <div className="py-16 text-center text-slate-300 text-sm">
            Enter an ID above to view audit history
          </div>
        ) : isLoading ? (
          <div className="py-16 text-center text-slate-400 text-sm">Loading audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">No audit records found for this ID</div>
        ) : (
          <>
            <div className="text-sm text-slate-500 font-medium">
              {data?.total ?? 0} total records
            </div>

            <div className="space-y-2">
              {logs.map((log: any) => (
                <Card key={log._id} padding={false}>
                  <div className="flex items-start gap-4 px-5 py-4">
                    {/* Icon */}
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0 mt-0.5">
                      {ENTITY_ICON[log.entityType] ?? <ShieldCheck size={12} />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <Badge variant={ACTION_COLOR[log.action] ?? 'outline'}>
                          {log.action}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          on <strong className="text-slate-700">{log.entityType}</strong>
                        </span>
                        <span className="text-xs text-slate-400 font-mono truncate max-w-32">
                          {log.entityId}
                        </span>
                      </div>

                      {log.performedBy && (
                        <p className="text-xs text-slate-500">
                          by{' '}
                          <span className="font-semibold text-slate-700">
                            {log.performedBy?.name ?? log.performedBy}
                          </span>
                          {log.performedBy?.role && (
                            <span className="text-slate-400"> ({log.performedBy.role})</span>
                          )}
                        </p>
                      )}

                      {/* Changes diff */}
                      {log.changes && Object.keys(log.changes).length > 0 && (
                        <div className="mt-2 bg-slate-50 rounded-lg px-3 py-2 space-y-1">
                          {Object.entries(log.changes).map(([field, diff]: [string, any]) => (
                            <div key={field} className="flex items-center gap-2 text-xs">
                              <span className="text-slate-400 font-medium capitalize">{field}:</span>
                              {diff.before !== null && diff.before !== undefined && (
                                <span className="text-red-400 line-through max-w-24 truncate">
                                  {String(diff.before)}
                                </span>
                              )}
                              {diff.before !== null && <span className="text-slate-300">→</span>}
                              <span className="text-emerald-600 font-medium max-w-32 truncate">
                                {String(diff.after)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Time */}
                    <span className="text-xs text-slate-400 flex-shrink-0 mt-0.5">
                      {timeAgo(log.timestamp)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {data?.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-500">Page {page} of {data.totalPages}</span>
                <button
                  disabled={page === data.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
