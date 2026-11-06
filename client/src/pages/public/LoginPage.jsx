import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Lock, Mail, AlertCircle, ArrowRight, Shield, Stethoscope, User, UserCog } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
          <div className="mx-auto w-12 h-12 rounded-2xl bg-brand-blue flex items-center justify-center text-white shadow-md shadow-teal-600/30">
            <Activity className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to Aegis Health
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Enter your credentials to access your role-based portal
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
            ⚡ Quick Demo Accounts (1-Click Fill)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoFill('admin@hospital.com', 'Admin@123')}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:border-brand-blue hover:text-brand-blue transition-all text-left"
            >
              <Shield className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('doctor.sarah@hospital.com', 'Doctor@123')}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:border-brand-blue hover:text-brand-blue transition-all text-left"
            >
              <Stethoscope className="w-3.5 h-3.5 text-brand-blue shrink-0" />
              <span>Doctor</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('staff@hospital.com', 'Staff@123')}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:border-brand-blue hover:text-brand-blue transition-all text-left"
            >
              <UserCog className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Staff Desk</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('patient.john@hospital.com', 'Patient@123')}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:border-brand-blue hover:text-brand-blue transition-all text-left"
            >
              <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-brand-blue"
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
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-brand-blue"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-brand-blue text-white font-bold text-sm hover:bg-brand-sky focus:outline-none focus:ring-4 focus:ring-teal-500/30 transition-all flex items-center justify-center gap-2 shadow-md shadow-brand-blue/20 disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign In to Workspace'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          New patient without an account?{' '}
          <Link to="/register" className="font-bold text-brand-blue hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

