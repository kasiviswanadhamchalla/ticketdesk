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
  CheckCircle2,
  Lock,
  Cpu,
  Layers,
  Sparkles,
  Paperclip,
  Activity,
  UserCheck
} from 'lucide-react';

export const Home = () => {
  useDocumentTitle('Enterprise IT Support Portal | TicketDesk');
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
    <div className="w-100 overflow-hidden" style={{ background: '#f8fafc' }}>
      {/* SECTION 1: HERO SECTION (Dark Premium Background with Radial Glow) */}
      <section style={{ background: 'linear-gradient(180deg, #090d16 0%, #0f172a 60%, #1e1b4b 100%)', position: 'relative' }} className="py-5 text-white">
        <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '500px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(124, 58, 237, 0) 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <Container className="position-relative py-4 py-lg-5" style={{ zIndex: 1 }}>
          <Row className="align-items-center g-5">
            {/* Left Hero Column */}
            <Col lg={6}>
              <div className="mb-3">
                <span className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill fw-semibold small" style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818cf8' }}>
                  <Sparkles size={14} /> Production AWS ECS Infrastructure
                </span>
              </div>

              <h1 className="fw-extrabold mb-3 text-white" style={{ fontSize: '3rem', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                Enterprise IT Support Engine Built for Speed
              </h1>

              <p className="fs-5 mb-4 text-slate-300" style={{ color: '#cbd5e1', lineHeight: 1.6, fontWeight: 400 }}>
                Streamline ticket lifecycles, automate SLA compliance, and process direct AWS S3 attachments with stateless JWT security and real-time operational analytics.
              </p>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                <Button onClick={handleLaunchClick} className="btn-indigo btn-lg px-4 py-3 d-inline-flex align-items-center gap-2">
                  <Zap size={18} /> Launch Support Portal <ArrowRight size={18} />
                </Button>

                {!user && (
                  <Button onClick={() => navigate('/register')} variant="outline-light" className="btn-lg px-4 py-3 border-slate-700 text-white fw-semibold" style={{ borderColor: '#475569' }}>
                    Create Account
                  </Button>
                )}
              </div>

              {/* Trust Features Checklist */}
              <Row className="g-2 pt-3 border-top border-slate-800" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <Col sm={6} className="d-flex align-items-center gap-2 text-slate-300 small" style={{ color: '#94a3b8' }}>
                  <CheckCircle2 size={16} className="text-indigo-400" style={{ color: '#818cf8' }} /> Role-Based Access (Admin/Engineer/User)
                </Col>
                <Col sm={6} className="d-flex align-items-center gap-2 text-slate-300 small" style={{ color: '#94a3b8' }}>
                  <CheckCircle2 size={16} className="text-indigo-400" style={{ color: '#818cf8' }} /> AWS SDK v2 Pre-signed S3 Attachments
                </Col>
                <Col sm={6} className="d-flex align-items-center gap-2 text-slate-300 small" style={{ color: '#94a3b8' }}>
                  <CheckCircle2 size={16} className="text-indigo-400" style={{ color: '#818cf8' }} /> Automated SLA Target Tracking
                </Col>
                <Col sm={6} className="d-flex align-items-center gap-2 text-slate-300 small" style={{ color: '#94a3b8' }}>
                  <CheckCircle2 size={16} className="text-indigo-400" style={{ color: '#818cf8' }} /> Multi-AZ RDS MySQL Database Storage
                </Col>
              </Row>
            </Col>

            {/* Right Mockup Preview Column */}
            <Col lg={6}>
              <div className="position-relative">
                <div style={{ background: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} className="p-3">
                  {/* Browser Window Controls Header */}
                  <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="rounded-circle" style={{ width: 10, height: 10, background: '#ef4444' }} />
                      <span className="rounded-circle" style={{ width: 10, height: 10, background: '#f59e0b' }} />
                      <span className="rounded-circle" style={{ width: 10, height: 10, background: '#10b981' }} />
                      <span className="ms-2 text-slate-400 small fw-mono" style={{ fontSize: '0.75rem', color: '#64748b' }}>ticketdesk.internal/dashboard</span>
                    </div>
                    <span className="badge bg-indigo-900 text-indigo-200 border border-indigo-700" style={{ fontSize: '0.65rem', background: 'rgba(79,70,229,0.2)', color: '#a5b4fc', border: '1px solid rgba(79,70,229,0.4)' }}>
                      AWS ECS LIVE
                    </span>
                  </div>

                  {/* Simulated App Dashboard Content */}
                  <div className="bg-slate-900 p-3 rounded-3 mb-3" style={{ background: '#1e293b' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="fw-mono text-indigo-400 small" style={{ color: '#818cf8' }}>TICK-1002 • VPN Credentials Failure</div>
                      <span className="badge bg-amber-500 text-slate-950 fw-bold" style={{ background: '#f59e0b', color: '#0f172a', fontSize: '0.7rem' }}>HIGH PRIORITY</span>
                    </div>
                    <p className="small mb-2 text-slate-300" style={{ color: '#cbd5e1' }}>Unable to authenticate corporate VPN from remote endpoint.</p>
                    <div className="d-flex align-items-center justify-content-between small text-slate-400" style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                      <span>Assigned to: Sarah Conner</span>
                      <span className="text-emerald-400 fw-semibold" style={{ color: '#34d399' }}>SLA 8h Target OK</span>
                    </div>
                  </div>

                  {/* Simulated Live Analytics Bar */}
                  <Row className="g-2">
                    <Col xs={4}>
                      <div className="p-2.5 rounded-3 text-center" style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <span className="fs-5 fw-bold d-block text-cyan-400" style={{ color: '#38bdf8' }}>99.8%</span>
                        <span className="text-slate-400" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>SLA Target</span>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="p-2.5 rounded-3 text-center" style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <span className="fs-5 fw-bold d-block text-emerald-400" style={{ color: '#34d399' }}>&lt; 2.4h</span>
                        <span className="text-slate-400" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Avg Resolution</span>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="p-2.5 rounded-3 text-center" style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <span className="fs-5 fw-bold d-block text-amber-400" style={{ color: '#fbbf24' }}>AWS S3</span>
                        <span className="text-slate-400" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Direct Uploads</span>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* SECTION 2: TRUST & METRICS BANNER (Neutral Background) */}
      <section className="py-4 bg-white border-bottom border-light">
        <Container>
          <Row className="align-items-center text-center g-4">
            <Col md={3} sm={6}>
              <div className="p-2">
                <span className="fs-2 fw-extrabold text-dark d-block">99.9%</span>
                <span className="small text-muted fw-semibold">Uptime SLA Guaranteed</span>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="p-2">
                <span className="fs-2 fw-extrabold d-block" style={{ color: '#4f46e5' }}>0.00s</span>
                <span className="small text-muted fw-semibold">S3 Direct Upload Server Overhead</span>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="p-2">
                <span className="fs-2 fw-extrabold text-dark d-block">AWS ECS</span>
                <span className="small text-muted fw-semibold">Fargate Cloud Containerized</span>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="p-2">
                <span className="fs-2 fw-extrabold d-block" style={{ color: '#047857' }}>JWT 256</span>
                <span className="small text-muted fw-semibold">Stateless Security Architecture</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* SECTION 3: FEATURES GRID (Light Subtle Surface) */}
      <section className="py-5" style={{ background: '#f8fafc' }}>
        <Container className="py-4">
          <div className="text-center max-w-3xl mx-auto mb-5">
            <span className="text-uppercase fw-bold text-indigo-600 d-block mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', color: '#4f46e5' }}>PLATFORM CAPABILITIES</span>
            <h2 className="fw-extrabold text-dark mb-2 fs-2">Engineered for High-Velocity IT Teams</h2>
            <p className="text-muted fs-6">Complete architectural stack with zero third-party platform dependencies.</p>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <Card className="glass-card p-4 h-100 border-0 shadow-sm">
                <div className="p-2.5 rounded-3 d-inline-flex mb-3" style={{ background: '#eef2ff', color: '#4f46e5', width: 'fit-content' }}>
                  <ShieldCheck size={24} />
                </div>
                <h5 className="fw-bold text-dark mb-2 fs-6">Role-Based Access Control</h5>
                <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                  Granular permission enforcement across System Administrators, Support Engineers, and Employees powered by Spring Security 6.
                </p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="glass-card p-4 h-100 border-0 shadow-sm">
                <div className="p-2.5 rounded-3 d-inline-flex mb-3" style={{ background: '#f3e8ff', color: '#7c3aed', width: 'fit-content' }}>
                  <Cloud size={24} />
                </div>
                <h5 className="fw-bold text-dark mb-2 fs-6">Pre-signed S3 Attachments</h5>
                <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                  Upload diagnostic screenshots and logs directly to Amazon S3 using AWS SDK v2 pre-signed URLs with zero server memory overhead.
                </p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="glass-card p-4 h-100 border-0 shadow-sm">
                <div className="p-2.5 rounded-3 d-inline-flex mb-3" style={{ background: '#ecfdf5', color: '#047857', width: 'fit-content' }}>
                  <BarChart3 size={24} />
                </div>
                <h5 className="fw-bold text-dark mb-2 fs-6">Real-Time Analytics & SLA</h5>
                <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                  Track ticket status lifecycles, priority distributions, and SLA targets using interactive Recharts graphics and automated warnings.
                </p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="glass-card p-4 h-100 border-0 shadow-sm">
                <div className="p-2.5 rounded-3 d-inline-flex mb-3" style={{ background: '#fff7ed', color: '#ea580c', width: 'fit-content' }}>
                  <Bell size={24} />
                </div>
                <h5 className="fw-bold text-dark mb-2 fs-6">Automated Notifications</h5>
                <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                  Stay updated with real-time in-app notification alerts, assignment events, and ticket status updates.
                </p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="glass-card p-4 h-100 border-0 shadow-sm">
                <div className="p-2.5 rounded-3 d-inline-flex mb-3" style={{ background: '#f0f9ff', color: '#0284c7', width: 'fit-content' }}>
                  <FileCode size={24} />
                </div>
                <h5 className="fw-bold text-dark mb-2 fs-6">OpenAPI 3.0 Documentation</h5>
                <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                  Interactive REST API documentation with Swagger UI, input validation schemas, and standardized exception handling.
                </p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="glass-card p-4 h-100 border-0 shadow-sm">
                <div className="p-2.5 rounded-3 d-inline-flex mb-3" style={{ background: '#fdf2f8', color: '#db2777', width: 'fit-content' }}>
                  <Server size={24} />
                </div>
                <h5 className="fw-bold text-dark mb-2 fs-6">Terraform Infrastructure</h5>
                <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                  Production deployment via Terraform IaC modules on Amazon ECS Fargate, ALB, Multi-AZ RDS MySQL, and CloudFront.
                </p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* SECTION 4: DARK SHOWCASE SECTION (Contrast Feature Showcase) */}
      <section className="py-5 text-white" style={{ background: '#090d16' }}>
        <Container className="py-4">
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <span className="text-uppercase fw-bold text-indigo-400 d-block mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', color: '#818cf8' }}>
                DIRECT AWS INTEGRATION
              </span>
              <h2 className="fw-extrabold mb-3 text-white fs-2">Direct AWS S3 Pre-signed Uploads</h2>
              <p className="text-slate-300 mb-4" style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                Traditional file uploads pass through application servers, consuming precious RAM and CPU. TicketDesk generates secure AWS S3 pre-signed URLs, allowing client browsers to upload attachments directly to Amazon S3.
              </p>

              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="p-2 rounded-circle" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
                    <Paperclip size={18} />
                  </div>
                  <div>
                    <h6 className="fw-bold text-white mb-0 fs-6">Zero Backend Memory Usage</h6>
                    <small className="text-slate-400" style={{ color: '#94a3b8' }}>Files transfer directly from browser to Amazon S3 bucket storage.</small>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="p-2 rounded-circle" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                    <Lock size={18} />
                  </div>
                  <div>
                    <h6 className="fw-bold text-white mb-0 fs-6">Time-Limited Security Signatures</h6>
                    <small className="text-slate-400" style={{ color: '#94a3b8' }}>Pre-signed upload keys expire automatically after 15 minutes.</small>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <Card className="p-4 border-0 shadow-lg" style={{ background: '#1e293b', borderRadius: 16 }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <Paperclip size={18} className="text-indigo-400" style={{ color: '#818cf8' }} />
                    <span className="fw-semibold text-white small">AWS S3 Pre-signed Upload Manager</span>
                  </div>
                  <span className="badge bg-emerald-900 text-emerald-300" style={{ background: 'rgba(5, 150, 105, 0.2)', color: '#6ee7b7', fontSize: '0.7rem' }}>SECURE ACCESS</span>
                </div>

                <div className="p-3 rounded-3 mb-3 border border-slate-700" style={{ background: '#0f172a', borderColor: '#334155' }}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold text-white small">vpn_auth_error_trace.log</span>
                    <span className="text-slate-400 small" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>2.4 MB</span>
                  </div>
                  <div className="progress mb-2" style={{ height: 6, background: '#334155' }}>
                    <div className="progress-bar bg-indigo-500" style={{ width: '100%', background: '#6366f1' }} />
                  </div>
                  <small className="text-emerald-400 fw-mono" style={{ fontSize: '0.7rem', color: '#34d399' }}>✔ Direct S3 Transfer Complete (s3://tkt-kc-dev-attachments/)</small>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* SECTION 5: HOW IT WORKS (3-Step Visual Process) */}
      <section className="py-5 bg-white border-bottom border-light">
        <Container className="py-4">
          <div className="text-center max-w-3xl mx-auto mb-5">
            <span className="text-uppercase fw-bold text-indigo-600 d-block mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', color: '#4f46e5' }}>OPERATIONAL FLOW</span>
            <h2 className="fw-extrabold text-dark mb-2 fs-2">Simple 3-Step Incident Management</h2>
            <p className="text-muted fs-6">How TicketDesk processes support requests from submission to resolution.</p>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <div className="p-4 rounded-3 h-100" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className="fw-bold text-indigo-600 mb-2 fs-4" style={{ color: '#4f46e5' }}>01</div>
                <h5 className="fw-bold text-dark mb-2 fs-6">Submit Ticket & Attach Files</h5>
                <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                  Employees submit support tickets with category, priority level, and direct S3 attachment uploads.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="p-4 rounded-3 h-100" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className="fw-bold text-indigo-600 mb-2 fs-4" style={{ color: '#4f46e5' }}>02</div>
                <h5 className="fw-bold text-dark mb-2 fs-6">Engineer Assignment & SLA</h5>
                <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                  Tickets are automatically assigned to IT Support Engineers with real-time SLA target countdowns.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="p-4 rounded-3 h-100" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className="fw-bold text-indigo-600 mb-2 fs-4" style={{ color: '#4f46e5' }}>03</div>
                <h5 className="fw-bold text-dark mb-2 fs-6">Resolution & Metrics Audit</h5>
                <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                  Engineers resolve tickets with status transition notes, automatically updating analytical charts.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* SECTION 6: CALL TO ACTION BANNER (Brand Gradient) */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
        <Container className="py-4 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="fw-extrabold mb-3 text-white fs-2">Ready to Streamline Enterprise IT Support?</h2>
            <p className="fs-6 mb-4 text-indigo-100" style={{ opacity: 0.9 }}>
              Experience cloud-native incident management with zero server file upload overhead.
            </p>
            <Button onClick={handleLaunchClick} className="btn-light btn-lg px-5 py-3 fw-bold text-indigo-700 shadow-md" style={{ color: '#4f46e5' }}>
              Launch Support Portal Now
            </Button>
          </div>
        </Container>
      </section>

      {/* SECTION 7: MODERN FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-5 border-top border-slate-900" style={{ background: '#090d16', color: '#94a3b8' }}>
        <Container>
          <Row className="g-4 mb-4">
            <Col lg={4}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="p-2 rounded-3 bg-indigo-600 text-white" style={{ background: '#4f46e5' }}>
                  <Ticket size={20} />
                </div>
                <span className="fw-bold text-white fs-5">TicketDesk</span>
              </div>
              <p className="small text-slate-400 mb-0" style={{ color: '#94a3b8', lineHeight: 1.6 }}>
                Production-ready Enterprise IT Ticket Management System built on Spring Boot 3, React 18, and Amazon Web Services (ECS Fargate & S3).
              </p>
            </Col>

            <Col lg={8}>
              <Row className="g-4">
                <Col sm={4}>
                  <h6 className="fw-bold text-white mb-3 fs-6">Architecture</h6>
                  <ul className="list-unstyled small d-flex flex-column gap-2 mb-0" style={{ color: '#94a3b8' }}>
                    <li>Amazon ECS Fargate</li>
                    <li>AWS Application Load Balancer</li>
                    <li>Amazon S3 Pre-signed Bucket</li>
                    <li>Multi-AZ RDS MySQL 8.0</li>
                  </ul>
                </Col>
                <Col sm={4}>
                  <h6 className="fw-bold text-white mb-3 fs-6">Security</h6>
                  <ul className="list-unstyled small d-flex flex-column gap-2 mb-0" style={{ color: '#94a3b8' }}>
                    <li>Stateless JWT Authentication</li>
                    <li>BCrypt Password Hashing</li>
                    <li>Spring Security 6 RBAC</li>
                    <li>CORS & OWASP Protections</li>
                  </ul>
                </Col>
                <Col sm={4}>
                  <h6 className="fw-bold text-white mb-3 fs-6">API & Docs</h6>
                  <ul className="list-unstyled small d-flex flex-column gap-2 mb-0" style={{ color: '#94a3b8' }}>
                    <li>Swagger UI OpenAPI 3.0</li>
                    <li>Spring Boot Actuator Health</li>
                    <li>Flyway Database Migrations</li>
                    <li>Terraform IaC Deployment</li>
                  </ul>
                </Col>
              </Row>
            </Col>
          </Row>

          <div className="pt-4 border-top border-slate-900 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 small" style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#64748b' }}>
            <span>© 2026 TicketDesk IT Platform. Production AWS ECS Architecture.</span>
            <span>All System Rights Reserved.</span>
          </div>
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
