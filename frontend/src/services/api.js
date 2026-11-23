import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Terjadi kesalahan jaringan. Periksa koneksi Anda.';
    return Promise.reject(new Error(message));
  }
);

// === COMPONENTS API ===
export const componentsApi = {
  getAll: (params = {}) => api.get('/api/components', { params }),
  getById: (id) => api.get(`/api/components/${id}`),
  getByCategory: (category) => api.get(`/api/components/category/${category}`),
  create: (data) => api.post('/api/components', data),
  update: (id, data) => api.put(`/api/components/${id}`, data),
  delete: (id) => api.delete(`/api/components/${id}`),
};

// === BUILDS API ===
export const buildsApi = {
  getAll: () => api.get('/api/builds'),
  getById: (id) => api.get(`/api/builds/${id}`),
  create: (data) => api.post('/api/builds', data),
  update: (id, data) => api.put(`/api/builds/${id}`, data),
  delete: (id) => api.delete(`/api/builds/${id}`),
};

// === COMPATIBILITY API ===
export const compatibilityApi = {
  check: (data) => api.post('/api/compatibility/check', data),
};

// === DASHBOARD API ===
export const dashboardApi = {
  getStats: () => api.get('/api/dashboard/stats'),
};

export default api;
