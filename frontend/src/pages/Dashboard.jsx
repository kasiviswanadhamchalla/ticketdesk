import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../api/dashboardApi';
import { ticketApi } from '../api/ticketApi';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Ticket, CheckCircle2, Clock, AlertCircle, PlusCircle, ArrowRight, Shield } from 'lucide-react';

const CHART_COLORS = ['#38bdf8', '#f59e0b', '#10b981', '#94a3b8', '#ef4444'];

export const Dashboard = () => {
  useDocumentTitle('Support Dashboard');
  const { user } = useAuth();
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

  if (loading) return <LoadingSpinner text="Loading your dashboard..." />;

  const statusChartData = stats?.statusDistribution
    ? Object.entries(stats.statusDistribution).map(([name, value]) => ({ name: name.replace('_', ' '), value }))
    : [];

  const priorityChartData = stats?.priorityDistribution
    ? Object.entries(stats.priorityDistribution).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="p-3 p-md-4 max-w-7xl mx-auto">
      {/* Personalized Welcome Banner */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 p-4 rounded-4" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h2 className="fw-bold text-dark mb-0 fs-3">Welcome back, {user?.firstName || 'Team Member'} 👋</h2>
            <span className="badge bg-indigo-50 text-indigo-700 border border-indigo-200" style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe', padding: '0.3em 0.7em', borderRadius: 9999, fontSize: '0.75rem' }}>
              {user?.role?.replace('ROLE_', '') || 'EMPLOYEE'}
            </span>
          </div>
          <p className="small mb-0" style={{ color: '#64748b' }}>Here is your real-time IT ticket activity, SLA countdowns, and resolution stats.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Link to="/tickets/create" className="btn btn-indigo d-inline-flex align-items-center justify-content-center gap-2">
            <PlusCircle size={16} /> New Support Ticket
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <Row className="g-3 mb-4">
        <Col lg={3} sm={6}>
          <Card className="glass-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-uppercase fw-semibold d-block mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.05em', color: '#64748b' }}>TOTAL TICKETS</span>
                <span className="fs-2 fw-bold text-dark">{stats?.totalTickets || 0}</span>
              </div>
              <div className="p-2.5 rounded-3" style={{ background: '#eef2ff', color: '#4f46e5' }}>
                <Ticket size={22} />
              </div>
            </div>
          </Card>
        </Col>

        <Col lg={3} sm={6}>
          <Card className="glass-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-uppercase fw-semibold d-block mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.05em', color: '#64748b' }}>OPEN TICKETS</span>
                <span className="fs-2 fw-bold" style={{ color: '#0284c7' }}>{stats?.openTickets || 0}</span>
              </div>
              <div className="p-2.5 rounded-3" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                <AlertCircle size={22} />
              </div>
            </div>
          </Card>
        </Col>

        <Col lg={3} sm={6}>
          <Card className="glass-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-uppercase fw-semibold d-block mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.05em', color: '#64748b' }}>IN PROGRESS</span>
                <span className="fs-2 fw-bold" style={{ color: '#b45309' }}>{stats?.inProgressTickets || 0}</span>
              </div>
              <div className="p-2.5 rounded-3" style={{ background: '#fef3c7', color: '#b45309' }}>
                <Clock size={22} />
              </div>
            </div>
          </Card>
        </Col>

        <Col lg={3} sm={6}>
          <Card className="glass-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-uppercase fw-semibold d-block mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.05em', color: '#64748b' }}>RESOLVED / CLOSED</span>
                <span className="fs-2 fw-bold" style={{ color: '#047857' }}>
                  {(stats?.resolvedTickets || 0) + (stats?.closedTickets || 0)}
                </span>
              </div>
              <div className="p-2.5 rounded-3" style={{ background: '#d1fae5', color: '#047857' }}>
                <CheckCircle2 size={22} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Analytics Charts Row */}
      <Row className="g-3 mb-4">
        <Col lg={6}>
          <Card className="glass-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-dark fw-bold mb-0 fs-6">Ticket Status Breakdown</h5>
              <span className="badge bg-light text-slate-600 border" style={{ fontSize: '0.75rem' }}>Live Stats</span>
            </div>
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#ffffff', borderColor: '#e2e8f0', borderRadius: 8, color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Legend wrapperStyle={{ color: '#475569', fontSize: '13px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="glass-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-dark fw-bold mb-0 fs-6">Priority Distribution (SLA Volume)</h5>
              <span className="badge bg-light text-slate-600 border" style={{ fontSize: '0.75rem' }}>Priority Metrics</span>
            </div>
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer>
                <BarChart data={priorityChartData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#ffffff', borderColor: '#e2e8f0', borderRadius: 8, color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Tickets Table */}
      <Card className="glass-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="text-dark fw-bold mb-1 fs-6">Recent Tickets</h5>
            <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Latest ticket records accessible to your user role</p>
          </div>
          <Link to="/tickets" className="d-inline-flex align-items-center gap-1 text-decoration-none small fw-semibold" style={{ color: '#4f46e5' }}>
            View All Tickets <ArrowRight size={14} />
          </Link>
        </div>

        <Table responsive className="table-custom mb-0">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Category</th>
              <th>Created Date</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {recentTickets.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-muted small">
                  No tickets recorded yet.
                </td>
              </tr>
            ) : (
              recentTickets.map((t) => (
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
                  <td className="text-muted" style={{ fontSize: '0.825rem' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="text-end">
                    <Link to={`/tickets/${t.id}`} className="btn btn-outline-indigo btn-sm py-1 px-2.5">
                      View
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

export default Dashboard;
