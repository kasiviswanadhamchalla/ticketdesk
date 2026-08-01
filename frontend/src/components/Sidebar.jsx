import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Ticket, PlusCircle, User, ShieldCheck } from 'lucide-react';

export const Sidebar = () => {
  const { hasRole } = useAuth();

  return (
    <div className="p-3 h-100 d-flex flex-column gap-2" style={{ minWidth: '240px' }}>
      <div className="text-uppercase text-muted fw-bold mb-2 px-3" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
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

      <div className="text-uppercase text-muted fw-bold my-2 px-3" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
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
