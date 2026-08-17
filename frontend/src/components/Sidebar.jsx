import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Ticket, PlusCircle, User, ShieldCheck } from 'lucide-react';

export const Sidebar = () => {
  const { hasRole } = useAuth();

  return (
    <div className="p-3 h-100 d-flex flex-column gap-1" style={{ minWidth: '240px', background: '#ffffff', borderRight: '1px solid #e2e8f0' }}>
      <div className="text-uppercase fw-semibold mb-2 px-3 pt-2" style={{ fontSize: '0.7rem', letterSpacing: '0.08em', color: '#64748b' }}>
        Overview
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

      <div className="text-uppercase fw-semibold mt-3 mb-2 px-3" style={{ fontSize: '0.7rem', letterSpacing: '0.08em', color: '#64748b' }}>
        Account & Admin
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
