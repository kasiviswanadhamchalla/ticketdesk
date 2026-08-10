package com.ticketdesk.controller;

import com.ticketdesk.dto.*;
import com.ticketdesk.entity.TicketStatus;
import com.ticketdesk.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    public ResponseEntity<ApiResponse<TicketDto>> createTicket(
            @Valid @RequestBody TicketCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        TicketDto created = ticketService.createTicket(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Ticket created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<TicketDto>>> getAllTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) Long priorityId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "admin";
        PagedResponse<TicketDto> tickets = ticketService.getAllTickets(
                page, size, sortBy, sortDir, status, priorityId, categoryId, search, username);
        return ResponseEntity.ok(ApiResponse.success(tickets));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketDto>> getTicketById(@PathVariable Long id) {
        TicketDto ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ApiResponse.success(ticket));
    }

    @GetMapping("/number/{ticketNumber}")
    public ResponseEntity<ApiResponse<TicketDto>> getTicketByNumber(@PathVariable String ticketNumber) {
        TicketDto ticket = ticketService.getTicketByNumber(ticketNumber);
        return ResponseEntity.ok(ApiResponse.success(ticket));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketDto>> updateTicket(
            @PathVariable Long id,
            @RequestBody TicketUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        TicketDto updated = ticketService.updateTicket(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(updated, "Ticket updated successfully"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TicketDto>> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody TicketStatusUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        TicketDto updated = ticketService.updateTicketStatus(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(updated, "Ticket status updated to " + request.getStatus()));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPPORT_ENGINEER')")
    public ResponseEntity<ApiResponse<TicketDto>> assignTicket(
            @PathVariable Long id,
            @RequestParam Long engineerId,
            @AuthenticationPrincipal UserDetails userDetails) {
        TicketDto updated = ticketService.assignTicket(id, engineerId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(updated, "Ticket assigned successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteTicket(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        ticketService.deleteTicket(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(null, "Ticket deleted successfully"));
    }
}
