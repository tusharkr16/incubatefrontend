import apiClient from './client';

export const startupsApi = {
  getAll: (params?: Record<string, any>) => apiClient.get('/startups', { params }),
  getById: (id: string) => apiClient.get(`/startups/${id}`),
  create: (data: any) => apiClient.post('/startups', data),
  update: (id: string, data: any) => apiClient.patch(`/startups/${id}`, data),
  getLeaderboard: (cohortYear?: number) =>
    apiClient.get('/startups/leaderboard', { params: { cohortYear } }),
};

export const intelligenceApi = {
  getScore: (id: string) => apiClient.get(`/intelligence/startup/${id}/score`),
  getRecommendations: (id: string) =>
    apiClient.get(`/intelligence/startup/${id}/recommendations`),
  getCohortReport: (year: number) =>
    apiClient.get('/intelligence/cohort-report', { params: { year } }),
};
