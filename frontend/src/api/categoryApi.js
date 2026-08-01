import axiosInstance from './axiosInstance';

export const categoryApi = {
  getAll: async () => {
    const res = await axiosInstance.get('/categories');
    return res.data;
  },
  create: async (data) => {
    const res = await axiosInstance.post('/categories', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await axiosInstance.put(`/categories/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await axiosInstance.delete(`/categories/${id}`);
    return res.data;
  },
};
