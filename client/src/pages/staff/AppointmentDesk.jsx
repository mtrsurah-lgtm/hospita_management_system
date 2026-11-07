import React, { useState, useEffect } from 'react';
import { CalendarCheck, Plus, Calendar, Clock, Search, Filter, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AppointmentDesk = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Booking Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '09:00 - 09:30',
    reasonForVisit: 'General Consultation',
    type: 'Consultation',
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [checkingSlots, setCheckingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [patRes, docRes] = await Promise.all([
          api.get('/patients?limit=100'),
          api.get('/doctors?limit=50'),
        ]);
        if (patRes.success) {
          setPatients(patRes.data);
          if (patRes.data.length > 0) {
            setFormData((prev) => ({ ...prev, patientId: patRes.data[0]._id }));
          }
        }
        if (docRes.success) {
          setDoctors(docRes.data);
          if (docRes.data.length > 0) {
            setFormData((prev) => ({ ...prev, doctorId: docRes.data[0]._id }));
          }
        }
      } catch (err) {
        console.error('Failed to load dropdown records', err);
      }
    };
    fetchDropdowns();
  }, []);

  // Fetch doctor slot availability when doctor or date changes
  useEffect(() => {
    if (!formData.doctorId || !formData.appointmentDate) return;

    const checkAvailability = async () => {
      setCheckingSlots(true);
      try {
        const res = await api.get(`/doctors/${formData.doctorId}/availability?date=${formData.appointmentDate}`);
        if (res.success && res.data.availableSlots) {
          setAvailableSlots(res.data.availableSlots);
          if (res.data.availableSlots.length > 0) {
            setFormData((prev) => ({ ...prev, timeSlot: res.data.availableSlots[0] }));
          }
        }
      } catch (err) {
        console.error('Slot availability check failed', err);
      } finally {
        setCheckingSlots(false);
      }
    };

    checkAvailability();
  }, [formData.doctorId, formData.appointmentDate]);

  const handleBook = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.post('/appointments', formData);
      if (res.success) {
        setIsModalOpen(false);
        setMessage({ type: 'success', text: 'Appointment booked successfully!' });
        fetchAppointments();
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to book appointment',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await api.patch(`/appointments/${id}/status`, { status });
      if (res.success) {
        setAppointments(appointments.map((a) => (a._id === id ? res.data : a)));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Hospital Appointment Desk</h2>
          <p className="text-xs text-slate-500 mt-1">Schedule consultations, view token queue, and manage doctor calendars.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Schedule Appointment
        </button>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filter and Date Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {['', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === '' ? 'All Appointments' : st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500 text-slate-700"
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

      {/* Appointment Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Refreshing appointment schedule..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Token #</th>
                  <th className="py-3.5 px-4">Date & Slot</th>
                  <th className="py-3.5 px-4">Patient</th>
                  <th className="py-3.5 px-4">Doctor & Department</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-400">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  appointments.map((a) => (
                    <tr key={a._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-teal-600">
                        #{a.tokenNumber || 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{new Date(a.appointmentDate).toLocaleDateString()}</p>
                        <p className="text-[11px] text-teal-600 font-semibold">{a.timeSlot}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{a.patientId?.userId?.name}</p>
                        <p className="text-[11px] text-slate-400">{a.patientId?.userId?.phone || '—'}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{a.doctorId?.userId?.name}</p>
                        <p className="text-[11px] text-slate-400">{a.departmentId?.name}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {a.reasonForVisit}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={a.status}>{a.status}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        {a.status !== 'Completed' && a.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleStatusUpdate(a._id, 'Completed')}
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 font-semibold"
                          >
                            Complete
                          </button>
                        )}
                        {a.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleStatusUpdate(a._id, 'Cancelled')}
                            className="px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100 font-semibold"
                          >
                            Cancel
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

      {/* Book Appointment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Reception Booking Desk"
      >
        <form onSubmit={handleBook} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Patient *</label>
            <select
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
            >
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.userId?.name} ({p.gender}, Blood: {p.bloodGroup})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Assign Doctor *</label>
            <select
              value={formData.doctorId}
              onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
            >
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.userId?.name} — {d.specialization} (${d.consultationFee})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Available Time Slot {checkingSlots && '...'}
              </label>
              <select
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
              >
                {availableSlots.length === 0 ? (
                  <option value="09:00 - 09:30">09:00 - 09:30</option>
                ) : (
                  availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Reason for Consultation *</label>
            <textarea
              required
              rows={2}
              value={formData.reasonForVisit}
              onChange={(e) => setFormData({ ...formData, reasonForVisit: e.target.value })}
              placeholder="Chief complaints, symptoms..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 disabled:opacity-50"
            >
              {submitting ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AppointmentDesk;

