const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Get all doctors (filtered by department, search)
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res, next) => {
  try {
    const { departmentId, search, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (departmentId) {
      filter.departmentId = departmentId;
    }

    if (search) {
      filter.$or = [
        { specialization: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Doctor.countDocuments(filter);
    const doctors = await Doctor.find(filter)
      .populate('userId', 'name email phone avatar isActive')
      .populate('departmentId', 'name icon')
      .skip(skip)
      .limit(parseInt(limit));

    // Filter out inactive user accounts if populated
    const activeDoctors = doctors.filter((doc) => doc.userId && doc.userId.isActive);

    return successResponse(res, 200, 'Doctors retrieved successfully', activeDoctors, {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'name email phone avatar')
      .populate('departmentId', 'name icon description');

    if (!doctor) {
      return errorResponse(res, 404, 'Doctor not found');
    }

    return successResponse(res, 200, 'Doctor profile retrieved', doctor);
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor profile / schedules
// @route   PUT /api/doctors/:id
// @access  Private (Doctor or Admin)
const updateDoctorProfile = async (req, res, next) => {
  try {
    let doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return errorResponse(res, 404, 'Doctor profile not found');
    }

    // Role check: Only admin or the doctor themselves can update
    if (
      req.user.role !== 'admin' &&
      doctor.userId.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, 403, 'Unauthorized to update this doctor profile');
    }

    const {
      specialization,
      qualifications,
      experienceYears,
      consultationFee,
      availableDays,
      timeSlots,
      bio,
      roomNumber,
      departmentId,
    } = req.body;

    if (specialization) doctor.specialization = specialization;
    if (qualifications) doctor.qualifications = qualifications;
    if (experienceYears !== undefined) doctor.experienceYears = experienceYears;
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
    if (availableDays) doctor.availableDays = availableDays;
    if (timeSlots) doctor.timeSlots = timeSlots;
    if (bio !== undefined) doctor.bio = bio;
    if (roomNumber) doctor.roomNumber = roomNumber;
    if (departmentId && req.user.role === 'admin') doctor.departmentId = departmentId;

    await doctor.save();

    const updated = await Doctor.findById(doctor._id)
      .populate('userId', 'name email phone avatar')
      .populate('departmentId', 'name icon');

    return successResponse(res, 200, 'Doctor profile updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor slot availability for a date
// @route   GET /api/doctors/:id/availability
// @access  Public / Private
const getDoctorAvailability = async (req, res, next) => {
  try {
    const { date } = req.query; // YYYY-MM-DD
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return errorResponse(res, 404, 'Doctor not found');
    }

    if (!date) {
      return successResponse(res, 200, 'General availability schedule', {
        availableDays: doctor.availableDays,
        timeSlots: doctor.timeSlots,
      });
    }

    // Check weekday
    const targetDate = new Date(date);
    const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' });

    const isAvailableDay = doctor.availableDays.includes(dayName);

    if (!isAvailableDay) {
      return successResponse(res, 200, `Doctor does not consult on ${dayName}s`, {
        isAvailableDay: false,
        availableSlots: [],
        dayName,
      });
    }

    // Find booked appointments on this date that are not cancelled
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctorId: doctor._id,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['Pending', 'Confirmed'] },
    }).select('timeSlot');

    const bookedSlots = bookedAppointments.map((b) => b.timeSlot);
    const slotStatus = doctor.timeSlots.map((slot) => ({
      slot,
      isBooked: bookedSlots.includes(slot),
    }));

    return successResponse(res, 200, 'Doctor availability for date', {
      isAvailableDay: true,
      dayName,
      slots: slotStatus,
      availableSlots: slotStatus.filter((s) => !s.isBooked).map((s) => s.slot),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  updateDoctorProfile,
  getDoctorAvailability,
};

