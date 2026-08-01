package com.ticketdesk.service.impl;

import com.ticketdesk.dto.AttachmentDto;
import com.ticketdesk.dto.PresignedUrlResponse;
import com.ticketdesk.dto.UserDto;
import com.ticketdesk.entity.Attachment;
import com.ticketdesk.entity.Ticket;
import com.ticketdesk.entity.User;
import com.ticketdesk.exception.ResourceNotFoundException;
import com.ticketdesk.repository.AttachmentRepository;
import com.ticketdesk.repository.TicketRepository;
import com.ticketdesk.repository.UserRepository;
import com.ticketdesk.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttachmentServiceImpl implements AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket-name:ticketdesk-attachments-production}")
    private String bucketName;

    @Value("${aws.s3.presigned-url-duration-minutes:15}")
    private int presignedUrlDurationMinutes;

    @Override
    @Transactional(readOnly = true)
    public PresignedUrlResponse generatePresignedUploadUrl(Long ticketId, String fileName, String contentType, String username) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", ticketId));

        String fileKey = "tickets/" + ticket.getId() + "/" + UUID.randomUUID() + "-" + fileName;

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(presignedUrlDurationMinutes))
                .putObjectRequest(objectRequest)
                .build();

        String uploadUrl = s3Presigner.presignPutObject(presignRequest).url().toString();

        return PresignedUrlResponse.builder()
                .uploadUrl(uploadUrl)
                .fileKey(fileKey)
                .fileName(fileName)
                .build();
    }

    @Override
    @Transactional
    public AttachmentDto confirmAttachmentUpload(Long ticketId, String fileKey, String fileName, Long fileSize, String contentType, String username) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", ticketId));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Attachment attachment = Attachment.builder()
                .ticket(ticket)
                .fileName(fileName)
                .fileKey(fileKey)
                .fileSize(fileSize)
                .fileType(contentType)
                .uploadedBy(user)
                .build();

        Attachment saved = attachmentRepository.save(attachment);
        return mapToDto(saved, username);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttachmentDto> getAttachmentsByTicketId(Long ticketId, String username) {
        return attachmentRepository.findByTicketId(ticketId).stream()
                .map(attachment -> mapToDto(attachment, username))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public String generatePresignedDownloadUrl(Long attachmentId, String username) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment", "id", attachmentId));

        GetObjectRequest objectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(attachment.getFileKey())
                .responseContentDisposition("attachment; filename=\"" + attachment.getFileName() + "\"")
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(presignedUrlDurationMinutes))
                .getObjectRequest(objectRequest)
                .build();

        return s3Presigner.presignGetObject(presignRequest).url().toString();
    }

    @Override
    @Transactional
    public void deleteAttachment(Long attachmentId, String username) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment", "id", attachmentId));
        attachmentRepository.delete(attachment);
    }

    private AttachmentDto mapToDto(Attachment attachment, String username) {
        String downloadUrl = "";
        try {
            downloadUrl = generatePresignedDownloadUrl(attachment.getId(), username);
        } catch (Exception e) {
            log.warn("Could not generate presigned download URL for attachment id {}: {}", attachment.getId(), e.getMessage());
        }

        return AttachmentDto.builder()
                .id(attachment.getId())
                .ticketId(attachment.getTicket().getId())
                .fileName(attachment.getFileName())
                .fileKey(attachment.getFileKey())
                .fileSize(attachment.getFileSize())
                .fileType(attachment.getFileType())
                .uploadedBy(UserDto.builder()
                        .id(attachment.getUploadedBy().getId())
                        .username(attachment.getUploadedBy().getUsername())
                        .email(attachment.getUploadedBy().getEmail())
                        .firstName(attachment.getUploadedBy().getFirstName())
                        .lastName(attachment.getUploadedBy().getLastName())
                        .build())
                .downloadUrl(downloadUrl)
                .createdAt(attachment.getCreatedAt())
                .build();
    }
}
