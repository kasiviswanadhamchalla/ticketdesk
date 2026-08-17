import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { LoginModal } from './LoginModal';
import { Bell, User, LogOut, Ticket, Settings, LogIn, Activity } from 'lucide-react';

export const AppNavbar = () => {
  const { user, logout, hasRole } = useAuth();
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <Navbar expand="lg" className="navbar-custom sticky-top py-0 px-0">
        <Container fluid className="px-3 px-md-4">
          <Navbar.Brand as={Link} to={user ? '/dashboard' : '/'} className="d-flex align-items-center gap-2 text-decoration-none">
            <div className="navbar-brand-icon">
              <Ticket size={20} />
            </div>
            <span className="navbar-brand-gradient">TicketDesk</span>
            <span className="badge rounded-pill bg-emerald-50 text-emerald-700 border border-emerald-200 ms-2 d-none d-sm-inline-flex align-items-center gap-1" style={{ fontSize: '0.7rem', padding: '0.25em 0.6em', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
              <Activity size={12} /> AWS ECS Live
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none p-1" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center gap-3">
              {user ? (
                <>
                  {/* Notifications Dropdown */}
                  <NavDropdown
                    title={
                      <div className="position-relative d-inline-flex align-items-center justify-content-center p-2 rounded-circle hover-bg-subtle" style={{ color: '#475569', transition: 'all 0.15s ease' }}>
                        <Bell size={20} />
                        {unreadCount > 0 && (
                          <span
                            className="position-absolute top-0 end-0 bg-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                            style={{ fontSize: '0.65rem', width: 16, height: 16 }}
                          >
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    }
                    id="notifications-dropdown"
                    align="end"
                    className="no-arrow"
                  >
                    <div className="px-3 py-2 border-bottom fw-bold d-flex justify-content-between align-items-center" style={{ minWidth: '300px' }}>
                      <span className="small text-uppercase tracking-wider" style={{ color: '#475569' }}>Notifications</span>
                      <Badge bg="indigo" className="bg-primary">{unreadCount} New</Badge>
                    </div>
                    {notifications.length === 0 ? (
                      <NavDropdown.Item disabled className="text-muted text-center py-3 small">
                        No recent notifications
                      </NavDropdown.Item>
                    ) : (
                      notifications.map((n) => (
                        <NavDropdown.Item
                          key={n.id}
                          onClick={() => {
                            markAsRead(n.id);
                            if (n.referenceId) navigate(`/tickets/${n.referenceId}`);
                          }}
                          className={`px-3 py-2 border-bottom ${!n.read ? 'bg-light' : ''}`}
                        >
                          <div className="fw-semibold text-truncate text-dark small" style={{ maxWidth: '260px' }}>{n.title}</div>
                          <small className="text-muted d-block text-truncate" style={{ maxWidth: '260px', fontSize: '0.78rem' }}>{n.message}</small>
                        </NavDropdown.Item>
                      ))
                    )}
                  </NavDropdown>

                  {/* Profile & User Dropdown */}
                  <NavDropdown
                    title={
                      <span className="d-inline-flex align-items-center gap-2">
                        <span
                          className="rounded-circle text-white d-inline-flex align-items-center justify-content-center fw-bold shadow-sm"
                          style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', fontSize: '0.9rem' }}
                        >
                          {user.firstName ? user.firstName.charAt(0) : 'U'}
                        </span>
                        <span className="fw-semibold d-none d-md-inline" style={{ color: '#0f172a', fontSize: '0.9rem' }}>{user.firstName} {user.lastName}</span>
                      </span>
                    }
                    id="user-dropdown"
                    align="end"
                  >
                    <NavDropdown.Item as={Link} to="/profile" className="d-flex align-items-center gap-2 py-2 fs-6">
                      <User size={16} className="text-slate-500" /> Profile Settings
                    </NavDropdown.Item>

                    {hasRole('ROLE_ADMIN') && (
                      <NavDropdown.Item as={Link} to="/admin" className="d-flex align-items-center gap-2 py-2 fs-6">
                        <Settings size={16} className="text-slate-500" /> Admin Control
                      </NavDropdown.Item>
                    )}

                    <NavDropdown.Divider />

                    <NavDropdown.Item onClick={handleLogout} className="d-flex align-items-center gap-2 py-2 fs-6 text-danger">
                      <LogOut size={16} /> Sign Out
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Button
                    onClick={() => setShowLoginModal(true)}
                    variant="outline-indigo"
                    className="px-3 py-2 d-flex align-items-center gap-1"
                  >
                    <LogIn size={16} /> Sign In
                  </Button>
                  <Button as={Link} to="/register" className="btn-indigo px-3 py-2">
                    Register
                  </Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Global Pop-up Login Modal */}
      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        onSwitchToRegister={() => navigate('/register')}
      />
    </>
  );
};
