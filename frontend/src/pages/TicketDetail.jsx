import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Badge, Button, Form, Modal, Alert } from 'react-bootstrap';
import { ticketApi } from '../api/ticketApi';
import { userApi } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CommentSection } from '../components/CommentSection';
import { AttachmentUploader } from '../components/AttachmentUploader';
import { ArrowLeft, User, Clock, Tag, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

export const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Title Tag Update
  useDocumentTitle(ticket ? `${ticket.ticketNumber} - ${ticket.title}` : 'Ticket Details');

  // Status Change State
  const [statusComment, setStatusComment] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState('');
  const [statusError, setStatusError] = useState('');

  const fetchTicket = async () => {
    try {
      const res = await ticketApi.getTicketById(id);
      if (res.success) setTicket(res.data);
    } catch (e) {
      console.error('Failed to load ticket', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();

    if (hasRole(['ROLE_ADMIN', 'ROLE_SUPPORT_ENGINEER'])) {
      userApi.getUsersByRole('ROLE_SUPPORT_ENGINEER')
        .then((res) => { if (res.success) setEngineers(res.data || []); })
        .catch(console.error);
    }
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!targetStatus) return;
    setStatusError('');
    try {
      const res = await ticketApi.updateStatus(id, targetStatus, statusComment);
      if (res.success) {
        setShowStatusModal(false);
        setStatusComment('');
        fetchTicket();
      }
    } catch (err) {
      console.error(err);
      setStatusError(err.response?.data?.message || 'Failed to update ticket status');
    }
  };

  const handleAssign = async (engineerId) => {
    if (!engineerId) return;
    try {
      const res = await ticketApi.assignTicket(id, engineerId);
      if (res.success) fetchTicket();
    } catch (e) {
      console.error('Assignment failed', e);
    }
  };

  if (loading) return <LoadingSpinner text="Loading ticket details..." />;
  if (!ticket) return <Alert variant="danger" className="m-4">Ticket not found.</Alert>;

  return (
    <div className="p-3 p-md-4">
      <Button variant="link" onClick={() => navigate('/tickets')} className="text-decoration-none p-0 mb-3 d-flex align-items-center gap-1 fw-bold" style={{ color: '#4f46e5' }}>
        <ArrowLeft size={16} /> Back to Tickets
      </Button>

      {/* Header Info */}
      <Card className="glass-card p-4 mb-4" style={{ background: '#ffffff' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="fw-mono fs-6 fw-bold" style={{ color: '#475569' }}>{ticket.ticketNumber}</span>
              <span className={`badge badge-status-${ticket.status.toLowerCase()}`}>
                {ticket.status.replace('_', ' ')}
              </span>
              {ticket.priority && (
                <Badge style={{ backgroundColor: `${ticket.priority.colorCode}20`, color: ticket.priority.colorCode, border: `1px solid ${ticket.priority.colorCode}`, fontWeight: '700' }}>
                  {ticket.priority.name} Priority
                </Badge>
              )}
            </div>
            <h3 className="fw-bold mb-2" style={{ color: '#0f172a' }}>{ticket.title}</h3>
          </div>

          {/* Action Buttons */}
          <div className="d-flex flex-wrap gap-2">
            {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => { setTargetStatus('RESOLVED'); setShowStatusModal(true); }}
                className="d-flex align-items-center gap-1 fw-bold"
              >
                <CheckCircle2 size={16} /> Resolve Ticket
              </Button>
            )}

            {ticket.status === 'RESOLVED' && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => { setTargetStatus('CLOSED'); setShowStatusModal(true); }}
                className="d-flex align-items-center gap-1 fw-bold"
              >
                <XCircle size={16} /> Close Ticket
              </Button>
            )}

            {(ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') && (
              <Button
                variant="outline-warning"
                size="sm"
                onClick={() => { setTargetStatus('REOPENED'); setShowStatusModal(true); }}
                className="d-flex align-items-center gap-1 fw-bold"
              >
                <RotateCcw size={16} /> Reopen Ticket
              </Button>
            )}
          </div>
        </div>

        {/* Metadata Details */}
        <Row className="g-3 pt-3 border-top border-slate-200 small" style={{ color: '#334155' }}>
          <Col md={3} sm={6}>
            <div className="fw-bold mb-1" style={{ color: '#0f172a' }}>Created By</div>
            <div className="d-flex align-items-center gap-1 font-medium" style={{ color: '#334155' }}>
              <User size={14} className="text-indigo-600" /> {ticket.createdBy?.firstName} {ticket.createdBy?.lastName}
            </div>
          </Col>

          <Col md={3} sm={6}>
            <div className="fw-bold mb-1" style={{ color: '#0f172a' }}>Assigned Support Engineer</div>
            {hasRole(['ROLE_ADMIN', 'ROLE_SUPPORT_ENGINEER']) ? (
              <Form.Select
                size="sm"
                value={ticket.assignedTo?.id || ''}
                onChange={(e) => handleAssign(e.target.value)}
                className="form-select-dark py-1"
              >
                <option value="">Unassigned</option>
                {engineers.map((eng) => (
                  <option key={eng.id} value={eng.id}>{eng.firstName} {eng.lastName}</option>
                ))}
              </Form.Select>
            ) : (
              <div style={{ color: '#334155' }}>{ticket.assignedTo ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}` : 'Unassigned'}</div>
            )}
          </Col>

          <Col md={3} sm={6}>
            <div className="fw-bold mb-1" style={{ color: '#0f172a' }}>Category</div>
            <div className="d-flex align-items-center gap-1" style={{ color: '#334155' }}>
              <Tag size={14} className="text-indigo-600" /> {ticket.category?.name || 'Uncategorized'}
            </div>
          </Col>

          <Col md={3} sm={6}>
            <div className="fw-bold mb-1" style={{ color: '#0f172a' }}>Created Date</div>
            <div className="d-flex align-items-center gap-1" style={{ color: '#334155' }}>
              <Clock size={14} className="text-indigo-600" /> {new Date(ticket.createdAt).toLocaleString()}
            </div>
          </Col>
        </Row>
      </Card>

      {/* Description Section */}
      <Card className="glass-card p-4 mb-4" style={{ background: '#ffffff' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#0f172a' }}>Problem Description</h5>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.65, color: '#1e293b', fontWeight: '500', fontSize: '0.975rem' }}>
          {ticket.description}
        </div>
      </Card>

      {/* Attachments Section */}
      <AttachmentUploader ticketId={ticket.id} />

      {/* Comments Section */}
      <CommentSection ticketId={ticket.id} />

      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered className="modal-dark">
        <Modal.Header closeButton className="bg-white text-dark border-slate-200">
          <Modal.Title className="fw-bold" style={{ color: '#0f172a' }}>Confirm Status Transition to {targetStatus}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white text-dark">
          {statusError && <Alert variant="danger">{statusError}</Alert>}
          <Form.Group>
            <Form.Label className="form-label">Status Change Reason / Note (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="e.g. Issue resolved after network configuration update..."
              value={statusComment}
              onChange={(e) => setStatusComment(e.target.value)}
              className="form-control-dark"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="bg-white border-slate-200">
          <Button variant="outline-secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button className="btn-indigo" onClick={handleStatusUpdate}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
