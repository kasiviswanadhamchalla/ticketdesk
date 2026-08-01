import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { AppNavbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { TicketList } from './pages/TicketList';
import { TicketDetail } from './pages/TicketDetail';
import { CreateTicket } from './pages/CreateTicket';
import { Profile } from './pages/Profile';
import { AdminPanel } from './pages/AdminPanel';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-vh-100 d-flex flex-column">
            <AppNavbar />
            <div className="d-flex flex-grow-1">
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Application Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route
                    path="/*"
                    element={
                      <div className="d-flex w-100">
                        <aside className="d-none d-lg-block border-end border-secondary border-opacity-25" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
                          <Sidebar />
                        </aside>
                        <main className="flex-grow-1 overflow-auto">
                          <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/tickets" element={<TicketList />} />
                            <Route path="/tickets/create" element={<CreateTicket />} />
                            <Route path="/tickets/:id" element={<TicketDetail />} />
                            <Route path="/profile" element={<Profile />} />

                            {/* Admin Protected Route */}
                            <Route element={<ProtectedRoute roles="ROLE_ADMIN" />}>
                              <Route path="/admin" element={<AdminPanel />} />
                            </Route>

                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                          </Routes>
                        </main>
                      </div>
                    }
                  />
                </Route>
              </Routes>
            </div>
          </div>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
