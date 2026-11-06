import React, { useState, useEffect } from 'react';
import { History, Heart, Shield, Phone, MapPin, Calendar, Clock, AlertTriangle, Activity } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MedicalHistory = () => {
  const { profile } = useAuth();
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?._id) return;

    const fetchHistory = async () => {
      try {
        const res = await api.get(`/patients/${profile._id}/history`);
        if (res.success) setHistoryData(res.data);
      } catch (err) {
        console.error('Failed to load patient history', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [profile]);

  if (loading) {
    return <LoadingSpinner text="Retrieving comprehensive health profile..." />;
  }

  const patient = historyData?.patient || profile;
  const appointments = historyData?.appointments || [];
  const records = historyData?.medicalRecords || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Personal Health File & History</h2>
        <p className="text-xs text-slate-500 mt-1">
          Complete medical record timeline, chronic indicators, allergies, and diagnostic history.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue block">Demographics</span>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{patient?.userId?.name}</h3>
            <p className="text-xs text-slate-500">{patient?.userId?.email}</p>
          </div>
          <div className="text-xs space-y-1 text-slate-600">
            <p><strong>DOB:</strong> {patient?.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : '—'}</p>
            <p><strong>Gender:</strong> {patient?.gender}</p>
            <p><strong>Contact:</strong> {patient?.userId?.phone || '—'}</p>
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block">Critical Medical Alert</span>
          <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Blood Group</span>
              <span className="text-base font-black text-rose-600">{patient?.bloodGroup}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700 block">Allergies:</span>
              <p className="text-rose-700 font-semibold mt-0.5">
                {patient?.allergies?.length ? patient.allergies.join(', ') : 'None documented'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block">Emergency & Coverage</span>
          <div className="text-xs space-y-1 text-slate-600">
            <p><strong>Emergency Contact:</strong> {patient?.emergencyContact?.name || '—'}</p>
            <p><strong>Relationship:</strong> {patient?.emergencyContact?.relationship || '—'}</p>
            <p><strong>Phone:</strong> {patient?.emergencyContact?.phone || '—'}</p>
            <p className="pt-2"><strong>Insurance:</strong> {patient?.insuranceProvider || 'Self-Pay'}</p>
          </div>
        </div>
      </div>

      {/* Past Visits Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
          <History className="w-5 h-5 text-brand-blue" />
          Clinical Visits Timeline
        </h3>

        {appointments.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No past consultations recorded.</p>
        ) : (
          <div className="relative border-l-2 border-teal-200 ml-4 space-y-8 pl-6">
            {appointments.map((a) => (
              <div key={a._id} className="relative">
                {/* Dot */}
                <div className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-brand-blue border-2 border-white shadow-sm" />

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {a.reasonForVisit}
                    </h4>
                    <span className="text-xs text-slate-500 font-semibold">
                      {new Date(a.appointmentDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {a.timeSlot}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Physician: <strong className="text-slate-800">{a.doctorId?.userId?.name}</strong> • {a.departmentId?.name}
                  </p>

                  <div className="pt-2 flex items-center gap-2">
                    <Badge variant={a.status}>{a.status}</Badge>
                    {a.notes && <span className="text-[11px] text-slate-500 italic">"{a.notes}"</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;

