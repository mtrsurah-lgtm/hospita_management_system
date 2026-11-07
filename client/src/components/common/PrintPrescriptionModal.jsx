import React from 'react';
import { Activity, Printer, X, Heart, Shield } from 'lucide-react';
import Modal from './Modal';

const PrintPrescriptionModal = ({ isOpen, onClose, record }) => {
  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  const patient = record.patientId?.userId || record.patientId || {};
  const patientProfile = record.patientId || {};
  const doctor = record.doctorId?.userId || record.doctorId || {};
  const doctorProfile = record.doctorId || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official Digital Prescription" maxWidth="max-w-3xl">
      <div className="space-y-6 text-slate-800">
        {/* Printable Area */}
        <div id="printable-prescription" className="p-8 bg-white border-2 border-slate-200 rounded-2xl shadow-sm space-y-6">
          {/* Hospital Letterhead Header */}
          <div className="flex items-start justify-between border-b-2 border-teal-600 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black shadow-sm">
                <Activity className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">HOSPITAL MANAGEMENT MEDICAL CENTER</h2>
                <p className="text-[11px] text-slate-500 font-semibold">
                  Multi-Speciality Healthcare & Diagnostic Research • Accreditation Level 1
                </p>
                <p className="text-[10px] text-slate-400">4500 Healthcare Blvd, Medical District, Springfield • +1 (800) 911-HOSP</p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-0.5 rounded bg-teal-50 text-teal-800 font-bold text-xs uppercase border border-teal-200">
                Official Rx Voucher
              </span>
              <p className="text-[11px] text-slate-500 mt-1 font-semibold">
                Date: {new Date(record.createdAt || Date.now()).toLocaleDateString()}
              </p>
              <p className="text-[10px] text-slate-400">Rx ID: {record._id?.slice(-8).toUpperCase()}</p>
            </div>
          </div>

          {/* Doctor & Patient Information Banner */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Consulting Physician</span>
              <p className="font-bold text-slate-900 text-sm">{doctor.name || 'Dr. Medical Specialist'}</p>
              <p className="text-slate-600">{doctorProfile.specialization || 'Consultant Physician'}</p>
              <p className="text-[11px] text-slate-500">Qualifications: {doctorProfile.qualifications?.join(', ') || 'MBBS, MD'}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Patient Details</span>
              <p className="font-bold text-slate-900 text-sm">{patient.name || 'Patient'}</p>
              <p className="text-slate-600">
                Gender: {patientProfile.gender || '—'} • Blood Group: <strong className="text-rose-600">{patientProfile.bloodGroup || '—'}</strong>
              </p>
              <p className="text-[11px] text-slate-500">Phone: {patient.phone || '—'}</p>
            </div>
          </div>

          {/* Vitals Strip */}
          {record.vitals && (
            <div className="grid grid-cols-5 gap-2 text-center text-xs p-3 bg-teal-50 rounded-xl border border-teal-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">BP</span>
                <span className="font-bold text-slate-800">{record.vitals.bloodPressure || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Heart Rate</span>
                <span className="font-bold text-slate-800">{record.vitals.heartRate ? `${record.vitals.heartRate} bpm` : '—'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Temp</span>
                <span className="font-bold text-slate-800">{record.vitals.temperature ? `${record.vitals.temperature} °F` : '—'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Weight</span>
                <span className="font-bold text-slate-800">{record.vitals.weight ? `${record.vitals.weight} kg` : '—'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Respiration</span>
                <span className="font-bold text-slate-800">{record.vitals.respiratoryRate ? `${record.vitals.respiratoryRate} rpm` : '—'}</span>
              </div>
            </div>
          )}

          {/* Clinical Diagnosis */}
          <div className="text-xs">
            <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider block">Clinical Diagnosis</span>
            <p className="text-base font-bold text-slate-900 mt-0.5">{record.diagnosis}</p>
            {record.symptoms && record.symptoms.length > 0 && (
              <p className="text-[11px] text-slate-500 mt-0.5">Symptoms: {record.symptoms.join(', ')}</p>
            )}
          </div>

          {/* Prescribed Medications Table */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-serif font-bold text-teal-800">℞</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Prescribed Medications</span>
            </div>

            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Medicine Name</th>
                  <th className="py-2.5 px-3">Dosage</th>
                  <th className="py-2.5 px-3">Frequency</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {record.prescriptions?.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 font-semibold text-slate-400">{idx + 1}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{p.medicine}</td>
                    <td className="py-2 px-3 text-slate-700">{p.dosage}</td>
                    <td className="py-2 px-3 text-slate-700">{p.frequency}</td>
                    <td className="py-2 px-3 text-slate-700">{p.duration}</td>
                    <td className="py-2 px-3 text-teal-800 font-medium">{p.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Lab Tests & Lifestyle Notes */}
          <div className="grid grid-cols-2 gap-4 text-xs pt-2">
            {record.labTests && record.labTests.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-700 block">Ordered Diagnostics:</span>
                <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5">
                  {record.labTests.map((t, i) => (
                    <li key={i}>{t.testName} ({t.status})</li>
                  ))}
                </ul>
              </div>
            )}

            {record.notes && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-700 block">Doctor Advice:</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">{record.notes}</p>
              </div>
            )}
          </div>

          {/* Doctor Signature & Verification Footer */}
          <div className="pt-8 border-t border-slate-200 flex items-end justify-between text-xs">
            <div className="text-[10px] text-slate-400 space-y-0.5">
              <p>Electronically generated and verified through Hospital Management System (HMS).</p>
              <p>Valid without physical stamp if verified with patient digital ID.</p>
            </div>

            <div className="text-center space-y-1">
              <div className="w-40 border-b border-slate-400 mx-auto" />
              <p className="font-bold text-slate-800">{doctor.name || 'Physician Signature'}</p>
              <p className="text-[10px] text-slate-400">Authorized Medical Practitioner</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors flex items-center gap-1.5 shadow-md shadow-teal-600/20"
          >
            <Printer className="w-4 h-4" />
            Print Official Prescription
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PrintPrescriptionModal;

