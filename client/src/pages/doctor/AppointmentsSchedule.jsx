import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Calendar, Filter, FileText, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AppointmentsSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const url = `/appointments?${statusFilter ? `status=${statusFilter}&` : ''}${dateFilter ? `date=${dateFilter}&` : ''}limit=50`;
      const res = await api.get(url);
      if (res.success) setAppointments(res.data);
    } catch (err) {
      console.error('Failed to load appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, dateFilter]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const res = await api.patch(`/appointments/${appointmentId}/status`, { status: newStatus });
      if (res.success) {
        setAppointments(appointments.map((a) => (a._id === appointmentId ? res.data : a)));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating appointment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Doctor's Schedule & Consultations</h2>
          <p className="text-xs text-slate-500 mt-1">Review scheduled appointments, update statuses, or jump directly to the EMR editor.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {['', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === '' ? 'All Statuses' : st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue text-slate-700"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-rose-600 font-semibold hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading appointment schedule..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Date & Slot</th>
                  <th className="py-3.5 px-4">Patient</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Reason For Visit</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      No appointments matched current criteria.
                    </td>
                  </tr>
                ) : (
                  appointments.map((a) => (
                    <tr key={a._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">
                          {new Date(a.appointmentDate).toLocaleDateString()}
                        </p>
                        <p className="text-[11px] text-brand-blue font-semibold">{a.timeSlot}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{a.patientId?.userId?.name}</p>
                        <p className="text-[11px] text-slate-400">{a.patientId?.gender}, Blood: {a.patientId?.bloodGroup}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {a.patientId?.userId?.phone || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {a.reasonForVisit}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={a.status}>{a.status}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Link
                          to={`/doctor/emr?appointmentId=${a._id}&patientId=${a.patientId?._id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-sky/10 text-brand-blue hover:bg-brand-blue hover:text-white font-bold transition-all"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>EMR</span>
                        </Link>
                        {a.status === 'Confirmed' && (
                          <button
                            onClick={() => handleStatusChange(a._id, 'Completed')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {a.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleStatusChange(a._id, 'Cancelled')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold"
                            title="Cancel Appointment"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsSchedule;

