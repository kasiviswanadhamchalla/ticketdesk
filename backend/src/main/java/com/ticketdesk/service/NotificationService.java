package com.ticketdesk.service;

import com.ticketdesk.dto.NotificationDto;
import com.ticketdesk.dto.PagedResponse;
import com.ticketdesk.entity.User;

import java.util.List;

public interface NotificationService {
    void createNotification(User user, String title, String message, String type, Long referenceId);
    PagedResponse<NotificationDto> getUserNotifications(String username, int page, int size);
    List<NotificationDto> getUnreadNotifications(String username);
    long getUnreadCount(String username);
    void markAsRead(Long notificationId, String username);
    void markAllAsRead(String username);
}
