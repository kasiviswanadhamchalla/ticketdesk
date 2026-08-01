package com.ticketdesk.service.impl;

import com.ticketdesk.dto.CommentCreateRequest;
import com.ticketdesk.dto.CommentDto;
import com.ticketdesk.dto.UserDto;
import com.ticketdesk.entity.*;
import com.ticketdesk.exception.ResourceNotFoundException;
import com.ticketdesk.exception.UnauthorizedException;
import com.ticketdesk.repository.CommentRepository;
import com.ticketdesk.repository.TicketRepository;
import com.ticketdesk.repository.UserRepository;
import com.ticketdesk.service.CommentService;
import com.ticketdesk.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional(readOnly = true)
    public List<CommentDto> getCommentsByTicketId(Long ticketId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        List<Comment> comments;
        if (user.getRole().getName() == ERole.ROLE_EMPLOYEE) {
            comments = commentRepository.findByTicketIdAndInternalFalseOrderByCreatedAtAsc(ticketId);
        } else {
            comments = commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
        }

        return comments.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommentDto addComment(Long ticketId, CommentCreateRequest request, String username) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", ticketId));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Employees cannot post internal notes
        boolean isInternal = request.isInternal();
        if (user.getRole().getName() == ERole.ROLE_EMPLOYEE) {
            isInternal = false;
        }

        Comment comment = Comment.builder()
                .ticket(ticket)
                .user(user)
                .content(request.getContent())
                .internal(isInternal)
                .build();

        Comment saved = commentRepository.save(comment);

        // Notify creator if engineer replied, or notify assigned engineer if creator replied
        if (!user.getId().equals(ticket.getCreatedBy().getId())) {
            notificationService.createNotification(
                    ticket.getCreatedBy(),
                    "New Ticket Comment",
                    user.getFirstName() + " commented on ticket " + ticket.getTicketNumber(),
                    "COMMENT",
                    ticket.getId()
            );
        } else if (ticket.getAssignedTo() != null && !user.getId().equals(ticket.getAssignedTo().getId())) {
            notificationService.createNotification(
                    ticket.getAssignedTo(),
                    "New Customer Comment",
                    user.getFirstName() + " replied on ticket " + ticket.getTicketNumber(),
                    "COMMENT",
                    ticket.getId()
            );
        }

        return mapToDto(saved);
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        if (!comment.getUser().getId().equals(user.getId()) && user.getRole().getName() != ERole.ROLE_ADMIN) {
            throw new UnauthorizedException("You are not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    private CommentDto mapToDto(Comment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .ticketId(comment.getTicket().getId())
                .user(UserDto.builder()
                        .id(comment.getUser().getId())
                        .username(comment.getUser().getUsername())
                        .email(comment.getUser().getEmail())
                        .firstName(comment.getUser().getFirstName())
                        .lastName(comment.getUser().getLastName())
                        .role(comment.getUser().getRole().getName().name())
                        .build())
                .content(comment.getContent())
                .internal(comment.isInternal())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
