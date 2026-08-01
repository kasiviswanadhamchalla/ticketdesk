package com.ticketdesk.service;

import com.ticketdesk.dto.CommentCreateRequest;
import com.ticketdesk.dto.CommentDto;

import java.util.List;

public interface CommentService {
    List<CommentDto> getCommentsByTicketId(Long ticketId, String username);
    CommentDto addComment(Long ticketId, CommentCreateRequest request, String username);
    void deleteComment(Long commentId, String username);
}
