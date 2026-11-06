import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Stethoscope, Building2, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const BookAppointment = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Choices
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [checkingSlots, setCheckingSlots] = useState(false);
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch departments initially
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await api.get('/departments');
        if (res.success) setDepartments(res.data);
      } catch (err) {
        console.error('Failed to load departments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepts();
  }, []);

  // When department changes, load its doctors
  useEffect(() => {
    if (!selectedDeptId) return;

    const fetchDocs = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/doctors?departmentId=${selectedDeptId}`);
        if (res.success) {
          setDoctors(res.data);
          if (res.data.length > 0) {
            setSelectedDoctor(res.data[0]);
          } else {
            setSelectedDoctor(null);
          }
        }
      } catch (err) {
        console.error('Failed to load doctors for department', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [selectedDeptId]);

  // When doctor or date changes, check slot availability
  useEffect(() => {
    if (!selectedDoctor?._id || !appointmentDate) return;

    const checkSlots = async () => {
      setCheckingSlots(true);
      try {
        const res = await api.get(`/doctors/${selectedDoctor._id}/availability?date=${appointmentDate}`);
        if (res.success && res.data.availableSlots) {
          setAvailableSlots(res.data.availableSlots);
          if (res.data.availableSlots.length > 0) {
            setTimeSlot(res.data.availableSlots[0]);
          } else {
            setTimeSlot('');
          }
        }
      } catch (err) {
        console.error('Failed to check slots', err);
      } finally {
        setCheckingSlots(false);
      }
    };

    checkSlots();
  }, [selectedDoctor, appointmentDate]);

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !timeSlot || !reasonForVisit.trim()) {
      setError('Please fill in all consultation details.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        doctorId: selectedDoctor._id,
        departmentId: selectedDeptId,
        appointmentDate,
        timeSlot,
        reasonForVisit,
        type: 'Consultation',
      };

      const res = await api.post('/appointments', payload);
      if (res.success) {
        navigate('/patient');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to schedule appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && departments.length === 0) {
    return <LoadingSpinner text="Starting appointment wizard..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Book a Medical Consultation</h2>
        <p className="text-xs text-slate-500 mt-1">Follow the 4 simple steps to schedule your specialist visit.</p>
      </div>

      {/* Wizard Progress Bar */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
        <div className={`p-2.5 rounded-xl border ${step >= 1 ? 'bg-brand-blue text-white border-teal-600' : 'bg-white text-slate-400 border-slate-200'}`}>
          1. Department
        </div>
        <div className={`p-2.5 rounded-xl border ${step >= 2 ? 'bg-brand-blue text-white border-teal-600' : 'bg-white text-slate-400 border-slate-200'}`}>
          2. Specialist
        </div>
        <div className={`p-2.5 rounded-xl border ${step >= 3 ? 'bg-brand-blue text-white border-teal-600' : 'bg-white text-slate-400 border-slate-200'}`}>
          3. Slot & Date
        </div>
        <div className={`p-2.5 rounded-xl border ${step >= 4 ? 'bg-brand-blue text-white border-teal-600' : 'bg-white text-slate-400 border-slate-200'}`}>
          4. Confirm
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Select Department */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-blue" />
            Step 1: Choose Medical Department
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {departments.map((d) => (
              <div
                key={d._id}
                onClick={() => setSelectedDeptId(d._id)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedDeptId === d._id
                    ? 'border-teal-600 bg-brand-sky/10/50 shadow-md'
                    : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <h4 className="font-bold text-slate-900 text-sm">{d.name}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{d.description}</p>
                <div className="mt-3 text-[11px] font-semibold text-brand-blue">
                  {d.doctorCount || 1} Doctor(s) Available
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={!selectedDeptId}
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-brand-blue text-white font-bold text-xs hover:bg-brand-sky disabled:opacity-40 flex items-center gap-1.5 transition-all"
            >
              Next: Select Doctor <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Specialist Doctor */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-brand-blue" />
              Step 2: Choose Specialist Doctor
            </h3>
            <button
              onClick={() => setStep(1)}
              className="text-xs text-slate-500 hover:text-brand-blue flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          </div>

          {doctors.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No active doctors in this department currently. Please go back and select another department.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctors.map((doc) => (
                <div
                  key={doc._id}
                  onClick={() => setSelectedDoctor(doc)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                    selectedDoctor?._id === doc._id
                      ? 'border-teal-600 bg-brand-sky/10/50 shadow-md'
                      : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={
                      doc.userId?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.userId?.name || 'Doctor')}&background=2323FF&color=fff`
                    }
                    alt={doc.userId?.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{doc.userId?.name}</h4>
                    <p className="text-xs text-slate-500">{doc.specialization}</p>
                    <div className="mt-2 text-xs font-bold text-brand-blue">
                      Fee: ${doc.consultationFee} • {doc.experienceYears} Yrs Exp
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!selectedDoctor}
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-brand-blue text-white font-bold text-xs hover:bg-brand-sky disabled:opacity-40 flex items-center gap-1.5 transition-all"
            >
              Next: Select Date & Slot <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Select Date & Available Slot */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-blue" />
              Step 3: Select Date & Available Slot
            </h3>
            <button
              onClick={() => setStep(2)}
              className="text-xs text-slate-500 hover:text-brand-blue flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Consultation Date</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue text-slate-800 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Available Time Slots {checkingSlots && '...'}
              </label>
              {availableSlots.length === 0 ? (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs">
                  No open slots on this date. Doctor may not practice on this weekday or all slots are taken.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {availableSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setTimeSlot(slot)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        timeSlot === slot
                          ? 'bg-brand-blue text-white border-teal-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-400'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!timeSlot}
              onClick={() => setStep(4)}
              className="px-6 py-2.5 rounded-xl bg-brand-blue text-white font-bold text-xs hover:bg-brand-sky disabled:opacity-40 flex items-center gap-1.5 transition-all"
            >
              Next: Reason & Confirm <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Reason & Confirmation */}
      {step === 4 && (
        <form onSubmit={handleSubmitBooking} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-blue" />
              Step 4: Consultation Details & Confirmation
            </h3>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="text-xs text-slate-500 hover:text-brand-blue flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          </div>

          {/* Appointment Summary Box */}
          <div className="p-4 bg-brand-sky/10/60 rounded-2xl border border-teal-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Doctor</span>
              <span className="font-bold text-slate-800">{selectedDoctor?.userId?.name}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Specialty</span>
              <span className="font-semibold text-slate-700">{selectedDoctor?.specialization}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Date</span>
              <span className="font-semibold text-slate-700">{appointmentDate}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Slot</span>
              <span className="font-bold text-teal-800">{timeSlot}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Reason for Visit / Chief Symptoms *
            </label>
            <textarea
              required
              rows={3}
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
              placeholder="Describe your current symptoms, how long you have experienced them, or if this is a follow-up visit..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 rounded-xl bg-brand-blue hover:bg-brand-sky text-white font-bold text-xs shadow-lg shadow-teal-600/25 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? 'Confirming...' : 'Confirm Appointment Booking'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookAppointment;

