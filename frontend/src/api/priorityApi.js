import axiosInstance from './axiosInstance';

export const priorityApi = {
  getAll: async () => {
    const res = await axiosInstance.get('/priorities');
    return res.data;
  },
  create: async (data) => {
    const res = await axiosInstance.post('/priorities', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await axiosInstance.put(`/priorities/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await axiosInstance.delete(`/priorities/${id}`);
    return res.data;
  },
};
