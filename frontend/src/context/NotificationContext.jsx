import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationApi } from '../api/notificationApi';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const fetchUnreadCount = async () => {
    if (!user) return;
    try {
      const res = await notificationApi.getUnreadCount();
      if (res.success) {
        setUnreadCount(res.data);
      }
    } catch (e) {
      console.warn('Failed to fetch unread count', e);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await notificationApi.getNotifications({ page: 0, size: 5 });
      if (res.success && res.data) {
        setNotifications(res.data.content || []);
      }
    } catch (e) {
      console.warn('Failed to fetch notifications', e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      fetchNotifications();
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      fetchUnreadCount();
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setUnreadCount(0);
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ unreadCount, notifications, fetchUnreadCount, fetchNotifications, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
