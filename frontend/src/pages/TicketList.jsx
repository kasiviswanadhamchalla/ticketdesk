import React, { useState, useEffect } from 'react';
import { Row, Col, Form, InputGroup, Pagination, Card, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ticketApi } from '../api/ticketApi';
import { categoryApi } from '../api/categoryApi';
import { priorityApi } from '../api/priorityApi';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { TicketCard } from '../components/TicketCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Search, RefreshCw, PlusCircle, LayoutGrid, List } from 'lucide-react';

export const TicketList = () => {
  useDocumentTitle('Ticket Directory');
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

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
    <div className="p-3 p-md-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1 fs-3">Ticket Directory</h2>
          <p className="small mb-0" style={{ color: '#64748b' }}>Search, filter, and manage organizational support requests</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="btn-group border rounded-3 p-0.5 bg-white">
            <Button
              variant={viewMode === 'table' ? 'light' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className={`py-1 px-2.5 ${viewMode === 'table' ? 'fw-semibold shadow-sm border' : 'text-muted'}`}
            >
              <List size={16} />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'light' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`py-1 px-2.5 ${viewMode === 'grid' ? 'fw-semibold shadow-sm border' : 'text-muted'}`}
            >
              <LayoutGrid size={16} />
            </Button>
          </div>

          <Link to="/tickets/create" className="btn btn-indigo d-inline-flex align-items-center gap-2">
            <PlusCircle size={16} /> Create Ticket
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="glass-card p-3 mb-4">
        <Row className="g-2">
          <Col lg={4} md={6}>
            <Form onSubmit={handleSearchSubmit}>
              <InputGroup>
                <InputGroup.Text className="bg-light border-light text-muted">
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search subject or TICK-ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control-dark"
                />
              </InputGroup>
            </Form>
          </Col>

          <Col lg={2} md={6}>
            <Form.Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }} className="form-select-dark">
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
              <option value="REOPENED">Reopened</option>
            </Form.Select>
          </Col>

          <Col lg={2} md={6}>
            <Form.Select value={priorityId} onChange={(e) => { setPriorityId(e.target.value); setPage(0); }} className="form-select-dark">
              <option value="">All Priorities</option>
              {priorities.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Form.Select>
          </Col>

          <Col lg={3} md={6}>
            <Form.Select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(0); }} className="form-select-dark">
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Form.Select>
          </Col>

          <Col lg={1} md={12} className="d-flex align-items-center">
            <Button
              variant="outline-secondary"
              onClick={() => { setSearch(''); setStatus(''); setPriorityId(''); setCategoryId(''); setPage(0); }}
              className="w-100 p-2 d-flex align-items-center justify-content-center border-light text-muted"
              title="Reset Filters"
            >
              <RefreshCw size={16} />
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Content Container */}
      {loading ? (
        <LoadingSpinner text="Fetching tickets..." />
      ) : tickets.length === 0 ? (
        <Card className="glass-card p-5 text-center text-muted">
          No tickets found matching your query criteria.
        </Card>
      ) : viewMode === 'grid' ? (
        <Row className="g-3">
          {tickets.map((ticket) => (
            <Col lg={6} key={ticket.id}>
              <TicketCard ticket={ticket} />
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="glass-card p-0 overflow-hidden">
          <Table responsive className="table-custom mb-0">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Category</th>
                <th>Created By</th>
                <th>Created Date</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td className="fw-mono text-muted" style={{ fontSize: '0.8rem' }}>{t.ticketNumber}</td>
                  <td className="fw-semibold text-dark">{t.title}</td>
                  <td>
                    <span className={`badge badge-status-${t.status.toLowerCase()}`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-prio-${t.priority?.name?.toLowerCase() || 'low'}`}>
                      {t.priority?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="text-slate-600">{t.category?.name || 'N/A'}</td>
                  <td className="text-slate-700">{t.createdBy ? `${t.createdBy.firstName} ${t.createdBy.lastName}` : 'N/A'}</td>
                  <td className="text-muted" style={{ fontSize: '0.825rem' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="text-end">
                    <Link to={`/tickets/${t.id}`} className="btn btn-outline-indigo btn-sm py-1 px-2.5">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
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

export default TicketList;
