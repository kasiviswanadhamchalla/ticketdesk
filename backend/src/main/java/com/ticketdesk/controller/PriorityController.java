package com.ticketdesk.controller;

import com.ticketdesk.dto.ApiResponse;
import com.ticketdesk.dto.PriorityDto;
import com.ticketdesk.service.PriorityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/priorities")
@RequiredArgsConstructor
public class PriorityController {

    private final PriorityService priorityService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PriorityDto>>> getAllPriorities() {
        List<PriorityDto> priorities = priorityService.getAllPriorities();
        return ResponseEntity.ok(ApiResponse.success(priorities));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PriorityDto>> getPriorityById(@PathVariable Long id) {
        PriorityDto priority = priorityService.getPriorityById(id);
        return ResponseEntity.ok(ApiResponse.success(priority));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PriorityDto>> createPriority(@Valid @RequestBody PriorityDto priorityDto) {
        PriorityDto created = priorityService.createPriority(priorityDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Priority created"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PriorityDto>> updatePriority(@PathVariable Long id, @Valid @RequestBody PriorityDto priorityDto) {
        PriorityDto updated = priorityService.updatePriority(id, priorityDto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Priority updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePriority(@PathVariable Long id) {
        priorityService.deletePriority(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Priority deleted"));
    }
}
