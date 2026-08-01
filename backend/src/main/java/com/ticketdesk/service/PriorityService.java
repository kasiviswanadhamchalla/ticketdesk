package com.ticketdesk.service;

import com.ticketdesk.dto.PriorityDto;

import java.util.List;

public interface PriorityService {
    List<PriorityDto> getAllPriorities();
    PriorityDto getPriorityById(Long id);
    PriorityDto createPriority(PriorityDto priorityDto);
    PriorityDto updatePriority(Long id, PriorityDto priorityDto);
    void deletePriority(Long id);
}
