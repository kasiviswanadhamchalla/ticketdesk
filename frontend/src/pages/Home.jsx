import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { LoginModal } from '../components/LoginModal';
import {
  Ticket,
  ShieldCheck,
  Zap,
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  Paperclip,
  Clock,
  MessageSquare,
  Sparkles,
  UserCheck,
  LifeBuoy
} from 'lucide-react';

export const Home = () => {
  useDocumentTitle('TicketDesk - Enterprise IT Support Portal');
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
    <div className="w-100" style={{ background: '#f8fafc' }}>
      {/* SECTION 1: HERO SECTION */}
      <section className="py-5" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)', borderBottom: '1px solid #e2e8f0' }}>
        <Container className="py-4 text-center max-w-4xl mx-auto">
          <div className="mb-3">
            <span className="d-inline-flex align-items-center gap-1.5 px-3 py-1 rounded-pill small fw-semibold" style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }}>
              <Sparkles size={14} /> Enterprise IT Support & Help Desk
            </span>
          </div>

          <h1 className="fw-extrabold mb-3 text-dark" style={{ fontSize: '2.8rem', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
            Resolve IT Issues Faster with TicketDesk
          </h1>

          <p className="fs-5 mb-4 text-muted mx-auto" style={{ maxWidth: '650px', lineHeight: 1.6 }}>
            The all-in-one IT support management platform where employees report issues, support teams track SLA targets, and resolution happens seamlessly.
          </p>

          <div className="d-flex justify-content-center gap-3 mb-5">
            <Button onClick={handleLaunchClick} className="btn-indigo btn-lg px-4 py-2.5 d-inline-flex align-items-center gap-2">
              <Zap size={18} /> {user ? 'Go to My Dashboard' : 'Open Support Portal'} <ArrowRight size={18} />
            </Button>
            {!user && (
              <Button onClick={() => setShowLoginModal(true)} variant="outline-indigo" className="btn-lg px-4 py-2.5">
                Sign In
              </Button>
            )}
          </div>

          {/* Core Highlights */}
          <Row className="g-3 max-w-3xl mx-auto pt-4 border-top border-light">
            <Col sm={4}>
              <div className="d-flex align-items-center justify-content-center gap-2 text-dark small fw-semibold">
                <CheckCircle2 size={16} className="text-emerald-600" style={{ color: '#059669' }} /> Instant Ticket Submission
              </div>
            </Col>
            <Col sm={4}>
              <div className="d-flex align-items-center justify-content-center gap-2 text-dark small fw-semibold">
                <CheckCircle2 size={16} className="text-emerald-600" style={{ color: '#059669' }} /> File & Screenshot Attachments
              </div>
            </Col>
            <Col sm={4}>
              <div className="d-flex align-items-center justify-content-center gap-2 text-dark small fw-semibold">
                <CheckCircle2 size={16} className="text-emerald-600" style={{ color: '#059669' }} /> Real-Time Status Updates
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* SECTION 2: HOW THE APPLICATION WORKS */}
      <section className="py-5 bg-white border-bottom border-light">
        <Container className="py-3">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <span className="text-uppercase fw-bold text-indigo-600 d-block mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', color: '#4f46e5' }}>HOW TICKETDESK WORKS</span>
            <h2 className="fw-extrabold text-dark mb-2 fs-3">Streamlined Support in 3 Simple Steps</h2>
            <p className="text-muted small">Designed for quick submission and transparent resolution.</p>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <Card className="glass-card p-4 h-100 border-0 shadow-sm">
                <div className="fw-bold text-indigo-600 mb-2 fs-3" style={{ color: '#4f46e5' }}>01</div>
                <h5 className="fw-bold text-dark mb-2 fs-6">Submit Your IT Request</h5>
                <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                  Employees create tickets for hardware, software, network, or account issues with subject, priority, and diagnostic file attachments.
                </p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="glass-card p-4 h-100 border-0 shadow-sm">
                <div className="fw-bold text-indigo-600 mb-2 fs-3" style={{ color: '#4f46e5' }}>02</div>
                <h5 className="fw-bold text-dark mb-2 fs-6">Engineer Assignment & SLA</h5>
                <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                  Tickets are assigned to specialized IT Support Engineers who track SLA resolution target countdowns (Urgent 2h, High 8h, Medium 24h).
                </p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="glass-card p-4 h-100 border-0 shadow-sm">
                <div className="fw-bold text-indigo-600 mb-2 fs-3" style={{ color: '#4f46e5' }}>03</div>
                <h5 className="fw-bold text-dark mb-2 fs-6">Resolution & Communication</h5>
                <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                  Chat directly with support engineers via comment threads, receive status notifications, and reopen tickets if additional assistance is needed.
                </p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* SECTION 3: PRODUCT FEATURES */}
      <section className="py-5">
        <Container className="py-3">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <span className="text-uppercase fw-bold text-indigo-600 d-block mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', color: '#4f46e5' }}>APPLICATION FEATURES</span>
            <h2 className="fw-extrabold text-dark mb-2 fs-3">Everything You Need for Enterprise Support</h2>
            <p className="text-muted small">Empowering employees, support engineers, and IT administrators.</p>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <Card className="glass-card p-4 h-100 border-0 shadow-sm">
                <div className="p-3 rounded-circle mb-3" style={{ background: '#eef2ff', color: '#4f46e5', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Paperclip size={24} />
                </div>
                <h6 className="fw-bold text-dark mb-2">Direct File Attachments</h6>
                <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                  Attach screenshots, error logs, PDFs, and diagnostic files directly to tickets for faster troubleshooting.
                </p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="glass-card p-4 h-100 border-0 shadow-sm">
                <div className="p-3 rounded-circle mb-3" style={{ background: '#f3e8ff', color: '#7c3aed', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={24} />
                </div>
                <h6 className="fw-bold text-dark mb-2">SLA Target Tracking</h6>
                <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                  Automated SLA countdown targets ensure critical IT incidents receive immediate response from support staff.
                </p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="glass-card p-4 h-100 border-0 shadow-sm">
                <div className="p-3 rounded-circle mb-3" style={{ background: '#ecfdf5', color: '#047857', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={24} />
                </div>
                <h6 className="fw-bold text-dark mb-2">Interactive Comment Threads</h6>
                <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                  Communicate in real-time with assigned engineers, share updates, and receive prompt resolution feedback.
                </p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="glass-card p-4 h-100 border-0 shadow-sm">
                <div className="p-3 rounded-circle mb-3" style={{ background: '#fff7ed', color: '#ea580c', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={24} />
                </div>
                <h6 className="fw-bold text-dark mb-2">Real-Time Notifications</h6>
                <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                  Get instant in-app alerts whenever your ticket status updates or an engineer posts a response.
                </p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="glass-card p-4 h-100 border-0 shadow-sm">
                <div className="p-3 rounded-circle mb-3" style={{ background: '#f0f9ff', color: '#0284c7', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart3 size={24} />
                </div>
                <h6 className="fw-bold text-dark mb-2">Operational Analytics</h6>
                <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                  Visual dashboards tracking ticket volume, status breakdown (Open, In Progress, Resolved), and SLA metrics.
                </p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="glass-card p-4 h-100 border-0 shadow-sm">
                <div className="p-3 rounded-circle mb-3" style={{ background: '#fdf2f8', color: '#db2777', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={24} />
                </div>
                <h6 className="fw-bold text-dark mb-2">Role Security & Privacy</h6>
                <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                  Employees see only their own tickets, while Support Engineers and IT Admins access ticket management tools.
                </p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-white border-top border-light py-4 text-center text-muted small">
        <Container>
          <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
            <Ticket size={18} className="text-indigo-600" style={{ color: '#4f46e5' }} />
            <span className="fw-bold text-dark">TicketDesk</span> — IT Support Portal
          </div>
          <div>© 2026 TicketDesk IT Platform. Enterprise Support System.</div>
        </Container>
      </footer>

      {/* Pop-up Login Modal */}
      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        onSwitchToRegister={() => navigate('/register')}
      />
    </div>
  );
};

export default Home;
