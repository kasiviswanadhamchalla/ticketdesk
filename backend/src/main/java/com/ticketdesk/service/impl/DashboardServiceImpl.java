package com.ticketdesk.service.impl;

import com.ticketdesk.dto.DashboardStatsDto;
import com.ticketdesk.entity.ERole;
import com.ticketdesk.entity.TicketStatus;
import com.ticketdesk.entity.User;
import com.ticketdesk.exception.ResourceNotFoundException;
import com.ticketdesk.repository.TicketRepository;
import com.ticketdesk.repository.UserRepository;
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
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        boolean isEmployee = user.getRole().getName() == ERole.ROLE_EMPLOYEE;

        long totalTickets;
        long openTickets;
        long inProgressTickets;
        long resolvedTickets;
        long closedTickets;

        List<Map<String, Object>> statusRaw;
        List<Map<String, Object>> priorityRaw;
        List<Map<String, Object>> categoryRaw;

        if (isEmployee) {
            totalTickets = ticketRepository.countByCreatedById(user.getId());
            openTickets = ticketRepository.countByCreatedByIdAndStatus(user.getId(), TicketStatus.OPEN);
            inProgressTickets = ticketRepository.countByCreatedByIdAndStatus(user.getId(), TicketStatus.IN_PROGRESS);
            resolvedTickets = ticketRepository.countByCreatedByIdAndStatus(user.getId(), TicketStatus.RESOLVED);
            closedTickets = ticketRepository.countByCreatedByIdAndStatus(user.getId(), TicketStatus.CLOSED);

            statusRaw = ticketRepository.countTicketsGroupByStatusForUser(user.getId());
            priorityRaw = ticketRepository.countTicketsGroupByPriorityForUser(user.getId());
            categoryRaw = ticketRepository.countTicketsGroupByCategoryForUser(user.getId());
        } else {
            totalTickets = ticketRepository.count();
            openTickets = ticketRepository.countByStatus(TicketStatus.OPEN);
            inProgressTickets = ticketRepository.countByStatus(TicketStatus.IN_PROGRESS);
            resolvedTickets = ticketRepository.countByStatus(TicketStatus.RESOLVED);
            closedTickets = ticketRepository.countByStatus(TicketStatus.CLOSED);

            statusRaw = ticketRepository.countTicketsGroupByStatus();
            priorityRaw = ticketRepository.countTicketsGroupByPriority();
            categoryRaw = ticketRepository.countTicketsGroupByCategory();
        }

        Map<String, Long> statusDist = new HashMap<>();
        for (Map<String, Object> map : statusRaw) {
            Object statusObj = map.get("status");
            Object countObj = map.get("count");
            if (statusObj != null && countObj != null) {
                statusDist.put(statusObj.toString(), ((Number) countObj).longValue());
            }
        }

        Map<String, Long> priorityDist = new HashMap<>();
        for (Map<String, Object> map : priorityRaw) {
            Object pObj = map.get("priority");
            Object cObj = map.get("count");
            if (pObj != null && cObj != null) {
                priorityDist.put(pObj.toString(), ((Number) cObj).longValue());
            }
        }

        Map<String, Long> categoryDist = new HashMap<>();
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
