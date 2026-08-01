package com.ticketdesk.service.impl;

import com.ticketdesk.dto.DashboardStatsDto;
import com.ticketdesk.entity.TicketStatus;
import com.ticketdesk.repository.TicketRepository;
import com.ticketdesk.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final TicketRepository ticketRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats(String username) {
        long totalTickets = ticketRepository.count();
        long openTickets = ticketRepository.countByStatus(TicketStatus.OPEN);
        long inProgressTickets = ticketRepository.countByStatus(TicketStatus.IN_PROGRESS);
        long resolvedTickets = ticketRepository.countByStatus(TicketStatus.RESOLVED);
        long closedTickets = ticketRepository.countByStatus(TicketStatus.CLOSED);

        Map<String, Long> statusDist = new HashMap<>();
        List<Map<String, Object>> statusRaw = ticketRepository.countTicketsGroupByStatus();
        for (Map<String, Object> map : statusRaw) {
            Object statusObj = map.get("status");
            Object countObj = map.get("count");
            if (statusObj != null && countObj != null) {
                statusDist.put(statusObj.toString(), ((Number) countObj).longValue());
            }
        }

        Map<String, Long> priorityDist = new HashMap<>();
        List<Map<String, Object>> priorityRaw = ticketRepository.countTicketsGroupByPriority();
        for (Map<String, Object> map : priorityRaw) {
            Object pObj = map.get("priority");
            Object cObj = map.get("count");
            if (pObj != null && cObj != null) {
                priorityDist.put(pObj.toString(), ((Number) cObj).longValue());
            }
        }

        Map<String, Long> categoryDist = new HashMap<>();
        List<Map<String, Object>> categoryRaw = ticketRepository.countTicketsGroupByCategory();
        for (Map<String, Object> map : categoryRaw) {
            Object catObj = map.get("category");
            Object cObj = map.get("count");
            if (catObj != null && cObj != null) {
                categoryDist.put(catObj.toString(), ((Number) cObj).longValue());
            }
        }

        return DashboardStatsDto.builder()
                .totalTickets(totalTickets)
                .openTickets(openTickets)
                .inProgressTickets(inProgressTickets)
                .resolvedTickets(resolvedTickets)
                .closedTickets(closedTickets)
                .statusDistribution(statusDist)
                .priorityDistribution(priorityDist)
                .categoryDistribution(categoryDist)
                .build();
    }
}
