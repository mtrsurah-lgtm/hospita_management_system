import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, CalendarCheck, CreditCard, Users, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StaffDashboard = () => {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [stats, setStats] = useState({ totalPatients: 0, pendingBills: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const [apptRes, patientRes, billRes] = await Promise.all([
          api.get(`/appointments?date=${todayStr}&limit=10`),
          api.get('/patients?limit=1'),
          api.get('/billing?status=Pending&limit=1'),
        ]);

        if (apptRes.success) setTodayAppointments(apptRes.data);
        setStats({
          totalPatients: patientRes.meta?.total || 0,
          pendingBills: billRes.meta?.total || 0,
        });
      } catch (err) {
        console.error('Failed to load staff dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Connecting to reception desk..." />;
  }

  return (
    <div className="space-y-8">
      {/* Front-Desk Banner */}
      <div className="bg-gradient-to-r from-blue-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-sky-400">Reception & Front Desk</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Patient Check-In & Queue Center</h2>
          <p className="text-xs text-blue-200 mt-1">
            Register incoming walk-in patients, manage appointment tokens, and process billing.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/staff/patients"
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-teal-600/20 whitespace-nowrap active:scale-95"
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>Register Walk-In</span>
          </Link>
          <Link
            to="/staff/appointments"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all whitespace-nowrap active:scale-95 shadow-sm"
          >
            <CalendarCheck className="w-4 h-4 shrink-0" />
            <span>Book Slot</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Today's Clinic Queue"
          value={todayAppointments.length}
          subtitle="Patients scheduled for today"
          icon={CalendarCheck}
          color="blue"
        />
        <StatCard
          title="Registered Patients Pool"
          value={stats.totalPatients}
          subtitle="Active hospital records"
          icon={Users}
          color="teal"
        />
        <StatCard
          title="Pending Cashier Invoices"
          value={stats.pendingBills}
          subtitle="Awaiting payment settlement"
          icon={CreditCard}
          color="amber"
        />
      </div>

      {/* Today's Reception Desk Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            Today's Check-In Desk
          </h3>
          <Link to="/staff/appointments" className="text-xs font-bold text-teal-600 hover:underline">
            Manage All Appointments →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Token #</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Doctor</th>
                <th className="py-3 px-4">Slot</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {todayAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No patients queued for today yet. Use "Book Slot" to schedule walk-ins.
                  </td>
                </tr>
              ) : (
                todayAppointments.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-blue-700">#{a.tokenNumber || 1}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {a.patientId?.userId?.name || 'Walk-In'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {a.doctorId?.userId?.name || 'Doctor'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-semibold">{a.timeSlot}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={a.status}>{a.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/staff/billing"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Bill Patient</span>
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

export default StaffDashboard;

