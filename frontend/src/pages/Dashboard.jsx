import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/dashboardApi';
import { ticketApi } from '../api/ticketApi';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Ticket, CheckCircle2, Clock, AlertCircle, PlusCircle, ArrowRight } from 'lucide-react';

const COLORS = ['#38bdf8', '#fbbf24', '#34d399', '#cbd5e1', '#f87171'];

export const Dashboard = () => {
  useDocumentTitle('Support Dashboard');
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
          <h2 className="fw-bold text-white mb-1">Support Operational Dashboard</h2>
          <p className="text-slate-300 small mb-0" style={{ color: '#cbd5e1' }}>Real-time IT ticket analytics, SLA tracking, and resolution metrics</p>
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
                <span className="small fw-bold d-block mb-1" style={{ color: '#94a3b8' }}>TOTAL TICKETS</span>
                <span className="fs-2 fw-extrabold text-white">{stats?.totalTickets || 0}</span>
              </div>
              <div className="p-3 rounded-4" style={{ background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                <Ticket size={28} style={{ color: '#818cf8' }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="glass-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="small fw-bold d-block mb-1" style={{ color: '#94a3b8' }}>OPEN TICKETS</span>
                <span className="fs-2 fw-extrabold" style={{ color: '#38bdf8' }}>{stats?.openTickets || 0}</span>
              </div>
              <div className="p-3 rounded-4" style={{ background: 'rgba(56, 189, 248, 0.2)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <AlertCircle size={28} style={{ color: '#38bdf8' }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="glass-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="small fw-bold d-block mb-1" style={{ color: '#94a3b8' }}>IN PROGRESS</span>
                <span className="fs-2 fw-extrabold" style={{ color: '#fbbf24' }}>{stats?.inProgressTickets || 0}</span>
              </div>
              <div className="p-3 rounded-4" style={{ background: 'rgba(251, 191, 36, 0.2)', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                <Clock size={28} style={{ color: '#fbbf24' }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="glass-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="small fw-bold d-block mb-1" style={{ color: '#94a3b8' }}>RESOLVED / CLOSED</span>
                <span className="fs-2 fw-extrabold" style={{ color: '#34d399' }}>
                  {(stats?.resolvedTickets || 0) + (stats?.closedTickets || 0)}
                </span>
              </div>
              <div className="p-3 rounded-4" style={{ background: 'rgba(52, 211, 153, 0.2)', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                <CheckCircle2 size={28} style={{ color: '#34d399' }} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Analytics Charts Row */}
      <Row className="g-3 mb-4">
        <Col md={6}>
          <Card className="glass-card p-4 h-100">
            <Card.Title className="text-white fw-bold fs-5 mb-3">Ticket Status Breakdown</Card.Title>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#475569', borderRadius: 12, color: '#fff' }} />
                  <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="glass-card p-4 h-100">
            <Card.Title className="text-white fw-bold fs-5 mb-3">Priority Distribution (SLA Target)</Card.Title>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={priorityChartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#475569', borderRadius: 12, color: '#fff' }} />
                  <Bar dataKey="value" fill="#c084fc" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Tickets Table */}
      <Card className="glass-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-white fw-bold mb-0">Recent Support Requests</h5>
          <Link to="/tickets" className="d-flex align-items-center gap-1 text-decoration-none small fw-bold" style={{ color: '#c084fc' }}>
            View All Tickets <ArrowRight size={14} />
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
                  No tickets recorded yet.
                </td>
              </tr>
            ) : (
              recentTickets.map((t) => (
                <tr key={t.id}>
                  <td className="fw-mono text-muted">{t.ticketNumber}</td>
                  <td className="fw-semibold text-white">{t.title}</td>
                  <td>
                    <span className={`badge badge-status-${t.status.toLowerCase()}`}>
                      {t.status.replace('_', ' ')}
                    </span>
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
