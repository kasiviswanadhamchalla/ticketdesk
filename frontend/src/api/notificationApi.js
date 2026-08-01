import axiosInstance from './axiosInstance';

export const notificationApi = {
  getNotifications: async (params = {}) => {
    const res = await axiosInstance.get('/notifications', { params });
    return res.data;
  },
  getUnread: async () => {
    const res = await axiosInstance.get('/notifications/unread');
    return res.data;
  },
  getUnreadCount: async () => {
    const res = await axiosInstance.get('/notifications/unread-count');
    return res.data;
  },
  markAsRead: async (id) => {
    const res = await axiosInstance.patch(`/notifications/${id}/read`);
    return res.data;
  },
  markAllAsRead: async () => {
    const res = await axiosInstance.patch('/notifications/read-all');
    return res.data;
  },
};
