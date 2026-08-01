import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { LoginModal } from '../components/LoginModal';
import {
  Ticket,
  ShieldCheck,
  Zap,
  Cloud,
  ArrowRight,
  BarChart3,
  Bell,
  FileCode,
  Server,
  Clock,
  CheckCircle2,
} from 'lucide-react';

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
    <div className="py-4 mt-3">
      {/* Hero Section with Extra Top Spacing to Prevent Navbar Overlap */}
      <Container className="pt-4 pb-5">
        <Row className="align-items-center g-5">
          <Col lg={7}>
            <div className="mb-3">
              <Badge
                className="px-3 py-2 fs-6 rounded-pill fw-bold"
                style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }}
              >
                ⚡ Enterprise AWS Ready Platform
              </Badge>
            </div>

            <h1
              className="fw-extrabold mb-3"
              style={{ color: '#0f172a', letterSpacing: '-1.5px', lineHeight: 1.18, fontSize: '2.75rem' }}
            >
              Enterprise IT Support & Ticket Engine Built for Speed
            </h1>

            <p className="fs-5 mb-4" style={{ color: '#334155', lineHeight: 1.65 }}>
              Streamline IT support requests, automate SLA tracking, and manage tickets with pre-signed AWS S3 file uploads, real-time analytics, and role-based access control.
            </p>

            <div className="d-flex flex-wrap align-items-center gap-3 pt-2">
              <Button onClick={handleLaunchClick} className="btn-indigo btn-lg px-4 py-3 d-flex align-items-center gap-2">
                <Zap size={20} /> Launch Support Portal <ArrowRight size={20} />
              </Button>

              <Button onClick={() => setShowLoginModal(true)} variant="outline-indigo" className="btn-lg px-4 py-3">
                Sign In to Account
              </Button>
            </div>
          </Col>

          {/* Hero Live Widget Card */}
          <Col lg={5}>
            <Card className="glass-card p-4 shadow-lg border-0" style={{ background: '#ffffff' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 rounded-circle" style={{ background: '#eef2ff' }}>
                    <Ticket size={24} style={{ color: '#4f46e5' }} />
                  </div>
                  <span className="fw-bold fs-5" style={{ color: '#0f172a' }}>TicketDesk Live</span>
                </div>
                <span className="badge badge-status-open">SYSTEM HEALTH 100%</span>
              </div>

              <div className="p-3 rounded-3 mb-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className="d-flex justify-content-between align-items-center small mb-2" style={{ color: '#64748b' }}>
                  <span className="fw-bold">TICK-1002 • VPN Connection Failure</span>
                  <span className="badge bg-warning text-dark fw-bold">HIGH PRIORITY</span>
                </div>
                <div className="fw-bold fs-6" style={{ color: '#0f172a' }}>
                  Status: IN_PROGRESS <span className="text-muted fs-7">(SLA 8h Target)</span>
                </div>
              </div>

              <Row className="g-2 text-center">
                <Col xs={4}>
                  <div className="p-3 rounded-3" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                    <span className="fs-4 fw-extrabold d-block" style={{ color: '#0284c7' }}>99.8%</span>
                    <small className="fw-bold" style={{ color: '#0369a1', fontSize: '0.75rem' }}>SLA Compliance</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="p-3 rounded-3" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                    <span className="fs-4 fw-extrabold d-block" style={{ color: '#059669' }}>&lt; 2.4h</span>
                    <small className="fw-bold" style={{ color: '#047857', fontSize: '0.75rem' }}>Avg Resolution</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="p-3 rounded-3" style={{ background: '#fef3c7', border: '1px solid #fde68a' }}>
                    <span className="fs-4 fw-extrabold d-block" style={{ color: '#d97706' }}>AWS S3</span>
                    <small className="fw-bold" style={{ color: '#b45309', fontSize: '0.75rem' }}>Pre-signed Uploads</small>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Feature Showcase Grid - 6 Complete Enterprise Cards */}
      <Container className="py-5">
        <div className="text-center max-w-3xl mx-auto mb-5">
          <h2 className="fw-extrabold mb-2" style={{ color: '#0f172a', fontSize: '2.2rem' }}>
            Built for Modern Enterprise IT Operations
          </h2>
          <p className="fs-6" style={{ color: '#475569' }}>
            Designed with AWS Best Practices, OWASP Security, and Clean Modern UI Standards
          </p>
        </div>

        <Row className="g-4">
          {/* Card 1 */}
          <Col md={4}>
            <Card className="glass-card p-4 h-100 border-0 shadow-sm" style={{ background: '#ffffff' }}>
              <div className="p-3 rounded-3 d-inline-flex mb-3" style={{ background: '#eef2ff', color: '#4f46e5', width: 'fit-content' }}>
                <ShieldCheck size={28} />
              </div>
              <h5 className="fw-bold mb-2" style={{ color: '#0f172a' }}>Role-Based Access Control</h5>
              <p className="small mb-0" style={{ color: '#334155', lineHeight: 1.65 }}>
                Enforce strict security boundaries across System Administrators, Support Engineers, and Employees powered by Spring Security 6 and stateless JWT token authentication.
              </p>
            </Card>
          </Col>

          {/* Card 2 */}
          <Col md={4}>
            <Card className="glass-card p-4 h-100 border-0 shadow-sm" style={{ background: '#ffffff' }}>
              <div className="p-3 rounded-3 d-inline-flex mb-3" style={{ background: '#f3e8ff', color: '#7c3aed', width: 'fit-content' }}>
                <Cloud size={28} />
              </div>
              <h5 className="fw-bold mb-2" style={{ color: '#0f172a' }}>Pre-signed S3 Attachments</h5>
              <p className="small mb-0" style={{ color: '#334155', lineHeight: 1.65 }}>
                Upload screenshots, log files, and diagnostic documents directly to Amazon S3 via AWS SDK v2 pre-signed URLs with zero server bottleneck or memory overhead.
              </p>
            </Card>
          </Col>

          {/* Card 3 */}
          <Col md={4}>
            <Card className="glass-card p-4 h-100 border-0 shadow-sm" style={{ background: '#ffffff' }}>
              <div className="p-3 rounded-3 d-inline-flex mb-3" style={{ background: '#ecfdf5', color: '#059669', width: 'fit-content' }}>
                <BarChart3 size={28} />
              </div>
              <h5 className="fw-bold mb-2" style={{ color: '#0f172a' }}>Real-Time Analytics & SLA</h5>
              <p className="small mb-0" style={{ color: '#334155', lineHeight: 1.65 }}>
                Track ticket status lifecycle, priority distributions, and resolution targets with interactive Recharts graphics and automated SLA target warnings.
              </p>
            </Card>
          </Col>

          {/* Card 4 */}
          <Col md={4}>
            <Card className="glass-card p-4 h-100 border-0 shadow-sm" style={{ background: '#ffffff' }}>
              <div className="p-3 rounded-3 d-inline-flex mb-3" style={{ background: '#fff7ed', color: '#ea580c', width: 'fit-content' }}>
                <Bell size={28} />
              </div>
              <h5 className="fw-bold mb-2" style={{ color: '#0f172a' }}>Automated Notifications</h5>
              <p className="small mb-0" style={{ color: '#334155', lineHeight: 1.65 }}>
                Stay informed with real-time in-app notification alerts, assignment updates, internal support notes, and status transition events for every ticket.
              </p>
            </Card>
          </Col>

          {/* Card 5 */}
          <Col md={4}>
            <Card className="glass-card p-4 h-100 border-0 shadow-sm" style={{ background: '#ffffff' }}>
              <div className="p-3 rounded-3 d-inline-flex mb-3" style={{ background: '#f0f9ff', color: '#0284c7', width: 'fit-content' }}>
                <FileCode size={28} />
              </div>
              <h5 className="fw-bold mb-2" style={{ color: '#0f172a' }}>OpenAPI 3.0 & Swagger</h5>
              <p className="small mb-0" style={{ color: '#334155', lineHeight: 1.65 }}>
                Full interactive REST API documentation with Swagger UI, input validation schemas, and standardized exception handling across all endpoints.
              </p>
            </Card>
          </Col>

          {/* Card 6 */}
          <Col md={4}>
            <Card className="glass-card p-4 h-100 border-0 shadow-sm" style={{ background: '#ffffff' }}>
              <div className="p-3 rounded-3 d-inline-flex mb-3" style={{ background: '#fdf2f8', color: '#db2777', width: 'fit-content' }}>
                <Server size={28} />
              </div>
              <h5 className="fw-bold mb-2" style={{ color: '#0f172a' }}>AWS Infrastructure as Code</h5>
              <p className="small mb-0" style={{ color: '#334155', lineHeight: 1.65 }}>
                Production-ready deployment via Terraform IaC modules on Amazon ECS Fargate, ALB, Multi-AZ RDS PostgreSQL, CloudFront, and Secrets Manager.
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
