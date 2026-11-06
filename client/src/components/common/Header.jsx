import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from './Badge';

const Header = ({ title = 'Dashboard' }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        <Badge variant={role}>{role?.toUpperCase()}</Badge>
      </div>

      <div className="flex items-center space-x-3">
        {/* Back to public home */}
        <Link
          to="/"
          className="p-2 text-slate-500 hover:text-brand-blue hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
          title="Hospital Homepage"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Website</span>
        </Link>

        {/* User Info */}
        <div className="hidden sm:flex items-center space-x-2 pl-3 border-l border-slate-200">
          <span className="text-xs font-semibold text-slate-600">{user?.name}</span>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;

