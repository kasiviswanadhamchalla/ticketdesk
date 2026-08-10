import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Clock, User, Tag, ArrowRight } from 'lucide-react';

export const TicketCard = ({ ticket }) => {
  const getStatusBadge = (status) => {
    const statusClass = `badge-status-${status.toLowerCase()}`;
    return <span className={`badge ${statusClass}`}>{status.replace('_', ' ')}</span>;
  };

  const getPriorityBadge = (priority) => {
    if (!priority) return null;
    const prioKey = priority.name.toLowerCase();
    const prioClass = `badge-prio-${prioKey}`;
    return (
      <span className={`badge ${prioClass}`}>
        {priority.name}
      </span>
    );
  };

  return (
    <Card className="glass-card glass-card-interactive mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <span className="text-muted fw-mono me-2" style={{ fontSize: '0.85rem' }}>{ticket.ticketNumber}</span>
            {getStatusBadge(ticket.status)}
          </div>
          {getPriorityBadge(ticket.priority)}
        </div>

        <Card.Title as={Link} to={`/tickets/${ticket.id}`} className="text-decoration-none text-dark fw-bold fs-5 mb-2 d-block hover-underline">
          {ticket.title}
        </Card.Title>

        <Card.Text className="small text-truncate-2 mb-3" style={{ maxHeight: '2.8rem', overflow: 'hidden', color: '#475569' }}>
          {ticket.description}
        </Card.Text>

        <div className="d-flex flex-wrap align-items-center justify-content-between pt-2 border-top border-slate-200 small" style={{ color: '#475569' }}>
          <div className="d-flex align-items-center gap-3">
            <span className="d-flex align-items-center gap-1">
              <User size={14} /> {ticket.createdBy?.firstName} {ticket.createdBy?.lastName}
            </span>
            {ticket.category && (
              <span className="d-flex align-items-center gap-1">
                <Tag size={14} /> {ticket.category.name}
              </span>
            )}
            <span className="d-flex align-items-center gap-1">
              <Clock size={14} /> {new Date(ticket.createdAt).toLocaleDateString()}
            </span>
          </div>

          <Link to={`/tickets/${ticket.id}`} className="d-flex align-items-center gap-1 text-decoration-none fw-semibold" style={{ color: '#4f46e5' }}>
            View Details <ArrowRight size={14} />
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};
