import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Award,
  Clock,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Brain,
  Baby,
  Bone,
  CheckCircle2,
  PhoneCall,
  Activity,
} from 'lucide-react';
import api from '../../services/api';

const LandingPage = () => {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          api.get('/departments'),
          api.get('/doctors?limit=4'),
        ]);
        if (deptRes.success) setDepartments(deptRes.data.slice(0, 4));
        if (docRes.success) setDoctors(docRes.data);
      } catch (err) {
        console.error('Failed to load landing data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDeptIcon = (name) => {
    switch (name?.toLowerCase()) {
      case 'cardiology':
        return <HeartPulse className="w-6 h-6 text-rose-500" />;
      case 'neurology':
        return <Brain className="w-6 h-6 text-purple-500" />;
      case 'pediatrics':
        return <Baby className="w-6 h-6 text-amber-500" />;
      case 'orthopedics':
        return <Bone className="w-6 h-6 text-blue-500" />;
      default:
        return <Activity className="w-6 h-6 text-brand-sky" />;
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 via-white to-slate-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-sky/20/80 text-teal-800 text-xs font-bold tracking-wide uppercase">
                <ShieldCheck className="w-4 h-4 text-brand-blue" />
                Accredited Multi-Speciality Medical Center
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Modern Healthcare, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
                  Patient-Centered
                </span>{' '}
                Excellence.
              </h1>

              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Connect with leading certified physicians, schedule hassle-free appointments, and access your digital medical records and prescriptions anytime.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-brand-blue text-white font-bold hover:bg-brand-sky shadow-lg shadow-teal-600/25 transition-all text-base"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book an Appointment
                </Link>

                <Link
                  to="/doctors"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all text-base shadow-sm"
                >
                  <Stethoscope className="w-5 h-5 mr-2 text-brand-blue" />
                  Browse Specialists
                </Link>
              </div>

              {/* Emergency Call Box */}
              <div className="pt-4 flex items-center gap-3 text-sm text-slate-500">
                <div className="p-2.5 rounded-full bg-rose-50 text-rose-600">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-semibold text-slate-800">24/7 Immediate Emergency Care</span>
                  <span className="text-rose-600 font-bold">+1 (800) 911-AEGIS (23447)</span>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80"
                    alt="Doctor Consultation"
                    className="w-full h-[460px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-xs uppercase font-bold tracking-wider text-brand-purple">Certified Team</span>
                    <h3 className="text-xl font-bold">World-Class Medical Specialists</h3>
                    <p className="text-xs text-slate-200 mt-1">Dedicated to precision diagnosis and humane clinical care.</p>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">99.4% Success Rate</p>
                    <p className="text-xs text-slate-400">Over 25,000 satisfied patients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hospital Key Metrics */}
      <section className="bg-white border-y border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-brand-blue">50+</p>
              <p className="text-sm font-semibold text-slate-600 mt-1">Certified Specialists</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-brand-blue">12</p>
              <p className="text-sm font-semibold text-slate-600 mt-1">Modern Departments</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-brand-blue">24/7</p>
              <p className="text-sm font-semibold text-slate-600 mt-1">Emergency & Lab</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-brand-blue">100%</p>
              <p className="text-sm font-semibold text-slate-600 mt-1">Digital Health Records</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Departments */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">Centers of Excellence</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Specialized Medical Departments</h2>
            </div>
            <Link
              to="/departments"
              className="mt-4 sm:mt-0 text-sm font-bold text-brand-blue hover:text-brand-blue flex items-center gap-1"
            >
              View All Departments <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept) => (
              <div
                key={dept._id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                  {getDeptIcon(dept.name)}
                </div>
                <h3 className="text-lg font-bold text-slate-800">{dept.name}</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{dept.description}</p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{dept.doctorCount || 1} Doctor(s)</span>
                  <Link to="/doctors" className="font-bold text-brand-blue hover:underline">
                    Consult →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Doctors Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">Our Medical Faculty</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Consult With Expert Doctors</h2>
            </div>
            <Link
              to="/doctors"
              className="mt-4 sm:mt-0 text-sm font-bold text-brand-blue hover:text-brand-blue flex items-center gap-1"
            >
              Browse Doctor Directory <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="h-48 overflow-hidden bg-slate-100">
                  <img
                    src={
                      doc.userId?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.userId?.name || 'Doctor')}&background=2323FF&color=fff`
                    }
                    alt={doc.userId?.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <span className="inline-block text-[11px] font-bold text-brand-blue bg-brand-sky/10 px-2.5 py-0.5 rounded-full">
                    {doc.departmentId?.name || 'Specialist'}
                  </span>
                  <h4 className="font-bold text-slate-900 text-base">{doc.userId?.name}</h4>
                  <p className="text-xs text-slate-500">{doc.specialization}</p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Fee</span>
                      <p className="text-sm font-bold text-slate-800">${doc.consultationFee}</p>
                    </div>
                    <Link
                      to="/register"
                      className="px-3 py-1.5 rounded-lg bg-brand-blue text-white text-xs font-bold hover:bg-brand-sky transition-colors"
                    >
                      Book Slot
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow: How It Works */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-sky">Simplified Healthcare</span>
            <h2 className="text-3xl font-extrabold mt-1">How Aegis Health Works</h2>
            <p className="text-slate-400 text-sm mt-3">From booking to digital follow-up in 3 simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/60 relative">
              <span className="w-10 h-10 rounded-full bg-brand-blue text-slate-950 font-black flex items-center justify-center text-lg mb-6">
                1
              </span>
              <h3 className="text-xl font-bold mb-2">Select Doctor & Slot</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Filter by medical department or doctor specialization. Pick an open appointment slot that fits your schedule.
              </p>
            </div>

            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/60 relative">
              <span className="w-10 h-10 rounded-full bg-brand-blue text-slate-950 font-black flex items-center justify-center text-lg mb-6">
                2
              </span>
              <h3 className="text-xl font-bold mb-2">Consultation & EMR</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Meet your doctor for a detailed consultation, vitals monitoring, diagnosis, and treatment planning.
              </p>
            </div>

            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/60 relative">
              <span className="w-10 h-10 rounded-full bg-brand-blue text-slate-950 font-black flex items-center justify-center text-lg mb-6">
                3
              </span>
              <h3 className="text-xl font-bold mb-2">Digital Prescriptions</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Access your digital prescriptions, lab orders, and invoices anytime through your secured patient dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-700 to-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to experience next-generation healthcare?
          </h2>
          <p className="text-teal-100 max-w-xl mx-auto text-base">
            Register your patient profile now or log in to your staff and doctor workspace.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-white text-teal-900 font-extrabold hover:bg-brand-sky/10 shadow-lg transition-all"
            >
              Create Free Patient Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-xl bg-teal-800 text-white font-bold border border-brand-blue hover:bg-brand-sky transition-all"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

