const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Create a medical record / prescription (EMR)
// @route   POST /api/medical-records
// @access  Private (Doctor, Admin)
const createMedicalRecord = async (req, res, next) => {
  try {
    const {
      appointmentId,
      patientId,
      diagnosis,
      symptoms,
      prescriptions,
      labTests,
      vitals,
      notes,
      followUpDate,
    } = req.body;

    let doctorId = req.body.doctorId;

    if (req.user.role === 'doctor') {
      const doc = await Doctor.findOne({ userId: req.user._id });
      if (!doc) {
        return errorResponse(res, 403, 'Doctor profile not found for active user');
      }
      doctorId = doc._id;
    }

    if (!patientId || !doctorId || !diagnosis) {
      return errorResponse(res, 400, 'Patient, Doctor, and Diagnosis are required');
    }

    const normalizedLabTests = (labTests || []).map((t) =>
      typeof t === 'string' ? { testName: t, status: 'Ordered' } : t
    );

    const record = await MedicalRecord.create({
      appointmentId: appointmentId || null,
      patientId,
      doctorId,
      diagnosis,
      symptoms: symptoms || [],
      prescriptions: prescriptions || [],
      labTests: normalizedLabTests,
      vitals: vitals || {},
      notes: notes || '',
      followUpDate: followUpDate || null,
    });

    // If an appointment was linked, mark the appointment as Completed
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, {
        status: 'Completed',
        notes: `EMR created. Diagnosis: ${diagnosis}`,
      });
    }

    const populated = await MedicalRecord.findById(record._id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone avatar' },
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' },
      });

    return successResponse(res, 201, 'Medical record and prescription created', populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get medical records list (filtered by patient, role)
// @route   GET /api/medical-records
// @access  Private
const getMedicalRecords = async (req, res, next) => {
  try {
    const { patientId, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (patientId) {
      filter.patientId = patientId;
    }

    // Role boundary
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient) return successResponse(res, 200, 'No records found', []);
      filter.patientId = patient._id;
    } else if (req.user.role === 'doctor' && !patientId) {
      const doc = await Doctor.findOne({ userId: req.user._id });
      if (doc) {
        filter.doctorId = doc._id;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await MedicalRecord.countDocuments(filter);

    const records = await MedicalRecord.find(filter)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone avatar' },
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' },
      })
      .populate('appointmentId', 'appointmentDate timeSlot')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return successResponse(res, 200, 'Medical records retrieved', records, {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single medical record
// @route   GET /api/medical-records/:id
// @access  Private
const getMedicalRecordById = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone avatar dateOfBirth bloodGroup' },
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' },
      })
      .populate('appointmentId');

    if (!record) {
      return errorResponse(res, 404, 'Medical record not found');
    }

    // Role check
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient || record.patientId._id.toString() !== patient._id.toString()) {
        return errorResponse(res, 403, 'Unauthorized access to record');
      }
    }

    return successResponse(res, 200, 'Medical record retrieved', record);
  } catch (error) {
    next(error);
  }
};

// @desc    Update medical record
// @route   PUT /api/medical-records/:id
// @access  Private (Doctor, Admin)
const updateMedicalRecord = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) {
      return errorResponse(res, 404, 'Medical record not found');
    }

    // Role and ownership check: Doctors can only update their own clinical records
    if (req.user.role === 'doctor') {
      const doc = await Doctor.findOne({ userId: req.user._id });
      if (!doc || record.doctorId.toString() !== doc._id.toString()) {
        return errorResponse(
          res,
          403,
          'Unauthorized. Doctors can only update their own authored medical records.'
        );
      }
    }

    const { diagnosis, symptoms, prescriptions, labTests, vitals, notes, followUpDate } = req.body;

    if (diagnosis) record.diagnosis = diagnosis;
    if (symptoms) record.symptoms = symptoms;
    if (prescriptions) record.prescriptions = prescriptions;
    if (labTests) {
      record.labTests = labTests.map((t) =>
        typeof t === 'string' ? { testName: t, status: 'Ordered' } : t
      );
    }
    if (vitals) record.vitals = { ...record.vitals, ...vitals };
    if (notes !== undefined) record.notes = notes;
    if (followUpDate !== undefined) record.followUpDate = followUpDate;

    await record.save();

    return successResponse(res, 200, 'Medical record updated', record);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
};

