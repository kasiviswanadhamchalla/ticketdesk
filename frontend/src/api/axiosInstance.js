import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Access Token
axiosInstance.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
      } catch (e) {
        console.error('Failed to parse cached user token', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto Refresh Token on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.refreshToken) {
            const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
              refreshToken: user.refreshToken,
            });
            if (res.data && res.data.data) {
              const newTokens = res.data.data;
              user.accessToken = newTokens.accessToken;
              user.refreshToken = newTokens.refreshToken || user.refreshToken;
              localStorage.setItem('user', JSON.stringify(user));
              originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
              return axiosInstance(originalRequest);
            }
          }
        } catch (refreshErr) {
          console.error('Token refresh failed. Redirecting to login...', refreshErr);
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
