import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  Building2,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  UserPlus,
  PlusCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/overview');
        if (res.success) {
          setAnalytics(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Compiling hospital analytics..." />;
  }

  const counts = analytics?.counts || {};
  const financials = analytics?.financials || {};
  const deptDist = analytics?.deptDistribution || [];
  const recentAppts = analytics?.recentAppointments || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-brand-sky">Executive Overview</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Aegis Health Management Console</h2>
          <p className="text-sm text-slate-300 mt-1">
            System uptime 99.98% • Real-time clinical analytics & administrative oversight
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/users"
            className="px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-sky text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-teal-500/20"
          >
            <UserPlus className="w-4 h-4" />
            Add Staff / Doctor
          </Link>
          <Link
            to="/admin/departments"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            New Department
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Registered Patients"
          value={counts.patients || 0}
          icon={Users}
          color="teal"
          change="+12% this mo"
          trend="up"
        />
        <StatCard
          title="Active Medical Staff"
          value={(counts.doctors || 0) + (counts.staff || 0)}
          subtitle={`${counts.doctors || 0} Doctors, ${counts.staff || 0} Front Staff`}
          icon={Stethoscope}
          color="blue"
        />
        <StatCard
          title="Today's Appointments"
          value={counts.todayAppointments || 0}
          subtitle={`Total System: ${counts.totalAppointments || 0}`}
          icon={CalendarCheck}
          color="purple"
        />
        <StatCard
          title="Revenue Collected"
          value={`$${(financials.totalRevenue || 0).toLocaleString()}`}
          subtitle={`Pending: $${(financials.pendingCollection || 0).toLocaleString()}`}
          icon={DollarSign}
          color="amber"
          trend="up"
        />
      </div>

      {/* Two Column Layout: Department Distribution & Recent Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Department Doctor Distribution */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-blue" />
              Department Staffing
            </h3>
            <Link to="/admin/departments" className="text-xs font-bold text-brand-blue hover:underline">
              Manage
            </Link>
          </div>

          <div className="space-y-4">
            {deptDist.map((dept) => (
              <div key={dept.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{dept.name}</span>
                  <span className="text-slate-500">{dept.doctorCount} Doctor(s)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-blue h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.max(15, (dept.doctorCount / (counts.doctors || 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Appointments Activity */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-brand-blue" />
              Recent Appointments
            </h3>
            <span className="text-xs text-slate-400 font-medium">Real-time status</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-3">Patient</th>
                  <th className="py-3 px-3">Doctor</th>
                  <th className="py-3 px-3">Dept</th>
                  <th className="py-3 px-3">Slot</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAppts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-400">
                      No recent appointments recorded
                    </td>
                  </tr>
                ) : (
                  recentAppts.map((appt) => (
                    <tr key={appt._id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-bold text-slate-800">
                        {appt.patientId?.userId?.name || 'Walk-in'}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {appt.doctorId?.userId?.name || 'Unassigned'}
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {appt.departmentId?.name || 'N/A'}
                      </td>
                      <td className="py-3 px-3 text-slate-500">{appt.timeSlot}</td>
                      <td className="py-3 px-3 text-right">
                        <Badge variant={appt.status}>{appt.status}</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

