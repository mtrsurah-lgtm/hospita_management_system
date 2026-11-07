import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { Activity, Phone, Mail, MapPin, Heart } from 'lucide-react';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">HOSPITAL MANAGEMENT SYSTEM</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                State-of-the-art medical center delivering compassionate clinical excellence, rapid diagnostics, and patient-first care.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/departments" className="hover:text-teal-400 transition-colors">Specialized Departments</Link></li>
                <li><Link to="/doctors" className="hover:text-teal-400 transition-colors">Find a Specialist</Link></li>
                <li><Link to="/contact" className="hover:text-teal-400 transition-colors">Contact & Support</Link></li>
                <li><Link to="/login" className="hover:text-teal-400 transition-colors">Doctor / Staff Login</Link></li>
                <li><Link to="/register" className="hover:text-teal-400 transition-colors">Patient Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Emergency & Hours</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-rose-400 font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4" /> 24/7 ER: +1 (800) 911-HOSP
                </li>
                <li>OPD Clinics: Mon - Sat (8:00 AM - 8:00 PM)</li>
                <li>Diagnostic Labs: 24/7 Operational</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Campus Location</h4>
              <p className="text-sm flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>4500 Healthcare Blvd, Medical District, Springfield, IL 62704</span>
              </p>
              <p className="text-sm flex items-center gap-2 mt-3">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>care@hospital.org</span>
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Hospital Management System. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with precision for healthcare providers <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;

