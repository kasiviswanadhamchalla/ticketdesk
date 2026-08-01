import axiosInstance from './axiosInstance';

export const userApi = {
  getCurrentUser: async () => {
    const res = await axiosInstance.get('/users/me');
    return res.data;
  },
  getAllUsers: async () => {
    const res = await axiosInstance.get('/users');
    return res.data;
  },
  getUserById: async (id) => {
    const res = await axiosInstance.get(`/users/${id}`);
    return res.data;
  },
  getUsersByRole: async (role) => {
    const res = await axiosInstance.get(`/users/role/${role}`);
    return res.data;
  },
  updateUserRole: async (id, role) => {
    const res = await axiosInstance.put(`/users/${id}/role`, null, { params: { role } });
    return res.data;
  },
  toggleUserStatus: async (id, active) => {
    const res = await axiosInstance.patch(`/users/${id}/status`, null, { params: { active } });
    return res.data;
  },
};
