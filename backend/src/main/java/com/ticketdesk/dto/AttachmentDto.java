package com.ticketdesk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttachmentDto {
    private Long id;
    private Long ticketId;
    private String fileName;
    private String fileKey;
    private Long fileSize;
    private String fileType;
    private UserDto uploadedBy;
    private String downloadUrl;
    private Instant createdAt;
}
