import React, { useState, useEffect } from 'react';
import { Row, Col, Form, InputGroup, Pagination, Card } from 'react-bootstrap';
import { ticketApi } from '../api/ticketApi';
import { categoryApi } from '../api/categoryApi';
import { priorityApi } from '../api/priorityApi';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { TicketCard } from '../components/TicketCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Search, RefreshCw } from 'lucide-react';

export const TicketList = () => {
  useDocumentTitle('Ticket Directory');
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination State
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priorityId, setPriorityId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 8,
        sortBy: 'createdAt',
        sortDir: 'DESC',
      };
      if (search) params.search = search;
      if (status) params.status = status;
      if (priorityId) params.priorityId = priorityId;
      if (categoryId) params.categoryId = categoryId;

      const res = await ticketApi.getTickets(params);
      if (res.success && res.data) {
        setTickets(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (e) {
      console.error('Failed to fetch tickets', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, prioRes] = await Promise.all([categoryApi.getAll(), priorityApi.getAll()]);
        if (catRes.success) setCategories(catRes.data || []);
        if (prioRes.success) setPriorities(prioRes.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [page, status, priorityId, categoryId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchTickets();
  };

  return (
    <div className="p-3 p-md-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Ticket Directory</h2>
          <p className="small mb-0" style={{ color: '#475569' }}>Search, filter, and manage support tickets</p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="glass-card p-3 mb-4">
        <Row className="g-2">
          <Col md={4}>
            <Form onSubmit={handleSearchSubmit}>
              <InputGroup>
                <InputGroup.Text className="bg-light border-secondary border-opacity-25 text-secondary">
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search title, description or TICK-ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control-dark"
                />
              </InputGroup>
            </Form>
          </Col>

          <Col md={2}>
            <Form.Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }} className="form-select-dark">
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
              <option value="REOPENED">Reopened</option>
            </Form.Select>
          </Col>

          <Col md={2}>
            <Form.Select value={priorityId} onChange={(e) => { setPriorityId(e.target.value); setPage(0); }} className="form-select-dark">
              <option value="">All Priorities</option>
              {priorities.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(0); }} className="form-select-dark">
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Form.Select>
          </Col>

          <Col md={1} className="d-flex align-items-center">
            <button
              onClick={() => { setSearch(''); setStatus(''); setPriorityId(''); setCategoryId(''); setPage(0); }}
              className="btn btn-outline-secondary w-100 p-2 d-flex align-items-center justify-content-center"
              title="Reset Filters"
            >
              <RefreshCw size={18} />
            </button>
          </Col>
        </Row>
      </Card>

      {/* Ticket Cards Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching tickets..." />
      ) : tickets.length === 0 ? (
        <Card className="glass-card p-5 text-center text-muted">
          No tickets found matching your query criteria.
        </Card>
      ) : (
        <Row className="g-3">
          {tickets.map((ticket) => (
            <Col md={6} key={ticket.id}>
              <TicketCard ticket={ticket} />
            </Col>
          ))}
        </Row>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination className="pagination-dark">
            <Pagination.Prev onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} />
          </Pagination>
        </div>
      )}
    </div>
  );
};
