import axiosInstance from './axiosInstance';

export const ticketApi = {
  createTicket: async (ticketData) => {
    const res = await axiosInstance.post('/tickets', ticketData);
    return res.data;
  },
  getTickets: async (params = {}) => {
    const res = await axiosInstance.get('/tickets', { params });
    return res.data;
  },
  getTicketById: async (id) => {
    const res = await axiosInstance.get(`/tickets/${id}`);
    return res.data;
  },
  getTicketByNumber: async (ticketNumber) => {
    const res = await axiosInstance.get(`/tickets/number/${ticketNumber}`);
    return res.data;
  },
  updateTicket: async (id, data) => {
    const res = await axiosInstance.put(`/tickets/${id}`, data);
    return res.data;
  },
  updateStatus: async (id, status, comment = '') => {
    const res = await axiosInstance.patch(`/tickets/${id}/status`, { status, comment });
    return res.data;
  },
  assignTicket: async (id, engineerId) => {
    const res = await axiosInstance.patch(`/tickets/${id}/assign`, null, {
      params: { engineerId },
    });
    return res.data;
  },
  deleteTicket: async (id) => {
    const res = await axiosInstance.delete(`/tickets/${id}`);
    return res.data;
  },
};
