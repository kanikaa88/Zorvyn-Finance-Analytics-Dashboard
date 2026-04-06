import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Records APIs
export const recordsAPI = {
  getRecords: (params) => api.get('/records', { params }),
  createRecord: (data) => api.post('/records', data),
  updateRecord: (id, data) => api.patch(`/records/${id}`, data),
  deleteRecord: (id) => api.delete(`/records/${id}`),
  exportRecords: (params) => api.get('/records/export', { params, responseType: 'blob' }),
};

// Analytics APIs
export const analyticsAPI = {
  getDashboard: (params) => api.get('/analytics/dashboard', { params }),
  getCategoryBreakdown: (params) => api.get('/analytics/category-breakdown', { params }),
  getMonthlyTrends: (params) => api.get('/analytics/monthly-trends', { params }),
  getAIInsights: () => api.get('/analytics/insights/summary'),
};

export default api;
