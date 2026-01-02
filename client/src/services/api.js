import axios from 'axios';

const API_BASE_URL = '/api'; // Uses Vite proxy

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const API = {
  getGallery: () => apiClient.get('/gallery'),
  getTours: (search = '', limit = 100) => apiClient.get(`/tours?search=${encodeURIComponent(search)}&limit=${limit}`),
  getTourBySlug: (slug) => apiClient.get(`/tours/${slug}`),
  getPage: (key) => apiClient.get(`/pages/${key}`),
  getSettings: () => apiClient.get('/settings'),
  sendInquiry: (data) => apiClient.post('/inquiries', data),
  search: (q) => apiClient.get(`/search?q=${encodeURIComponent(q)}`),
  getFeaturedDestinations: () => apiClient.get('/destinations/featured'),
  getFeaturedExperiences: () => apiClient.get('/experiences/featured'),
};
