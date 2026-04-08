import apiClient from './client';

export const cohortsApi = {
  create: (data: any) => apiClient.post('/cohorts', data),
  getAll: (year?: number) => apiClient.get('/cohorts', { params: year ? { year } : {} }),
  getOne: (id: string) => apiClient.get(`/cohorts/${id}`),
  generatePoster: (
    cohortId: string,
    data: { name: string; year: number; tagline?: string; sectors?: string[]; description?: string },
  ) => apiClient.post<{ imageUrl?: string; cloudinaryUrl?: string; source?: string; error?: string }>(
    `/cohorts/${cohortId}/generate-poster`, data,
  ),
  syncResponses: (cohortId: string) =>
    apiClient.post<{ synced: number; skipped: number; errors: number }>(`/cohorts/${cohortId}/sync-responses`),
  updateStatus: (cohortId: string, status: 'draft' | 'open' | 'closed') =>
    apiClient.patch(`/cohorts/${cohortId}/status`, { status }),
  getStartups: (cohortId: string) =>
    apiClient.get(`/cohorts/${cohortId}/startups`),
  uploadPoster: (cohortId: string, imageData: string) =>
    apiClient.post<{ cloudinaryUrl: string }>(`/cohorts/${cohortId}/upload-poster`, { imageData }),
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
  getEvaluatedStartups: () =>
    apiClient.get('/evaluations/evaluated-startups'),
};

export const documentsApi = {
  getByStartup: (startupId: string) =>
    apiClient.get(`/documents/startup/${startupId}`),
};

export const fundingInterestsApi = {
  /** Express or update funding interest in a startup */
  create: (data: { startupId: string; amount: number; currency?: string; message?: string }) =>
    apiClient.post('/funding-interests', data),
  /** Aggregated summary per startup (evaluate page) */
  getSummary: () =>
    apiClient.get('/funding-interests/summary'),
  /** Interests submitted by the calling investor */
  getMy: () =>
    apiClient.get('/funding-interests/my'),
  /** All interests for a specific startup */
  getByStartup: (startupId: string) =>
    apiClient.get(`/funding-interests/startup/${startupId}`),
  /** Accept / reject an interest */
  updateStatus: (id: string, status: 'pending' | 'accepted' | 'rejected') =>
    apiClient.patch(`/funding-interests/${id}/status`, { status }),
};
