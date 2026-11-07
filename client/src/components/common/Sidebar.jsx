import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  CalendarCheck,
  FileText,
  Clock,
  UserPlus,
  CreditCard,
  History,
  Calendar,
  Activity,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { role, user } = useAuth();

  const getNavLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
          { name: 'User Management', path: '/admin/users', icon: Users },
          { name: 'Departments', path: '/admin/departments', icon: Building2 },
          { name: 'System Analytics', path: '/admin/analytics', icon: BarChart3 },
          { name: 'Account Settings', path: '/admin/settings', icon: Settings },
        ];
      case 'doctor':
        return [
          { name: 'Overview', path: '/doctor', icon: LayoutDashboard },
          { name: 'My Appointments', path: '/doctor/appointments', icon: CalendarCheck },
          { name: 'EMR & Prescriptions', path: '/doctor/emr', icon: FileText },
          { name: 'My Schedule', path: '/doctor/availability', icon: Clock },
          { name: 'Account Settings', path: '/doctor/settings', icon: Settings },
        ];
      case 'staff':
        return [
          { name: 'Front Desk', path: '/staff', icon: LayoutDashboard },
          { name: 'Register Patient', path: '/staff/patients', icon: UserPlus },
          { name: 'Appointment Desk', path: '/staff/appointments', icon: CalendarCheck },
          { name: 'Billing & Cashier', path: '/staff/billing', icon: CreditCard },
          { name: 'Account Settings', path: '/staff/settings', icon: Settings },
        ];
      case 'patient':
        return [
          { name: 'My Health Portal', path: '/patient', icon: LayoutDashboard },
          { name: 'Book Appointment', path: '/patient/book', icon: Calendar },
          { name: 'Prescriptions', path: '/patient/prescriptions', icon: FileText },
          { name: 'Medical Records', path: '/patient/history', icon: History },
          { name: 'Account Settings', path: '/patient/settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-teal-500/20">
          <Activity className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h2 className="font-bold tracking-tight text-white leading-tight">HOSPITAL MANAGEMENT</h2>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-teal-400">
            {role?.toUpperCase()} PORTAL
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Workspace Menu
        </p>
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path.split('/').length <= 2}
              className={({ isActive }) =>
                `flex items-center px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User profile capsule at footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center space-x-3">
          <img
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=2323FF&color=fff`
            }
            alt={user?.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-700"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate capitalize">{role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

