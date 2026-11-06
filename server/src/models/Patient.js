const mongoose = require('mongoose');

const medicalConditionSchema = new mongoose.Schema({
  condition: { type: String, required: true },
  diagnosedDate: { type: Date, default: Date.now },
  notes: { type: String, default: '' },
});

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required'],
      unique: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, 'Gender is required'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
      default: 'Unknown',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
    },
    emergencyContact: {
      name: { type: String, default: '' },
      relationship: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    medicalHistory: [medicalConditionSchema],
    allergies: {
      type: [String],
      default: [],
    },
    insuranceProvider: {
      type: String,
      default: '',
    },
    insurancePolicyNumber: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

patientSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

patientSchema.set('toObject', { virtuals: true });
patientSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Patient', patientSchema);

