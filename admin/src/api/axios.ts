import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust if needed
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const { data } = await axios.post('http://localhost:3000/api/auth/refresh', {
            refreshToken,
          });

          localStorage.setItem('accessToken', data.accessToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Logout
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/admin/login';
        }
      } else {
         window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
