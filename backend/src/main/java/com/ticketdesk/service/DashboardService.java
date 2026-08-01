package com.ticketdesk.service;

import com.ticketdesk.dto.DashboardStatsDto;

public interface DashboardService {
    DashboardStatsDto getDashboardStats(String username);
}
