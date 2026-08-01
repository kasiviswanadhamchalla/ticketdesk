package com.ticketdesk.service;

import com.ticketdesk.dto.*;
import com.ticketdesk.entity.TicketStatus;

public interface TicketService {
    TicketDto createTicket(TicketCreateRequest request, String username);
    TicketDto getTicketById(Long id);
    TicketDto getTicketByNumber(String ticketNumber);
    PagedResponse<TicketDto> getAllTickets(int page, int size, String sortBy, String sortDir, TicketStatus status, Long priorityId, Long categoryId, String search, String currentUsername);
    TicketDto updateTicket(Long id, TicketUpdateRequest request, String username);
    TicketDto updateTicketStatus(Long id, TicketStatusUpdateRequest request, String username);
    TicketDto assignTicket(Long id, Long engineerId, String username);
    void deleteTicket(Long id, String username);
}
