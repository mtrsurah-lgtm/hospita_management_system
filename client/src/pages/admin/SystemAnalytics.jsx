import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, CalendarCheck, CheckCircle2, XCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SystemAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/overview');
        if (res.success) setData(res.data);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Aggregating performance indicators..." />;
  }

  const counts = data?.counts || {};
  const financials = data?.financials || {};
  const deptDist = data?.deptDistribution || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Hospital Operations & Analytics</h2>
        <p className="text-xs text-slate-500 mt-1">
          Real-time metrics, appointment volume throughput, revenue collections, and departmental utilization.
        </p>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Invoiced"
          value={`$${(financials.totalInvoiced || 0).toLocaleString()}`}
          icon={DollarSign}
          color="blue"
          subtitle="Cumulative hospital billings"
        />
        <StatCard
          title="Revenue Collected"
          value={`$${(financials.totalRevenue || 0).toLocaleString()}`}
          icon={TrendingUp}
          color="teal"
          change="Paid in full"
          trend="up"
        />
        <StatCard
          title="Pending Receivables"
          value={`$${(financials.pendingCollection || 0).toLocaleString()}`}
          icon={Clock}
          color="amber"
          subtitle="Awaiting cashier / insurance payment"
        />
      </div>

      {/* Appointment Funnel & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-brand-blue" />
            Appointments Fulfillment
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Completed Consultations</h4>
                  <p className="text-[11px] text-slate-500">Fulfilled with medical diagnosis and prescriptions</p>
                </div>
              </div>
              <span className="text-xl font-extrabold text-emerald-700">
                {counts.completedAppointments || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Pending / Confirmed in Queue</h4>
                  <p className="text-[11px] text-slate-500">Scheduled for today or future dates</p>
                </div>
              </div>
              <span className="text-xl font-extrabold text-amber-700">
                {counts.pendingAppointments || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-rose-600" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Cancelled by Patient / Clinic</h4>
                  <p className="text-[11px] text-slate-500">Slot released back to hospital pool</p>
                </div>
              </div>
              <span className="text-xl font-extrabold text-rose-700">
                {counts.cancelledAppointments || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Clinical Department Volume */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-blue" />
            Specialists Allocation
          </h3>

          <div className="space-y-4">
            {deptDist.map((d) => (
              <div key={d.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{d.name}</span>
                  <span className="text-brand-blue font-bold">{d.doctorCount} Doctor(s)</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-blue h-full rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(10, (d.doctorCount / (counts.doctors || 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;

