package com.ticketdesk.service;

import com.ticketdesk.dto.AttachmentDto;
import com.ticketdesk.dto.PresignedUrlResponse;

import java.util.List;

public interface AttachmentService {
    PresignedUrlResponse generatePresignedUploadUrl(Long ticketId, String fileName, String contentType, String username);
    AttachmentDto confirmAttachmentUpload(Long ticketId, String fileKey, String fileName, Long fileSize, String contentType, String username);
    List<AttachmentDto> getAttachmentsByTicketId(Long ticketId, String username);
    String generatePresignedDownloadUrl(Long attachmentId, String username);
    void deleteAttachment(Long attachmentId, String username);
}
