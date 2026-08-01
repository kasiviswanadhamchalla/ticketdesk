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
    return (
      <Badge
        style={{
          backgroundColor: `${priority.colorCode}25`,
          color: priority.colorCode,
          border: `1px solid ${priority.colorCode}60`,
        }}
        className="px-2 py-1"
      >
        {priority.name}
      </Badge>
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

        <Card.Title as={Link} to={`/tickets/${ticket.id}`} className="text-decoration-none text-light fw-bold fs-5 mb-2 d-block hover-underline">
          {ticket.title}
        </Card.Title>

        <Card.Text className="text-muted small text-truncate-2 mb-3" style={{ maxHeight: '2.8rem', overflow: 'hidden' }}>
          {ticket.description}
        </Card.Text>

        <div className="d-flex flex-wrap align-items-center justify-content-between pt-2 border-top border-secondary border-opacity-25 small text-muted">
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

          <Link to={`/tickets/${ticket.id}`} className="text-indigo-400 d-flex align-items-center gap-1 text-decoration-none fw-semibold">
            View Details <ArrowRight size={14} />
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};
