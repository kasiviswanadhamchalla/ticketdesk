import axios from 'axios';
import axiosInstance from './axiosInstance';

export const attachmentApi = {
  getPresignedUrl: async (ticketId, fileName, contentType) => {
    const res = await axiosInstance.post('/attachments/presigned-url', null, {
      params: { ticketId, fileName, contentType },
    });
    return res.data;
  },
  uploadFileToS3: async (uploadUrl, file, contentType) => {
    return await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': contentType,
      },
    });
  },
  confirmUpload: async (ticketId, fileKey, fileName, fileSize, contentType) => {
    const res = await axiosInstance.post('/attachments/confirm', null, {
      params: { ticketId, fileKey, fileName, fileSize, contentType },
    });
    return res.data;
  },
  getTicketAttachments: async (ticketId) => {
    const res = await axiosInstance.get(`/attachments/ticket/${ticketId}`);
    return res.data;
  },
  getDownloadUrl: async (attachmentId) => {
    const res = await axiosInstance.get(`/attachments/${attachmentId}/download-url`);
    return res.data;
  },
  deleteAttachment: async (attachmentId) => {
    const res = await axiosInstance.delete(`/attachments/${attachmentId}`);
    return res.data;
  },
};
