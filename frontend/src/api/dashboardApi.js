import axiosInstance from './axiosInstance';

export const dashboardApi = {
  getStats: async () => {
    const res = await axiosInstance.get('/dashboard/stats');
    return res.data;
  },
};
