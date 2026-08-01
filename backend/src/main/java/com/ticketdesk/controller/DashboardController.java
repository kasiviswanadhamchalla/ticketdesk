package com.ticketdesk.controller;

import com.ticketdesk.dto.ApiResponse;
import com.ticketdesk.dto.DashboardStatsDto;
import com.ticketdesk.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getStats(@AuthenticationPrincipal UserDetails userDetails) {
        DashboardStatsDto stats = dashboardService.getDashboardStats(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
