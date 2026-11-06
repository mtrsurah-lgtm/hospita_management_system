import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FileText, Plus, Trash2, Heart, Activity, CheckCircle, AlertCircle, Calendar, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PatientEMR = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const appointmentId = searchParams.get('appointmentId') || '';
  const initialPatientId = searchParams.get('patientId') || '';

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form State
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [vitals, setVitals] = useState({
    bloodPressure: '120/80',
    heartRate: '75',
    temperature: '98.6',
    weight: '70',
    respiratoryRate: '16',
  });
  const [prescriptions, setPrescriptions] = useState([
    {
      medicine: '',
      dosage: '1 tablet',
      frequency: 'Once daily',
      duration: '5 days',
      instructions: 'After meals',
    },
  ]);
  const [labTests, setLabTests] = useState([
    { testName: '', status: 'Ordered', resultNotes: '' },
  ]);
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  // Fetch all patients for selection if not preselected
  useEffect(() => {
    const fetchPatientList = async () => {
      try {
        const res = await api.get('/patients?limit=50');
        if (res.success) setPatients(res.data);
      } catch (err) {
        console.error('Failed to load patient directory', err);
      }
    };
    fetchPatientList();
  }, []);

  // Fetch selected patient's full medical file
  useEffect(() => {
    if (!selectedPatientId) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/patients/${selectedPatientId}/history`);
        if (res.success) {
          setPatientData(res.data);
        }
      } catch (err) {
        console.error('Failed to load patient history', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [selectedPatientId]);

  const handleAddPrescriptionRow = () => {
    setPrescriptions([
      ...prescriptions,
      {
        medicine: '',
        dosage: '1 tablet',
        frequency: 'Twice daily',
        duration: '7 days',
        instructions: 'After meals',
      },
    ]);
  };

  const handleRemovePrescriptionRow = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const handlePrescriptionChange = (index, field, value) => {
    const updated = [...prescriptions];
    updated[index][field] = value;
    setPrescriptions(updated);
  };

  const handleAddLabTest = () => {
    setLabTests([...labTests, { testName: '', status: 'Ordered', resultNotes: '' }]);
  };

  const handleRemoveLabTest = (index) => {
    setLabTests(labTests.filter((_, i) => i !== index));
  };

  const handleLabTestChange = (index, field, value) => {
    const updated = [...labTests];
    updated[index][field] = value;
    setLabTests(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatientId || !diagnosis.trim()) {
      setMessage({ type: 'error', text: 'Please select a patient and enter a clinical diagnosis.' });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        appointmentId: appointmentId || undefined,
        patientId: selectedPatientId,
        diagnosis,
        symptoms: symptoms.split(',').map((s) => s.trim()).filter(Boolean),
        vitals,
        prescriptions: prescriptions.filter((p) => p.medicine.trim() !== ''),
        labTests: labTests.filter((t) => t.testName.trim() !== ''),
        notes,
        followUpDate: followUpDate || undefined,
      };

      const res = await api.post('/medical-records', payload);
      if (res.success) {
        setMessage({
          type: 'success',
          text: 'EMR consultation and prescription saved successfully! The appointment has been marked as Completed.',
        });
        setTimeout(() => {
          navigate('/doctor/appointments');
        }, 1500);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to save medical record',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-brand-blue mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back
          </button>
          <h2 className="text-2xl font-extrabold text-slate-900">Clinical EMR & Prescription Builder</h2>
          <p className="text-xs text-slate-500 mt-0.5">Author digital consultation notes, record vital indicators, and prescribe medications.</p>
        </div>
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

      {/* Patient Selector & Info Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Select Patient File
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="w-full sm:w-96 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-blue bg-white"
          >
            <option value="">-- Choose a patient --</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.userId?.name} ({p.gender}, Blood: {p.bloodGroup})
              </option>
            ))}
          </select>
        </div>

        {patientData && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Name</span>
              <span className="font-bold text-slate-800">{patientData.patient?.userId?.name}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Group</span>
              <span className="font-bold text-rose-600">{patientData.patient?.bloodGroup}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Known Allergies</span>
              <span className="font-semibold text-slate-700">
                {patientData.patient?.allergies?.join(', ') || 'No known allergies'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone</span>
              <span className="font-semibold text-slate-700">{patientData.patient?.userId?.phone || '—'}</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vitals Recording Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-blue" />
            Patient Vitals
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Blood Pressure</label>
              <input
                type="text"
                value={vitals.bloodPressure}
                onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                placeholder="120/80 mmHg"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Heart Rate (bpm)</label>
              <input
                type="text"
                value={vitals.heartRate}
                onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                placeholder="72"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Temperature (°F)</label>
              <input
                type="text"
                value={vitals.temperature}
                onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                placeholder="98.6"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Weight (kg)</label>
              <input
                type="text"
                value={vitals.weight}
                onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                placeholder="70"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Respiration (rpm)</label>
              <input
                type="text"
                value={vitals.respiratoryRate}
                onChange={(e) => setVitals({ ...vitals, respiratoryRate: e.target.value })}
                placeholder="16"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Clinical Assessment Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-blue" />
            Diagnosis & Clinical Assessment
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Primary Diagnosis *</label>
              <input
                type="text"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Acute Bronchitis, Essential Hypertension"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Symptoms (comma separated)</label>
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Fever, dry cough, fatigue"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Digital Prescription Builder */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-4 h-4 text-brand-blue" />
              Medication Prescriptions
            </h3>
            <button
              type="button"
              onClick={handleAddPrescriptionRow}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-sky/10 text-brand-blue text-xs font-bold hover:bg-brand-sky/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Medicine
            </button>
          </div>

          <div className="space-y-3">
            {prescriptions.map((p, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Medicine Name</label>
                  <input
                    type="text"
                    required
                    value={p.medicine}
                    onChange={(e) => handlePrescriptionChange(idx, 'medicine', e.target.value)}
                    placeholder="e.g. Amoxicillin 500mg"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={p.dosage}
                    onChange={(e) => handlePrescriptionChange(idx, 'dosage', e.target.value)}
                    placeholder="1 tablet"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Frequency</label>
                  <input
                    type="text"
                    value={p.frequency}
                    onChange={(e) => handlePrescriptionChange(idx, 'frequency', e.target.value)}
                    placeholder="Twice daily"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Duration</label>
                  <input
                    type="text"
                    value={p.duration}
                    onChange={(e) => handlePrescriptionChange(idx, 'duration', e.target.value)}
                    placeholder="7 days"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Instructions</label>
                  <input
                    type="text"
                    value={p.instructions}
                    onChange={(e) => handlePrescriptionChange(idx, 'instructions', e.target.value)}
                    placeholder="After food"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div className="sm:col-span-1 text-right sm:pt-4">
                  <button
                    type="button"
                    onClick={() => handleRemovePrescriptionRow(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes & Follow Up */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Doctor Advice / Lifestyle Notes</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Drink plenty of fluids, rest, avoid strenuous activities..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Recommended Follow-up Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 rounded-xl bg-brand-blue hover:bg-brand-sky text-white font-bold text-sm shadow-lg shadow-teal-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            {submitting ? 'Finalizing Record...' : 'Complete Consultation & Issue EMR'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientEMR;

