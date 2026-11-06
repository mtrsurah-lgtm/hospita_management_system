const mongoose = require('mongoose');

const prescriptionItemSchema = new mongoose.Schema({
  medicine: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, default: 'Once daily' }, // e.g. 1-0-1, Twice daily
  duration: { type: String, required: true }, // e.g. 5 days, 2 weeks
  instructions: { type: String, default: 'After meals' },
});

const labTestSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  status: {
    type: String,
    enum: ['Ordered', 'Sample Collected', 'Completed', 'Cancelled'],
    default: 'Ordered',
  },
  resultDate: { type: Date },
  resultNotes: { type: String, default: '' },
});

const medicalRecordSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient ID is required'],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor ID is required'],
    },
    diagnosis: {
      type: String,
      required: [true, 'Diagnosis is required'],
      trim: true,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    prescriptions: [prescriptionItemSchema],
    labTests: [labTestSchema],
    vitals: {
      bloodPressure: { type: String, default: '' }, // e.g. 120/80 mmHg
      heartRate: { type: String, default: '' }, // bpm
      temperature: { type: String, default: '' }, // F or C
      weight: { type: String, default: '' }, // kg
      respiratoryRate: { type: String, default: '' },
    },
    notes: {
      type: String,
      default: '',
    },
    followUpDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

medicalRecordSchema.index({ patientId: 1, createdAt: -1 });
medicalRecordSchema.index({ doctorId: 1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);

