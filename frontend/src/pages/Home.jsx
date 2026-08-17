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
  Cloud,
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';

export const Home = () => {
  useDocumentTitle('IT Support Portal | TicketDesk');
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
      {/* Hero Section */}
      <section className="py-5" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)', borderBottom: '1px solid #e2e8f0' }}>
        <Container className="py-4 text-center max-w-4xl mx-auto">
          <div className="mb-3">
            <span className="d-inline-flex align-items-center gap-1.5 px-3 py-1 rounded-pill small fw-semibold" style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }}>
              <Sparkles size={14} /> Enterprise IT Incident Desk
            </span>
          </div>

          <h1 className="fw-extrabold mb-3 text-dark" style={{ fontSize: '2.75rem', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
            IT Support & Ticket Tracking Made Simple
          </h1>

          <p className="fs-5 mb-4 text-muted mx-auto" style={{ maxWidth: '640px', lineHeight: 1.6 }}>
            Streamline employee support requests, track SLA targets in real-time, and securely manage attachments with role-based access.
          </p>

          <div className="d-flex justify-content-center gap-3 mb-5">
            <Button onClick={handleLaunchClick} className="btn-indigo btn-lg px-4 py-2.5 d-inline-flex align-items-center gap-2">
              <Zap size={18} /> {user ? 'Go to Dashboard' : 'Get Started Now'} <ArrowRight size={18} />
            </Button>
            {!user && (
              <Button onClick={() => setShowLoginModal(true)} variant="outline-indigo" className="btn-lg px-4 py-2.5">
                Sign In
              </Button>
            )}
          </div>

          {/* Quick Stats Banner */}
          <Row className="g-3 max-w-3xl mx-auto pt-4 border-top border-light">
            <Col sm={4}>
              <div className="d-flex align-items-center justify-content-center gap-2 text-dark small fw-semibold">
                <CheckCircle2 size={16} className="text-emerald-600" style={{ color: '#059669' }} /> Role-Based Security
              </div>
            </Col>
            <Col sm={4}>
              <div className="d-flex align-items-center justify-content-center gap-2 text-dark small fw-semibold">
                <CheckCircle2 size={16} className="text-emerald-600" style={{ color: '#059669' }} /> AWS S3 Direct Uploads
              </div>
            </Col>
            <Col sm={4}>
              <div className="d-flex align-items-center justify-content-center gap-2 text-dark small fw-semibold">
                <CheckCircle2 size={16} className="text-emerald-600" style={{ color: '#059669' }} /> Real-Time SLA Tracking
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-5">
        <Container className="py-3">
          <Row className="g-4">
            <Col md={3} sm={6}>
              <Card className="glass-card p-4 h-100 border-0 shadow-sm text-center">
                <div className="p-3 rounded-circle mx-auto mb-3" style={{ background: '#eef2ff', color: '#4f46e5', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={24} />
                </div>
                <h6 className="fw-bold text-dark mb-1">Role Security</h6>
                <p className="small text-muted mb-0">Role-based controls for Admin, Support Engineers, and Employees.</p>
              </Card>
            </Col>

            <Col md={3} sm={6}>
              <Card className="glass-card p-4 h-100 border-0 shadow-sm text-center">
                <div className="p-3 rounded-circle mx-auto mb-3" style={{ background: '#f3e8ff', color: '#7c3aed', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cloud size={24} />
                </div>
                <h6 className="fw-bold text-dark mb-1">AWS S3 Attachments</h6>
                <p className="small text-muted mb-0">Pre-signed S3 bucket URLs for fast diagnostic file uploads.</p>
              </Card>
            </Col>

            <Col md={3} sm={6}>
              <Card className="glass-card p-4 h-100 border-0 shadow-sm text-center">
                <div className="p-3 rounded-circle mx-auto mb-3" style={{ background: '#ecfdf5', color: '#047857', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart3 size={24} />
                </div>
                <h6 className="fw-bold text-dark mb-1">SLA Analytics</h6>
                <p className="small text-muted mb-0">Live charts tracking incident status, SLA targets, and resolution.</p>
              </Card>
            </Col>

            <Col md={3} sm={6}>
              <Card className="glass-card p-4 h-100 border-0 shadow-sm text-center">
                <div className="p-3 rounded-circle mx-auto mb-3" style={{ background: '#fff7ed', color: '#ea580c', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={24} />
                </div>
                <h6 className="fw-bold text-dark mb-1">In-App Alerts</h6>
                <p className="small text-muted mb-0">Instant notification updates on ticket assignments and status changes.</p>
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
          <div>© 2026 TicketDesk IT Platform. Production Cloud Architecture.</div>
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
