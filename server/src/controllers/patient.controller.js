const Patient = require('../models/Patient');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Get all patients (paginated, search)
// @route   GET /api/patients
// @access  Private (Admin, Staff, Doctor)
const getPatients = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10, bloodGroup } = req.query;
    const query = {};

    if (bloodGroup) {
      query.bloodGroup = bloodGroup;
    }

    let userMatch = {};
    if (search) {
      userMatch = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // If searching by user name/email/phone, find matched user IDs first
    if (search) {
      const matchedUsers = await User.find(userMatch).select('_id');
      const userIds = matchedUsers.map((u) => u._id);
      query.userId = { $in: userIds };
    }

    const total = await Patient.countDocuments(query);
    const patients = await Patient.find(query)
      .populate('userId', 'name email phone avatar createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return successResponse(res, 200, 'Patients retrieved successfully', patients, {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private (Admin, Staff, Doctor, or Self Patient)
const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      'userId',
      'name email phone avatar'
    );

    if (!patient) {
      return errorResponse(res, 404, 'Patient profile not found');
    }

    // Authorization check: If patient role, ensure it's their own profile
    if (
      req.user.role === 'patient' &&
      patient.userId._id.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, 403, 'Unauthorized to view another patient’s file');
    }

    return successResponse(res, 200, 'Patient record retrieved', patient);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a patient record (Staff Desk Walk-in Registration)
// @route   POST /api/patients
// @access  Private (Staff, Admin)
const createPatient = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      emergencyContact,
      allergies,
    } = req.body;

    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return errorResponse(res, 400, 'A user with this email already exists.');
    }

    user = await User.create({
      name,
      email: email.toLowerCase(),
      password: password || 'Hospital@123',
      phone: phone || '',
      role: 'patient',
    });

    const patient = await Patient.create({
      userId: user._id,
      dateOfBirth: dateOfBirth || new Date('1990-01-01'),
      gender: gender || 'Other',
      bloodGroup: bloodGroup || 'Unknown',
      address: address || {},
      emergencyContact: emergencyContact || {},
      allergies: allergies || [],
    });

    const populated = await Patient.findById(patient._id).populate('userId', 'name email phone avatar');

    return successResponse(res, 201, 'Patient registered successfully', populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update patient profile / medical notes
// @route   PUT /api/patients/:id
// @access  Private (Admin, Staff, Doctor, or Patient Self)
const updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return errorResponse(res, 404, 'Patient not found');
    }

    if (
      req.user.role === 'patient' &&
      patient.userId.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, 403, 'Unauthorized to modify another patient profile');
    }

    const {
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      emergencyContact,
      medicalHistory,
      allergies,
      insuranceProvider,
      insurancePolicyNumber,
    } = req.body;

    if (dateOfBirth) patient.dateOfBirth = dateOfBirth;
    if (gender) patient.gender = gender;
    if (bloodGroup) patient.bloodGroup = bloodGroup;
    if (address) patient.address = { ...patient.address, ...address };
    if (emergencyContact) patient.emergencyContact = { ...patient.emergencyContact, ...emergencyContact };
    if (allergies) patient.allergies = allergies;
    if (insuranceProvider !== undefined) patient.insuranceProvider = insuranceProvider;
    if (insurancePolicyNumber !== undefined) patient.insurancePolicyNumber = insurancePolicyNumber;

    if (medicalHistory && Array.isArray(medicalHistory)) {
      patient.medicalHistory = medicalHistory;
    }

    await patient.save();

    const updated = await Patient.findById(patient._id).populate('userId', 'name email phone avatar');
    return successResponse(res, 200, 'Patient record updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get full medical overview of a patient
// @route   GET /api/patients/:id/history
// @access  Private (Doctor, Staff, Admin, or Patient Self)
const getPatientFullHistory = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      'userId',
      'name email phone avatar'
    );

    if (!patient) {
      return errorResponse(res, 404, 'Patient not found');
    }

    if (
      req.user.role === 'patient' &&
      patient.userId._id.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, 403, 'Unauthorized access');
    }

    // Fetch appointments
    const appointments = await Appointment.find({ patientId: patient._id })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' },
      })
      .populate('departmentId', 'name')
      .sort({ appointmentDate: -1 });

    // Fetch medical records / prescriptions
    const records = await MedicalRecord.find({ patientId: patient._id })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name specialization' },
      })
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Full patient history retrieved', {
      patient,
      appointments,
      medicalRecords: records,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  getPatientFullHistory,
};

