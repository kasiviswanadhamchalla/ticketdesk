import axiosInstance from './axiosInstance';

export const authApi = {
  login: async (credentials) => {
    const res = await axiosInstance.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await axiosInstance.post('/auth/register', userData);
    return res.data;
  },
  refreshToken: async (refreshToken) => {
    const res = await axiosInstance.post('/auth/refresh-token', { refreshToken });
    return res.data;
  },
  changePassword: async (data) => {
    const res = await axiosInstance.post('/auth/change-password', data);
    return res.data;
  },
  forgotPassword: async (email) => {
    const res = await axiosInstance.post('/auth/forgot-password', { email });
    return res.data;
  },
  logout: async () => {
    const res = await axiosInstance.post('/auth/logout');
    return res.data;
  },
};
