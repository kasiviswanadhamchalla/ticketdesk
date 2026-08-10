import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Ticket, PlusCircle, User, ShieldCheck } from 'lucide-react';

export const Sidebar = () => {
  const { hasRole } = useAuth();

  return (
    <div className="p-3 h-100 d-flex flex-column gap-2" style={{ minWidth: '240px', background: '#ffffff' }}>
      <div className="text-uppercase fw-bold mb-2 px-3" style={{ fontSize: '0.75rem', letterSpacing: '1px', color: '#475569' }}>
        Main Menu
      </div>

      <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/tickets" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Ticket size={18} />
        <span>All Tickets</span>
      </NavLink>

      <NavLink to="/tickets/create" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <PlusCircle size={18} />
        <span>Create Ticket</span>
      </NavLink>

      <div className="text-uppercase fw-bold my-2 px-3" style={{ fontSize: '0.75rem', letterSpacing: '1px', color: '#475569' }}>
        Account & System
      </div>

      <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <User size={18} />
        <span>My Profile</span>
      </NavLink>

      {hasRole('ROLE_ADMIN') && (
        <NavLink to="/admin" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <ShieldCheck size={18} />
          <span>Admin Control</span>
        </NavLink>
      )}
    </div>
  );
};
