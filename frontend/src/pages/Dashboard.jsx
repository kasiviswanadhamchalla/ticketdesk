import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/dashboardApi';
import { ticketApi } from '../api/ticketApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Ticket, CheckCircle2, Clock, AlertCircle, PlusCircle, ArrowRight } from 'lucide-react';

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#6B7280', '#EF4444'];

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ticketsRes] = await Promise.all([
          dashboardApi.getStats(),
          ticketApi.getTickets({ page: 0, size: 5, sortBy: 'createdAt', sortDir: 'DESC' }),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (ticketsRes.success && ticketsRes.data) setRecentTickets(ticketsRes.data.content || []);
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard metrics..." />;

  const statusChartData = stats?.statusDistribution
    ? Object.entries(stats.statusDistribution).map(([name, value]) => ({ name, value }))
    : [];

  const priorityChartData = stats?.priorityDistribution
    ? Object.entries(stats.priorityDistribution).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="p-3 p-md-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-light mb-1">Support Dashboard</h2>
          <p className="text-muted small">Real-time IT ticket analytics and operational statistics</p>
        </div>
        <Link to="/tickets/create" className="btn btn-indigo d-flex align-items-center gap-2">
          <PlusCircle size={18} /> New Ticket
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <Row className="g-3 mb-4">
        <Col md={3} sm={6}>
          <Card className="glass-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold d-block">TOTAL TICKETS</span>
                <span className="fs-2 fw-extrabold text-light">{stats?.totalTickets || 0}</span>
              </div>
              <div className="p-3 rounded-3 bg-indigo-600 bg-opacity-20 text-indigo-400" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
                <Ticket size={24} style={{ color: '#818cf8' }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="glass-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold d-block">OPEN TICKETS</span>
                <span className="fs-2 fw-extrabold text-info">{stats?.openTickets || 0}</span>
              </div>
              <div className="p-3 rounded-3 bg-info bg-opacity-20 text-info">
                <AlertCircle size={24} />
              </div>
            </div>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="glass-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold d-block">IN PROGRESS</span>
                <span className="fs-2 fw-extrabold text-warning">{stats?.inProgressTickets || 0}</span>
              </div>
              <div className="p-3 rounded-3 bg-warning bg-opacity-20 text-warning">
                <Clock size={24} />
              </div>
            </div>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="glass-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold d-block">RESOLVED / CLOSED</span>
                <span className="fs-2 fw-extrabold text-success">
                  {(stats?.resolvedTickets || 0) + (stats?.closedTickets || 0)}
                </span>
              </div>
              <div className="p-3 rounded-3 bg-success bg-opacity-20 text-success">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Analytics Charts Row */}
      <Row className="g-3 mb-4">
        <Col md={6}>
          <Card className="glass-card p-3 h-100">
            <Card.Title className="text-light fw-semibold fs-6 mb-3">Ticket Status Distribution</Card.Title>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', borderColor: '#475569', borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="glass-card p-3 h-100">
            <Card.Title className="text-light fw-semibold fs-6 mb-3">Priority Distribution</Card.Title>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={priorityChartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#1e293b', borderColor: '#475569', borderRadius: 8 }} />
                  <Bar dataKey="value" fill="#818cf8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Tickets Table */}
      <Card className="glass-card p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-light fw-semibold mb-0">Recent Support Tickets</h5>
          <Link to="/tickets" className="text-indigo-400 d-flex align-items-center gap-1 text-decoration-none small fw-semibold">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <Table responsive className="table-custom mb-0">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Category</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recentTickets.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-muted">
                  No tickets found.
                </td>
              </tr>
            ) : (
              recentTickets.map((t) => (
                <tr key={t.id}>
                  <td className="fw-mono text-muted">{t.ticketNumber}</td>
                  <td className="fw-medium text-light">{t.title}</td>
                  <td>
                    <Badge bg={t.status === 'OPEN' ? 'primary' : t.status === 'IN_PROGRESS' ? 'warning' : 'success'}>
                      {t.status}
                    </Badge>
                  </td>
                  <td>{t.priority?.name || 'N/A'}</td>
                  <td>{t.category?.name || 'N/A'}</td>
                  <td className="text-muted">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/tickets/${t.id}`} className="btn btn-outline-indigo btn-sm">
                      Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};
