import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Bell, User, LogOut, Ticket, Settings } from 'lucide-react';

export const AppNavbar = () => {
  const { user, logout, hasRole } = useAuth();
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="navbar-custom sticky-top py-2 px-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard" className="d-flex align-items-center gap-2">
          <Ticket className="text-indigo-400" size={28} style={{ color: '#818cf8' }} />
          <span className="navbar-brand-gradient">TicketDesk</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-secondary" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            {user ? (
              <>
                {/* Notifications Dropdown */}
                <NavDropdown
                  title={
                    <div className="position-relative d-inline-block p-1 text-light">
                      <Bell size={20} />
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
                        className={`p-2 border-bottom ${!n.read ? 'bg-dark bg-opacity-50' : ''}`}
                      >
                        <div className="fw-semibold text-truncate" style={{ maxWidth: '250px' }}>{n.title}</div>
                        <small className="text-muted d-block text-truncate" style={{ maxWidth: '250px' }}>{n.message}</small>
                      </NavDropdown.Item>
                    ))
                  )}
                </NavDropdown>

                {/* Profile & User Dropdown */}
                <NavDropdown
                  title={
                    <div className="d-flex align-items-center gap-2 text-light">
                      <div
                        className="rounded-circle bg-indigo-600 d-flex align-items-center justify-content-center fw-bold"
                        style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
                      >
                        {user.firstName ? user.firstName.charAt(0) : 'U'}
                      </div>
                      <span className="fw-medium d-none d-md-inline">{user.firstName} {user.lastName}</span>
                    </div>
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
              <>
                <Nav.Link as={Link} to="/login" className="text-light fw-medium">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="btn btn-indigo px-3 py-1">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
