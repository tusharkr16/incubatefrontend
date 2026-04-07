import apiClient from './client';

export const cohortsApi = {
  create: (data: any) => apiClient.post('/cohorts', data),
  getAll: (year?: number) => apiClient.get('/cohorts', { params: year ? { year } : {} }),
  generatePoster: (data: {
    name: string;
    year: number;
    tagline?: string;
    sectors?: string[];
    description?: string;
  }) => apiClient.post<{ imageUrl?: string; source?: string; error?: string }>('/cohorts/generate-poster', data),
  syncResponses: (cohortId: string) =>
    apiClient.post<{ synced: number; skipped: number; errors: number }>(`/cohorts/${cohortId}/sync-responses`),
};

export const auditApi = {
  getEntityHistory: (type: string, id: string, page = 1) =>
    apiClient.get(`/audit/entity/${type}/${id}`, { params: { page, limit: 30 } }),
  getUserActivity: (userId: string, page = 1) =>
    apiClient.get(`/audit/user/${userId}`, { params: { page, limit: 30 } }),
};

export const milestonesApi = {
  getByStartup: (startupId: string) =>
    apiClient.get(`/milestones/startup/${startupId}`),
  getOverdue: () => apiClient.get('/milestones/overdue'),
  update: (id: string, data: any) => apiClient.patch(`/milestones/${id}`, data),
};

export const financialsApi = {
  getByStartup: (startupId: string) =>
    apiClient.get(`/financials/startup/${startupId}`),
  getSummary: (startupId: string) =>
    apiClient.get(`/financials/startup/${startupId}/summary`),
  getFundedStartups: () =>
    apiClient.get('/financials/funded-startups'),
};

export const foundersApi = {
  getByStartup: (startupId: string) =>
    apiClient.get(`/founders/startup/${startupId}`),
};

export const evaluationsApi = {
  getByStartup: (startupId: string) =>
    apiClient.get(`/evaluations/startup/${startupId}`),
  getAggregate: (startupId: string) =>
    apiClient.get(`/evaluations/startup/${startupId}/aggregate`),
};

export const documentsApi = {
  getByStartup: (startupId: string) =>
    apiClient.get(`/documents/startup/${startupId}`),
};
