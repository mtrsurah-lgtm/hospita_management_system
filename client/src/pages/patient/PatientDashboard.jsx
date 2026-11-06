import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FileText, Heart, Activity, Clock, Plus, ArrowRight, ShieldCheck, Stethoscope } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PatientDashboard = () => {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const [apptRes, medRes] = await Promise.all([
          api.get('/appointments?limit=10'),
          api.get('/medical-records?limit=5'),
        ]);

        if (apptRes.success) setAppointments(apptRes.data);
        if (medRes.success) setPrescriptions(medRes.data);
      } catch (err) {
        console.error('Failed to load patient portal data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Connecting to your health record..." />;
  }

  const upcomingAppt = appointments.find((a) => a.status === 'Confirmed' || a.status === 'Pending');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-brand-purple">Patient Health Portal</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Hello, {user?.name}</h2>
          <p className="text-xs text-brand-purple/60 mt-1">
            Blood Group: <span className="font-bold text-white">{profile?.bloodGroup || 'O+'}</span> • Manage appointments & view digital prescriptions
          </p>
        </div>
        <Link
          to="/patient/book"
          className="px-5 py-3 rounded-xl bg-brand-blue hover:bg-brand-sky text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20 shrink-0"
        >
          <Calendar className="w-4 h-4" />
          Book New Consultation
        </Link>
      </div>

      {/* Featured Next Appointment Card */}
      {upcomingAppt ? (
        <div className="bg-white rounded-3xl border-2 border-brand-blue/30 p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-sky/10 rounded-bl-full -z-0 pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-sky/10 text-brand-blue flex items-center justify-center font-black text-xl shrink-0 border border-teal-100">
                #{upcomingAppt.tokenNumber || 1}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-blue tracking-wider">Next Upcoming Visit</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Consultation with {upcomingAppt.doctorId?.userId?.name || 'Specialist'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {upcomingAppt.departmentId?.name} • Room: OPD-101
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-slate-600">
                  <span className="flex items-center gap-1 text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                    {new Date(upcomingAppt.appointmentDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1 text-brand-blue font-bold">
                    <Clock className="w-3.5 h-3.5 text-brand-blue" />
                    {upcomingAppt.timeSlot}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={upcomingAppt.status}>{upcomingAppt.status}</Badge>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center shadow-sm">
          <Calendar className="w-10 h-10 text-brand-sky mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">No appointments scheduled</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Need to see a doctor? Browse our specialist directory and book a slot in seconds.
          </p>
          <Link
            to="/patient/book"
            className="inline-flex items-center gap-1 mt-4 px-4 py-2 rounded-xl bg-brand-blue text-white font-bold text-xs hover:bg-brand-sky transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Book Consultation
          </Link>
        </div>
      )}

      {/* Two Column Section: Past Consultations & Recent Prescriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Appointments History */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-blue" />
              My Appointments
            </h3>
            <Link to="/patient/history" className="text-xs font-bold text-brand-blue hover:underline">
              Full Record →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {appointments.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No past visits recorded.</p>
            ) : (
              appointments.slice(0, 4).map((a) => (
                <div key={a._id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{a.doctorId?.userId?.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {new Date(a.appointmentDate).toLocaleDateString()} at {a.timeSlot}
                    </p>
                  </div>
                  <Badge variant={a.status}>{a.status}</Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Digital Prescriptions */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-blue" />
              Recent Prescriptions
            </h3>
            <Link to="/patient/prescriptions" className="text-xs font-bold text-brand-blue hover:underline">
              View All Prescriptions →
            </Link>
          </div>

          <div className="space-y-3">
            {prescriptions.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No active prescriptions on file.</p>
            ) : (
              prescriptions.slice(0, 3).map((record) => (
                <div key={record._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{record.diagnosis}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Prescribed by: {record.doctorId?.userId?.name || 'Physician'}
                  </p>
                  <div className="pt-1 flex flex-wrap gap-1">
                    {record.prescriptions?.map((p, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-teal-800">
                        {p.medicine} ({p.dosage})
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;

