const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      trim: true,
    },
    wardType: {
      type: String,
      enum: ['General Ward', 'Semi-Private', 'Private Suite', 'ICU', 'Emergency ER'],
      default: 'General Ward',
    },
    floor: {
      type: Number,
      default: 1,
    },
    dailyRate: {
      type: Number,
      required: true,
      default: 100,
    },
    status: {
      type: String,
      enum: ['Available', 'Occupied', 'Maintenance'],
      default: 'Available',
    },
    currentPatient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      default: null,
    },
    admissionDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

roomSchema.index({ status: 1 });
roomSchema.index({ wardType: 1 });

module.exports = mongoose.model('Room', roomSchema);

