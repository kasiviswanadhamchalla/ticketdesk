import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { LoginModal } from '../components/LoginModal';
import { Ticket, ShieldCheck, Zap, Cloud, CheckCircle2, ArrowRight, BarChart3, Lock, Users } from 'lucide-react';

export const Home = () => {
  useDocumentTitle('IT Support Ticket Portal');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLaunchClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="py-4">
      {/* Hero Section */}
      <Container className="py-5">
        <Row className="align-items-center g-5 py-3">
          <Col lg={7}>
            <Badge bg="indigo" className="px-3 py-2 fs-6 mb-3 rounded-pill" style={{ background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#a855f7' }}>
              ⚡ Enterprise AWS Ready Platform
            </Badge>

            <h1 className="display-4 fw-extrabold text-white mb-3" style={{ letterSpacing: '-1.5px', lineHeight: 1.15 }}>
              Enterprise IT Support & Ticket Engine Built for Speed
            </h1>

            <p className="fs-5 text-slate-300 mb-4" style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
              Streamline IT support requests, automate SLA tracking, and manage tickets with pre-signed AWS S3 file uploads, real-time analytics, and role-based access control.
            </p>

            <div className="d-flex flex-wrap gap-3">
              <Button onClick={handleLaunchClick} className="btn-indigo btn-lg px-4 py-3 d-flex align-items-center gap-2">
                <LogInIcon /> Launch Support Portal <ArrowRight size={20} />
              </Button>

              <Button onClick={() => setShowLoginModal(true)} variant="outline-indigo" className="btn-lg px-4 py-3">
                Sign In to Account
              </Button>
            </div>
          </Col>

          {/* Hero Card Preview */}
          <Col lg={5}>
            <Card className="glass-card p-4 text-white shadow-2xl position-relative overflow-hidden">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <Ticket size={24} style={{ color: '#c084fc' }} />
                  <span className="fw-bold fs-5">TicketDesk Live</span>
                </div>
                <span className="badge badge-status-open">SYSTEM HEALTH 100%</span>
              </div>

              <div className="bg-dark bg-opacity-60 p-3 rounded-3 mb-3 border border-secondary border-opacity-25">
                <div className="d-flex justify-content-between text-muted small mb-1">
                  <span>TICK-1002 • VPN Connection Failure</span>
                  <span className="text-warning fw-bold">HIGH PRIORITY</span>
                </div>
                <div className="fw-semibold text-white">Status: IN_PROGRESS (SLA 8h Target)</div>
              </div>

              <Row className="g-2 text-center">
                <Col xs={4}>
                  <div className="p-2 rounded bg-dark bg-opacity-40 border border-secondary border-opacity-25">
                    <span className="fs-4 fw-extrabold text-info d-block">99.8%</span>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>SLA Compliance</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="p-2 rounded bg-dark bg-opacity-40 border border-secondary border-opacity-25">
                    <span className="fs-4 fw-extrabold text-success d-block">&lt; 2.4h</span>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>Avg Resolution</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="p-2 rounded bg-dark bg-opacity-40 border border-secondary border-opacity-25">
                    <span className="fs-4 fw-extrabold text-warning d-block">AWS S3</span>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>Pre-signed Uploads</small>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Feature Showcase Grid */}
      <Container className="py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-white mb-2 fs-2">Built for Modern Enterprise IT Operations</h2>
          <p className="text-slate-300" style={{ color: '#cbd5e1' }}>Designed with AWS Best Practices, OWASP Security, and Glassmorphism Aesthetics</p>
        </div>

        <Row className="g-4">
          <Col md={4}>
            <Card className="glass-card p-4 h-100">
              <div className="p-3 rounded-circle d-inline-flex mb-3" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
                <ShieldCheck size={28} />
              </div>
              <h5 className="fw-bold text-white mb-2">Role-Based Access Control</h5>
              <p className="text-slate-300 small mb-0" style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                Enforce granular security constraints for System Admins, Support Engineers, and Employees with Spring Security and JWT auth.
              </p>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="glass-card p-4 h-100">
              <div className="p-3 rounded-circle d-inline-flex mb-3" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>
                <Cloud size={28} />
              </div>
              <h5 className="fw-bold text-white mb-2">Pre-signed S3 Attachments</h5>
              <p className="text-slate-300 small mb-0" style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                Direct, zero-server-overhead file uploads to Amazon S3 using AWS SDK v2 pre-signed URLs for high performance.
              </p>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="glass-card p-4 h-100">
              <div className="p-3 rounded-circle d-inline-flex mb-3" style={{ background: 'rgba(52, 211, 153, 0.2)', color: '#34d399' }}>
                <BarChart3 size={28} />
              </div>
              <h5 className="fw-bold text-white mb-2">Real-time Analytics & SLA</h5>
              <p className="text-slate-300 small mb-0" style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                Monitor ticket volume, status breakdown, and priority distributions with interactive Recharts charts.
              </p>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Pop-up Login Modal */}
      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        onSwitchToRegister={() => navigate('/register')}
      />
    </div>
  );
};

const LogInIcon = () => <Zap size={18} />;
