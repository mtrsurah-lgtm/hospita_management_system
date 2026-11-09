import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Lock, Mail, AlertCircle, ArrowRight, Shield, Stethoscope, User, UserCog, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        const userRole = res.user.role;
        // Redirect based on role
        if (location.state?.from?.pathname) {
          navigate(location.state.from.pathname, { replace: true });
        } else {
          switch (userRole) {
            case 'admin':
              navigate('/admin');
              break;
            case 'doctor':
              navigate('/doctor');
              break;
            case 'staff':
              navigate('/staff');
              break;
            case 'patient':
              navigate('/patient');
              break;
            default:
              navigate('/');
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/30">
            <Activity className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to Hospital Management System
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Enter your credentials to access your role-based portal
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 text-center">
            ⚡ 1-Click Fast Login
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoFill('admin@hospital.com', 'Admin@123')}
              className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 bg-white border border-slate-200/90 rounded-xl font-bold text-slate-700 hover:border-teal-500 hover:text-teal-700 hover:bg-teal-50/50 shadow-sm transition-all whitespace-nowrap active:scale-95"
            >
              <Shield className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('doctor.sarah@hospital.com', 'Doctor@123')}
              className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 bg-white border border-slate-200/90 rounded-xl font-bold text-slate-700 hover:border-teal-500 hover:text-teal-700 hover:bg-teal-50/50 shadow-sm transition-all whitespace-nowrap active:scale-95"
            >
              <Stethoscope className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Doctor</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('staff@hospital.com', 'Staff@123')}
              className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 bg-white border border-slate-200/90 rounded-xl font-bold text-slate-700 hover:border-teal-500 hover:text-teal-700 hover:bg-teal-50/50 shadow-sm transition-all whitespace-nowrap active:scale-95"
            >
              <UserCog className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Staff Desk</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('patient.john@hospital.com', 'Patient@123')}
              className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 bg-white border border-slate-200/90 rounded-xl font-bold text-slate-700 hover:border-teal-500 hover:text-teal-700 hover:bg-teal-50/50 shadow-sm transition-all whitespace-nowrap active:scale-95"
            >
              <User className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Patient</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@hospital.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500/30 transition-all flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign In to Workspace'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          New patient without an account?{' '}
          <Link to="/register" className="font-bold text-teal-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

