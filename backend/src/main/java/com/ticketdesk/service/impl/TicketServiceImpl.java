package com.ticketdesk.service.impl;

import com.ticketdesk.dto.*;
import com.ticketdesk.entity.*;
import com.ticketdesk.exception.BadRequestException;
import com.ticketdesk.exception.ResourceNotFoundException;
import com.ticketdesk.exception.UnauthorizedException;
import com.ticketdesk.repository.*;
import com.ticketdesk.service.NotificationService;
import com.ticketdesk.service.TicketService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final PriorityRepository priorityRepository;
    private final CategoryRepository categoryRepository;
    private final CommentRepository commentRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public TicketDto createTicket(TicketCreateRequest request, String username) {
        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Priority priority = priorityRepository.findById(request.getPriorityId())
                .orElseThrow(() -> new ResourceNotFoundException("Priority", "id", request.getPriorityId()));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        User assignedTo = null;
        if (request.getAssignedToId() != null) {
            assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAssignedToId()));
        }

        String ticketNumber = "TICK-" + (1000 + new Random().nextInt(90000));

        Ticket ticket = Ticket.builder()
                .ticketNumber(ticketNumber)
                .title(request.getTitle())
                .description(request.getDescription())
                .status(TicketStatus.OPEN)
                .priority(priority)
                .category(category)
                .createdBy(creator)
                .assignedTo(assignedTo)
                .build();

        Ticket savedTicket = ticketRepository.save(ticket);

        // Notify assigned engineer if present
        if (assignedTo != null) {
            notificationService.createNotification(
                    assignedTo,
                    "New Ticket Assigned",
                    "You have been assigned to ticket " + ticketNumber + ": " + request.getTitle(),
                    "TICKET_ASSIGNED",
                    savedTicket.getId()
            );
        }

        return mapToDto(savedTicket);
    }

    @Override
    @Transactional(readOnly = true)
    public TicketDto getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));
        return mapToDto(ticket);
    }

    @Override
    @Transactional(readOnly = true)
    public TicketDto getTicketByNumber(String ticketNumber) {
        Ticket ticket = ticketRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "ticketNumber", ticketNumber));
        return mapToDto(ticket);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<TicketDto> getAllTickets(int page, int size, String sortBy, String sortDir,
                                                TicketStatus status, Long priorityId, Long categoryId,
                                                String search, String currentUsername) {
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", currentUsername));

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Ticket> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Role based filtering: EMPLOYEE only sees their own tickets
            if (currentUser.getRole().getName() == ERole.ROLE_EMPLOYEE) {
                predicates.add(criteriaBuilder.equal(root.get("createdBy").get("id"), currentUser.getId()));
            }

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            if (priorityId != null) {
                predicates.add(criteriaBuilder.equal(root.get("priority").get("id"), priorityId));
            }

            if (categoryId != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), categoryId));
            }

            if (search != null && !search.isBlank()) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                Predicate titleMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchPattern);
                Predicate descMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchPattern);
                Predicate numberMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("ticketNumber")), searchPattern);
                predicates.add(criteriaBuilder.or(titleMatch, descMatch, numberMatch));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<Ticket> ticketPage = ticketRepository.findAll(spec, pageable);
        List<TicketDto> content = ticketPage.getContent().stream().map(this::mapToDto).collect(Collectors.toList());

        return PagedResponse.<TicketDto>builder()
                .content(content)
                .page(ticketPage.getNumber())
                .size(ticketPage.getSize())
                .totalElements(ticketPage.getTotalElements())
                .totalPages(ticketPage.getTotalPages())
                .last(ticketPage.isLast())
                .build();
    }

    @Override
    @Transactional
    public TicketDto updateTicket(Long id, TicketUpdateRequest request, String username) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Security check
        if (currentUser.getRole().getName() == ERole.ROLE_EMPLOYEE && !ticket.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only modify your own tickets");
        }

        if (request.getTitle() != null) ticket.setTitle(request.getTitle());
        if (request.getDescription() != null) ticket.setDescription(request.getDescription());

        if (request.getPriorityId() != null) {
            Priority priority = priorityRepository.findById(request.getPriorityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Priority", "id", request.getPriorityId()));
            ticket.setPriority(priority);
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            ticket.setCategory(category);
        }

        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAssignedToId()));
            ticket.setAssignedTo(assignedTo);
        }

        if (request.getStatus() != null) {
            updateTicketStatusInternal(ticket, request.getStatus());
        }

        return mapToDto(ticketRepository.save(ticket));
    }

    @Override
    @Transactional
    public TicketDto updateTicketStatus(Long id, TicketStatusUpdateRequest request, String username) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        updateTicketStatusInternal(ticket, request.getStatus());

        if (request.getComment() != null && !request.getComment().isBlank()) {
            Comment comment = Comment.builder()
                    .ticket(ticket)
                    .user(currentUser)
                    .content("Status changed to " + request.getStatus() + ". Note: " + request.getComment())
                    .internal(false)
                    .build();
            commentRepository.save(comment);
        }

        Ticket updatedTicket = ticketRepository.save(ticket);

        // Notify ticket creator
        notificationService.createNotification(
                ticket.getCreatedBy(),
                "Ticket Status Updated",
                "Ticket " + ticket.getTicketNumber() + " status updated to " + request.getStatus(),
                "STATUS_UPDATE",
                ticket.getId()
        );

        return mapToDto(updatedTicket);
    }

    @Override
    @Transactional
    public TicketDto assignTicket(Long id, Long engineerId, String username) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));

        User engineer = userRepository.findById(engineerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", engineerId));

        ticket.setAssignedTo(engineer);
        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }

        Ticket saved = ticketRepository.save(ticket);

        notificationService.createNotification(
                engineer,
                "Ticket Assigned",
                "Ticket " + ticket.getTicketNumber() + " has been assigned to you",
                "ASSIGNMENT",
                ticket.getId()
        );

        return mapToDto(saved);
    }

    @Override
    @Transactional
    public void deleteTicket(Long id, String username) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));
        ticketRepository.delete(ticket);
    }

    private void updateTicketStatusInternal(Ticket ticket, TicketStatus newStatus) {
        ticket.setStatus(newStatus);
        if (newStatus == TicketStatus.RESOLVED) {
            ticket.setResolvedAt(Instant.now());
        } else if (newStatus == TicketStatus.CLOSED) {
            ticket.setClosedAt(Instant.now());
        }
    }

    private TicketDto mapToDto(Ticket ticket) {
        return TicketDto.builder()
                .id(ticket.getId())
                .ticketNumber(ticket.getTicketNumber())
                .title(ticket.getTitle())
                .description(ticket.getDescription())
                .status(ticket.getStatus())
                .priority(mapPriorityDto(ticket.getPriority()))
                .category(mapCategoryDto(ticket.getCategory()))
                .createdBy(mapUserDto(ticket.getCreatedBy()))
                .assignedTo(ticket.getAssignedTo() != null ? mapUserDto(ticket.getAssignedTo()) : null)
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .resolvedAt(ticket.getResolvedAt())
                .closedAt(ticket.getClosedAt())
                .build();
    }

    private PriorityDto mapPriorityDto(Priority priority) {
        if (priority == null) return null;
        return PriorityDto.builder()
                .id(priority.getId())
                .name(priority.getName())
                .description(priority.getDescription())
                .colorCode(priority.getColorCode())
                .slaHours(priority.getSlaHours())
                .build();
    }

    private CategoryDto mapCategoryDto(Category category) {
        if (category == null) return null;
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }

    private UserDto mapUserDto(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().getName().name())
                .active(user.isActive())
                .build();
    }
}
