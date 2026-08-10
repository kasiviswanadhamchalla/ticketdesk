import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { LoginModal } from './LoginModal';
import { Bell, User, LogOut, Ticket, Settings, LogIn } from 'lucide-react';

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
      <Navbar expand="lg" className="navbar-custom sticky-top py-2 px-0">
        <Container fluid className="px-3 px-md-5">
          <Navbar.Brand as={Link} to={user ? '/dashboard' : '/'} className="d-flex align-items-center gap-2 text-decoration-none">
            <div className="p-2 rounded-circle" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
              <Ticket className="text-white" size={24} />
            </div>
            <span className="navbar-brand-gradient">TicketDesk</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-secondary" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center gap-2">
              {user ? (
                <>
                  {/* Notifications Dropdown */}
                  <NavDropdown
                    title={
                      <div className="position-relative d-inline-block p-1 text-secondary">
                        <Bell size={22} />
                        {unreadCount > 0 && (
                          <Badge
                            bg="danger"
                            pill
                            className="position-absolute top-0 start-100 translate-middle"
                            style={{ fontSize: '0.65rem' }}
                          >
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                    }
                    id="notifications-dropdown"
                    align="end"
                    className="no-arrow"
                  >
                    <div className="p-2 border-bottom fw-bold d-flex justify-content-between align-items-center" style={{ minWidth: '280px' }}>
                      <span>Notifications</span>
                      <Badge bg="secondary">{unreadCount} New</Badge>
                    </div>
                    {notifications.length === 0 ? (
                      <NavDropdown.Item disabled className="text-muted text-center py-3">
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
                          className={`p-2 border-bottom ${!n.read ? 'bg-light' : ''}`}
                        >
                          <div className="fw-semibold text-truncate text-dark" style={{ maxWidth: '250px' }}>{n.title}</div>
                          <small className="text-muted d-block text-truncate" style={{ maxWidth: '250px' }}>{n.message}</small>
                        </NavDropdown.Item>
                      ))
                    )}
                  </NavDropdown>

                  {/* Profile & User Dropdown */}
                  <NavDropdown
                    title={
                      <span className="d-inline-flex align-items-center gap-2 text-dark">
                        <span
                          className="rounded-circle text-white d-inline-flex align-items-center justify-content-center fw-bold shadow-sm"
                          style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                        >
                          {user.firstName ? user.firstName.charAt(0) : 'U'}
                        </span>
                        <span className="fw-bold d-none d-md-inline" style={{ color: '#0f172a' }}>{user.firstName} {user.lastName}</span>
                      </span>
                    }
                    id="user-dropdown"
                    align="end"
                  >
                    <NavDropdown.Item as={Link} to="/profile" className="d-flex align-items-center gap-2">
                      <User size={16} /> Profile
                    </NavDropdown.Item>

                    {hasRole('ROLE_ADMIN') && (
                      <NavDropdown.Item as={Link} to="/admin" className="d-flex align-items-center gap-2">
                        <Settings size={16} /> Admin Panel
                      </NavDropdown.Item>
                    )}

                    <NavDropdown.Divider />

                    <NavDropdown.Item onClick={handleLogout} className="d-flex align-items-center gap-2 text-danger">
                      <LogOut size={16} /> Sign Out
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Button
                    onClick={() => setShowLoginModal(true)}
                    variant="outline-indigo"
                    className="px-3 py-2 d-flex align-items-center gap-1 fw-bold"
                  >
                    <LogIn size={18} /> Sign In
                  </Button>
                  <Button as={Link} to="/register" className="btn-indigo px-4 py-2 fw-bold">
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
