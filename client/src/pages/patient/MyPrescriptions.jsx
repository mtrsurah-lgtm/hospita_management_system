import React, { useState, useEffect } from 'react';
import { FileText, Heart, Calendar, Stethoscope, Clock, Activity, Printer } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PrintPrescriptionModal from '../../components/common/PrintPrescriptionModal';

const MyPrescriptions = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePrintRecord, setActivePrintRecord] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await api.get('/medical-records');
        if (res.success) setRecords(res.data);
      } catch (err) {
        console.error('Failed to load prescriptions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Retrieving digital prescriptions..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">My Digital Prescriptions</h2>
        <p className="text-xs text-slate-500 mt-1">
          Review your doctor's clinical diagnoses, prescribed medications, intake dosages, and laboratory test orders.
        </p>
      </div>

      {records.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No prescriptions found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Prescriptions issued by your physician during clinic visits will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {records.map((record) => (
            <div
              key={record._id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden"
            >
              {/* Prescription Header */}
              <div className="bg-gradient-to-r from-teal-800 to-slate-900 px-6 py-4 text-white flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600/20 text-teal-300 border border-teal-600/30 flex items-center justify-center font-bold">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{record.diagnosis}</h3>
                    <p className="text-xs text-teal-200">
                      Prescribed by {record.doctorId?.userId?.name || 'Physician'}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-300 flex items-center gap-3">
                  <span>Date: {new Date(record.createdAt).toLocaleDateString()}</span>
                  <button
                    onClick={() => setActivePrintRecord(record)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all shadow-sm active:scale-95"
                    title="View & Print Official Slip"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Rx</span>
                  </button>
                </div>
              </div>

              {/* Vitals & Summary Strip */}
              {record.vitals && (
                <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex flex-wrap gap-4 text-xs text-slate-600">
                  {record.vitals.bloodPressure && (
                    <span><strong>BP:</strong> {record.vitals.bloodPressure}</span>
                  )}
                  {record.vitals.heartRate && (
                    <span><strong>Pulse:</strong> {record.vitals.heartRate} bpm</span>
                  )}
                  {record.vitals.temperature && (
                    <span><strong>Temp:</strong> {record.vitals.temperature} °F</span>
                  )}
                  {record.vitals.weight && (
                    <span><strong>Weight:</strong> {record.vitals.weight} kg</span>
                  )}
                </div>
              )}

              {/* Prescriptions Table */}
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Medications & Regimen
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                        <tr>
                          <th className="py-2.5 px-3">Medicine</th>
                          <th className="py-2.5 px-3">Dosage</th>
                          <th className="py-2.5 px-3">Frequency</th>
                          <th className="py-2.5 px-3">Duration</th>
                          <th className="py-2.5 px-3">Instructions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {record.prescriptions?.map((p, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 font-bold text-teal-900">{p.medicine}</td>
                            <td className="py-2.5 px-3 text-slate-700">{p.dosage}</td>
                            <td className="py-2.5 px-3 text-slate-700">{p.frequency}</td>
                            <td className="py-2.5 px-3 text-slate-700">{p.duration}</td>
                            <td className="py-2.5 px-3 text-slate-600 font-medium">{p.instructions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Lab Tests & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {record.labTests && record.labTests.length > 0 && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                      <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                        Ordered Diagnostics / Lab Tests
                      </span>
                      <ul className="space-y-1 text-slate-600">
                        {record.labTests.map((test, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>• {test.testName}</span>
                            <span className="font-bold text-teal-600">{test.status}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {record.notes && (
                    <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 space-y-1 text-xs">
                      <span className="font-bold text-teal-800 uppercase tracking-wider text-[11px] block">
                        Physician Advice & Lifestyle Notes
                      </span>
                      <p className="text-slate-600 leading-relaxed">{record.notes}</p>
                    </div>
                  )}
                </div>

                {record.followUpDate && (
                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span>
                      Recommended Follow-Up Date:{' '}
                      <strong className="text-slate-800">
                        {new Date(record.followUpDate).toLocaleDateString()}
                      </strong>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Official Printable Prescription Modal */}
      <PrintPrescriptionModal
        isOpen={!!activePrintRecord}
        onClose={() => setActivePrintRecord(null)}
        record={activePrintRecord}
      />
    </div>
  );
};

export default MyPrescriptions;

