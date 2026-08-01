import React, { useState, useEffect } from 'react';
import { Card, Button, ProgressBar, ListGroup, Alert } from 'react-bootstrap';
import { attachmentApi } from '../api/attachmentApi';
import { Paperclip, Upload, Download, Trash2, FileText, CheckCircle2 } from 'lucide-react';

export const AttachmentUploader = ({ ticketId }) => {
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchAttachments = async () => {
    try {
      const res = await attachmentApi.getTicketAttachments(ticketId);
      if (res.success) {
        setAttachments(res.data || []);
      }
    } catch (e) {
      console.error('Failed to fetch attachments', e);
    }
  };

  useEffect(() => {
    fetchAttachments();
  }, [ticketId]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(20);
    setError(null);
    setSuccess(null);

    try {
      // Step 1: Request pre-signed URL
      const presignedRes = await attachmentApi.getPresignedUrl(ticketId, file.name, file.type || 'application/octet-stream');
      setUploadProgress(50);

      if (presignedRes.success && presignedRes.data) {
        const { uploadUrl, fileKey } = presignedRes.data;

        // Step 2: Upload binary data directly to AWS S3
        await attachmentApi.uploadFileToS3(uploadUrl, file, file.type || 'application/octet-stream');
        setUploadProgress(80);

        // Step 3: Confirm upload with backend
        const confirmRes = await attachmentApi.confirmUpload(
          ticketId,
          fileKey,
          file.name,
          file.size,
          file.type || 'application/octet-stream'
        );

        if (confirmRes.success) {
          setUploadProgress(100);
          setSuccess(`File "${file.name}" uploaded successfully!`);
          fetchAttachments();
        }
      }
    } catch (err) {
      console.error('Upload failed', err);
      setError('File upload failed. Please try again.');
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await attachmentApi.deleteAttachment(id);
      fetchAttachments();
    } catch (e) {
      console.error('Delete attachment failed', e);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="glass-card mt-4">
      <Card.Header className="bg-transparent border-bottom border-secondary border-opacity-25 py-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 text-light d-flex align-items-center gap-2">
          <Paperclip size={20} className="text-indigo-400" /> Attachments ({attachments.length})
        </h5>
        <div>
          <input type="file" id="file-input" style={{ display: 'none' }} onChange={handleFileUpload} disabled={uploading} />
          <label htmlFor="file-input" className="btn btn-indigo btn-sm d-flex align-items-center gap-2 m-0 cursor-pointer">
            <Upload size={14} /> Upload File
          </label>
        </div>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}

        {uploading && (
          <div className="mb-3">
            <small className="text-muted d-block mb-1">Uploading to S3 Bucket...</small>
            <ProgressBar animated now={uploadProgress} variant="indigo" />
          </div>
        )}

        {attachments.length === 0 ? (
          <div className="text-center text-muted py-3">No attachments uploaded for this ticket.</div>
        ) : (
          <ListGroup variant="flush" className="bg-transparent">
            {attachments.map((att) => (
              <ListGroup.Item
                key={att.id}
                className="bg-dark bg-opacity-30 border-secondary border-opacity-25 text-light d-flex justify-content-between align-items-center py-2 px-3 rounded-2 mb-2"
              >
                <div className="d-flex align-items-center gap-2 text-truncate me-3">
                  <FileText size={18} className="text-indigo-400 flex-shrink-0" />
                  <div>
                    <div className="fw-medium text-truncate" style={{ maxWidth: '300px' }}>{att.fileName}</div>
                    <small className="text-muted">{formatFileSize(att.fileSize)} • Uploaded by {att.uploadedBy?.firstName}</small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  {att.downloadUrl && (
                    <a
                      href={att.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
                    >
                      <Download size={14} /> Download
                    </a>
                  )}
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(att.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};
