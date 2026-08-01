import axiosInstance from './axiosInstance';

export const commentApi = {
  getComments: async (ticketId) => {
    const res = await axiosInstance.get(`/tickets/${ticketId}/comments`);
    return res.data;
  },
  addComment: async (ticketId, commentData) => {
    const res = await axiosInstance.post(`/tickets/${ticketId}/comments`, commentData);
    return res.data;
  },
  deleteComment: async (ticketId, commentId) => {
    const res = await axiosInstance.delete(`/tickets/${ticketId}/comments/${commentId}`);
    return res.data;
  },
};
