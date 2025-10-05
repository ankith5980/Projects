import axios from 'axios';
import { createCache } from './performance';

// Create cache instance
const apiCache = createCache(5 * 60 * 1000); // 5 minutes cache

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 8000, // Reduced timeout for faster failures
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Cached API method wrapper
const cachedGet = async (key, apiCall) => {
  const cached = apiCache.get(key);
  if (cached) {
    return { data: cached };
  }
  
  try {
    const response = await apiCall();
    apiCache.set(key, response.data);
    return response;
  } catch (error) {
    // Return cached data if available on error
    const fallback = apiCache.get(key);
    if (fallback) {
      console.warn('API call failed, using cached data:', error);
      return { data: fallback };
    }
    throw error;
  }
};

// API methods
const apiService = {
  // About
  getAbout: () => cachedGet('/about', () => api.get('/about')),
  updateAbout: (data) => {
    apiCache.clear(); // Clear cache on update
    return api.put('/about', data);
  },

  // Projects
  getProjects: (params = {}) => {
    const cacheKey = `/projects?${new URLSearchParams(params).toString()}`;
    return cachedGet(cacheKey, () => api.get('/projects', { params }));
  },
  getProject: (id) => cachedGet(`/projects/${id}`, () => api.get(`/projects/${id}`)),
  getAdminProjects: () => api.get('/projects/admin'),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  toggleProjectVisibility: (id) => api.put(`/projects/${id}/toggle-visibility`),

  // Skills
  getSkills: () => cachedGet('/skills', () => api.get('/skills')),
  getAdminSkills: () => api.get('/skills/admin'),
  createSkill: (data) => api.post('/skills', data),
  updateSkill: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}`),
  toggleSkillVisibility: (id) => api.put(`/skills/${id}/toggle-visibility`),

  // Contact
  sendMessage: (data) => api.post('/contact', data),
  getMessages: (params = {}) => api.get('/contact', { params }),
  markMessageAsRead: (id) => api.put(`/contact/${id}/read`),
  deleteMessage: (id) => api.delete(`/contact/${id}`),

  // Auth
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),

  // Upload
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadAvatar: (formData) => api.post('/upload/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadResume: (formData) => api.post('/upload/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteFile: (publicId) => api.delete(`/upload/${publicId}`),
};

export default apiService;