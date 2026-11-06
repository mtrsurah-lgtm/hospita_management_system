import React, { useState, useEffect } from 'react';
import { Clock, DollarSign, Calendar, MapPin, CheckCircle, AlertCircle, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const allWeekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AvailabilityManager = () => {
  const { profile, user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [availableDays, setAvailableDays] = useState([]);
  const [consultationFee, setConsultationFee] = useState(50);
  const [roomNumber, setRoomNumber] = useState('');
  const [bio, setBio] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [newSlot, setNewSlot] = useState('');

  useEffect(() => {
    if (profile) {
      setAvailableDays(profile.availableDays || []);
      setConsultationFee(profile.consultationFee || 50);
      setRoomNumber(profile.roomNumber || 'OPD-101');
      setBio(profile.bio || '');
      setTimeSlots(profile.timeSlots || []);
    }
  }, [profile]);

  const toggleDay = (day) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter((d) => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const handleAddSlot = () => {
    if (!newSlot.trim()) return;
    if (timeSlots.includes(newSlot.trim())) return;
    setTimeSlots([...timeSlots, newSlot.trim()]);
    setNewSlot('');
  };

  const handleRemoveSlot = (slot) => {
    setTimeSlots(timeSlots.filter((s) => s !== slot));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!profile?._id) return;
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.put(`/doctors/${profile._id}`, {
        availableDays,
        consultationFee,
        roomNumber,
        bio,
        timeSlots,
      });

      if (res.success) {
        updateUserProfile(user, res.data);
        setMessage({ type: 'success', text: 'Doctor schedule and clinic parameters updated!' });
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to update schedule',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Consultation Schedule & Settings</h2>
        <p className="text-xs text-slate-500 mt-1">
          Define your clinical consultation days, appointment slots, and consulting fees.
        </p>
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

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Working Days Selector */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-blue" />
            Working Consultation Days
          </h3>
          <p className="text-slate-500">Toggle the days you are available to see hospital patients:</p>

          <div className="flex flex-wrap gap-2 pt-1">
            {allWeekdays.map((day) => {
              const selected = availableDays.includes(day);
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2.5 rounded-xl font-bold transition-all ${
                    selected
                      ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots Manager */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-blue" />
            Daily Time Slots
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
              placeholder="e.g. 16:30 - 17:00"
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue w-60"
            />
            <button
              type="button"
              onClick={handleAddSlot}
              className="px-4 py-2 rounded-xl bg-brand-blue text-white font-bold hover:bg-brand-sky transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Slot
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {timeSlots.map((slot) => (
              <span
                key={slot}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-700"
              >
                {slot}
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(slot)}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Consultation Fee & Room */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-brand-blue" />
            Clinic Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Consultation Fee ($ USD)</label>
              <input
                type="number"
                min={0}
                required
                value={consultationFee}
                onChange={(e) => setConsultationFee(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue font-bold text-teal-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Room / OPD Clinic Location</label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="OPD-201, 2nd Floor"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Professional Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Clinical experience, academic background, patient focus..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-brand-blue hover:bg-brand-sky text-white font-bold shadow-md shadow-brand-blue/20 disabled:opacity-50"
          >
            {submitting ? 'Updating...' : 'Save Availability Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AvailabilityManager;

