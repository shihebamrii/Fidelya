import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
};

// Admin API
export const adminApi = {
  // Businesses
  getBusinesses: (params) => api.get('/admin/businesses', { params }),
  getBusiness: (id) => api.get(`/admin/businesses/${id}`),
  createBusiness: (data) => api.post('/admin/businesses', data),
  updateBusiness: (id, data) => api.put(`/admin/businesses/${id}`, data),
  deleteBusiness: (id) => api.delete(`/admin/businesses/${id}`),
  
  // Business users
  getBusinessUsers: (businessId) => 
    api.get(`/admin/businesses/${businessId}/users`),
  createBusinessUser: (businessId, data) => 
    api.post(`/admin/businesses/${businessId}/users`, data),
  updateBusinessUser: (businessId, userId, data) => 
    api.put(`/admin/businesses/${businessId}/users/${userId}`, data),
  deleteBusinessUser: (businessId, userId) => 
    api.delete(`/admin/businesses/${businessId}/users/${userId}`),
  
  // Clients
  getClients: (businessId, params) => 
    api.get(`/admin/businesses/${businessId}/clients`, { params }),
  createClient: (businessId, data) => 
    api.post(`/admin/businesses/${businessId}/clients`, data),
  generateClients: (businessId, data) =>
    api.post(`/admin/businesses/${businessId}/clients/generate`, data),
  
  // Transactions
  getTransactions: (params) => api.get('/admin/transactions', { params }),
};

// Business API
export const businessApi = {
  // Items
  getItems: (params) => api.get('/business/items', { params }),
  createItem: (data) => api.post('/business/items', data),
  updateItem: (id, data) => api.put(`/business/items/${id}`, data),
  deleteItem: (id) => api.delete(`/business/items/${id}`),
  
  // Clients
  searchClients: (params) => api.get('/business/clients/search', { params }),
  getClient: (clientId) => api.get(`/business/clients/${clientId}`),
  
  // Points
  addPoints: (clientId, data) => 
    api.post(`/business/clients/${clientId}/points`, data),
  manualAdjust: (clientId, data) => 
    api.post(`/business/clients/${clientId}/manual`, data),
  
  // Transactions
  getTransactions: (params) => api.get('/business/transactions', { params }),
};

// Public Client API
export const clientApi = {
  getDashboard: (slug, clientId) => api.get(`/client/${slug}/${clientId}`),
  getQR: (slug, clientId) => api.get(`/client/${slug}/${clientId}/qr`),
  activateCard: (slug, clientId, data) => api.post(`/client/${slug}/${clientId}/activate`, data),
};

export default api;
