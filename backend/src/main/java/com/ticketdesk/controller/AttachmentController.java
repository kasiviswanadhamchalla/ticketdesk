package com.ticketdesk.controller;

import com.ticketdesk.dto.ApiResponse;
import com.ticketdesk.dto.AttachmentDto;
import com.ticketdesk.dto.PresignedUrlResponse;
import com.ticketdesk.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    @PostMapping("/presigned-url")
    public ResponseEntity<ApiResponse<PresignedUrlResponse>> getPresignedUrl(
            @RequestParam Long ticketId,
            @RequestParam String fileName,
            @RequestParam String contentType,
            @AuthenticationPrincipal UserDetails userDetails) {
        PresignedUrlResponse response = attachmentService.generatePresignedUploadUrl(ticketId, fileName, contentType, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<AttachmentDto>> confirmUpload(
            @RequestParam Long ticketId,
            @RequestParam String fileKey,
            @RequestParam String fileName,
            @RequestParam Long fileSize,
            @RequestParam String contentType,
            @AuthenticationPrincipal UserDetails userDetails) {
        AttachmentDto attachment = attachmentService.confirmAttachmentUpload(ticketId, fileKey, fileName, fileSize, contentType, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(attachment, "Attachment saved"));
    }

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<ApiResponse<List<AttachmentDto>>> getTicketAttachments(
            @PathVariable Long ticketId,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<AttachmentDto> attachments = attachmentService.getAttachmentsByTicketId(ticketId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(attachments));
    }

    @GetMapping("/{id}/download-url")
    public ResponseEntity<ApiResponse<String>> getDownloadUrl(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String downloadUrl = attachmentService.generatePresignedDownloadUrl(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(downloadUrl));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAttachment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        attachmentService.deleteAttachment(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(null, "Attachment deleted"));
    }
}
