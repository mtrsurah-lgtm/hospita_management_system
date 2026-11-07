import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Users, FileText, Clock, Stethoscope, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyAppointments = async () => {
      try {
        const res = await api.get('/appointments?limit=20');
        if (res.success) setAppointments(res.data);
      } catch (err) {
        console.error('Failed to load doctor appointments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyAppointments();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading clinic console..." />;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter((a) => a.appointmentDate?.startsWith(todayStr));
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const pendingCount = appointments.filter((a) => a.status === 'Confirmed' || a.status === 'Pending').length;

  return (
    <div className="space-y-8">
      {/* Doctor Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-teal-400">Doctor Console</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Welcome back, {user?.name}</h2>
          <p className="text-xs text-teal-200 mt-1">
            You have <span className="font-bold text-white">{todayAppts.length} appointments</span> scheduled for today.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/doctor/emr"
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-teal-600/20 whitespace-nowrap active:scale-95"
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Write Prescription / EMR</span>
          </Link>
          <Link
            to="/doctor/availability"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all whitespace-nowrap active:scale-95 shadow-sm"
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span>Manage My Slots</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Today's Consultation Queue"
          value={todayAppts.length}
          subtitle="Patients booked for today"
          icon={CalendarCheck}
          color="teal"
        />
        <StatCard
          title="Pending In Queue"
          value={pendingCount}
          subtitle="Awaiting consultation"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Completed Consultations"
          value={completedCount}
          subtitle="EMRs authored & prescribed"
          icon={CheckCircle}
          color="blue"
        />
      </div>

      {/* Today's Schedule Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-teal-600" />
              Assigned Patients Queue
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Click "Consult & Prescribe" to launch the medical record builder.</p>
          </div>
          <Link to="/doctor/appointments" className="text-xs font-bold text-teal-600 hover:underline">
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Token #</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Slot</th>
                <th className="py-3 px-4">Chief Complaint / Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No scheduled appointments at this moment.
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-teal-600">
                      #{appt.tokenNumber || 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{appt.patientId?.userId?.name || 'Patient'}</p>
                      <p className="text-[11px] text-slate-400">{appt.patientId?.gender}, {appt.patientId?.bloodGroup}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-semibold">{appt.timeSlot}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {appt.reasonForVisit}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={appt.status}>{appt.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/doctor/emr?appointmentId=${appt._id}&patientId=${appt.patientId?._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white font-bold transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Consult & Prescribe</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

