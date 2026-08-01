package com.ticketdesk.service.impl;

import com.ticketdesk.dto.PriorityDto;
import com.ticketdesk.entity.Priority;
import com.ticketdesk.exception.BadRequestException;
import com.ticketdesk.exception.ResourceNotFoundException;
import com.ticketdesk.repository.PriorityRepository;
import com.ticketdesk.service.PriorityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PriorityServiceImpl implements PriorityService {

    private final PriorityRepository priorityRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PriorityDto> getAllPriorities() {
        return priorityRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PriorityDto getPriorityById(Long id) {
        Priority priority = priorityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Priority", "id", id));
        return mapToDto(priority);
    }

    @Override
    @Transactional
    public PriorityDto createPriority(PriorityDto priorityDto) {
        if (priorityRepository.existsByName(priorityDto.getName())) {
            throw new BadRequestException("Priority with name '" + priorityDto.getName() + "' already exists");
        }

        Priority priority = Priority.builder()
                .name(priorityDto.getName())
                .description(priorityDto.getDescription())
                .colorCode(priorityDto.getColorCode() != null ? priorityDto.getColorCode() : "#6B7280")
                .slaHours(priorityDto.getSlaHours() != null ? priorityDto.getSlaHours() : 24)
                .build();

        return mapToDto(priorityRepository.save(priority));
    }

    @Override
    @Transactional
    public PriorityDto updatePriority(Long id, PriorityDto priorityDto) {
        Priority priority = priorityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Priority", "id", id));

        priority.setName(priorityDto.getName());
        priority.setDescription(priorityDto.getDescription());
        if (priorityDto.getColorCode() != null) priority.setColorCode(priorityDto.getColorCode());
        if (priorityDto.getSlaHours() != null) priority.setSlaHours(priorityDto.getSlaHours());

        return mapToDto(priorityRepository.save(priority));
    }

    @Override
    @Transactional
    public void deletePriority(Long id) {
        Priority priority = priorityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Priority", "id", id));
        priorityRepository.delete(priority);
    }

    private PriorityDto mapToDto(Priority priority) {
        return PriorityDto.builder()
                .id(priority.getId())
                .name(priority.getName())
                .description(priority.getDescription())
                .colorCode(priority.getColorCode())
                .slaHours(priority.getSlaHours())
                .createdAt(priority.getCreatedAt())
                .build();
    }
}
