const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient, Staff, Admin)
const bookAppointment = async (req, res, next) => {
  try {
    let { patientId, doctorId, departmentId, appointmentDate, timeSlot, reasonForVisit, type } = req.body;

    // If patient is booking, use their own profile ID
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient) {
        return errorResponse(res, 404, 'Patient profile not found. Please complete profile.');
      }
      patientId = patient._id;
    }

    if (!patientId || !doctorId || !appointmentDate || !timeSlot || !reasonForVisit) {
      return errorResponse(res, 400, 'All appointment fields are required.');
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return errorResponse(res, 404, 'Doctor not found');
    }

    const selectedDeptId = departmentId || doctor.departmentId;

    // Ensure slot is not already booked
    const targetDate = new Date(appointmentDate);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingConflict = await Appointment.findOne({
      doctorId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      timeSlot,
      status: { $in: ['Pending', 'Confirmed'] },
    });

    if (existingConflict) {
      return errorResponse(res, 400, `Time slot ${timeSlot} is already booked for this doctor on this day. Please select another slot.`);
    }

    // Determine token number for today
    const appointmentCountToday = await Appointment.countDocuments({
      doctorId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
    });

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      departmentId: selectedDeptId,
      appointmentDate: startOfDay,
      timeSlot,
      reasonForVisit,
      type: type || 'Consultation',
      status: 'Confirmed', // Auto-confirm for clinic workflow
      tokenNumber: appointmentCountToday + 1,
    });

    const populated = await Appointment.findById(appointment._id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone avatar' },
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone avatar' },
      })
      .populate('departmentId', 'name icon');

    return successResponse(res, 201, 'Appointment booked successfully', populated);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 400, `Time slot ${req.body.timeSlot} is already booked for this doctor on this day. Please select another slot.`);
    }
    next(error);
  }
};

// @desc    Get appointments list (Role-filtered)
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res, next) => {
  try {
    const { status, date, page = 1, limit = 15 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      query.appointmentDate = { $gte: startOfDay, $lte: endOfDay };
    }

    // Role-based boundary enforcement
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient) return successResponse(res, 200, 'No appointments', []);
      query.patientId = patient._id;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (!doctor) return successResponse(res, 200, 'No appointments', []);
      query.doctorId = doctor._id;
    }
    // Admin and Staff can see all appointments without restriction

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Appointment.countDocuments(query);

    const appointments = await Appointment.find(query)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone avatar' },
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone avatar' },
      })
      .populate('departmentId', 'name icon')
      .sort({ appointmentDate: -1, timeSlot: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    return successResponse(res, 200, 'Appointments retrieved successfully', appointments, {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone avatar' },
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone avatar' },
      })
      .populate('departmentId', 'name icon');

    if (!appointment) {
      return errorResponse(res, 404, 'Appointment not found');
    }

    // Role-based ownership verification
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient || appointment.patientId?._id?.toString() !== patient._id.toString()) {
        return errorResponse(res, 403, 'Unauthorized to view another patient’s appointment');
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (!doctor || appointment.doctorId?._id?.toString() !== doctor._id.toString()) {
        return errorResponse(res, 403, 'Unauthorized to view appointments assigned to other doctors');
      }
    }

    return successResponse(res, 200, 'Appointment details', appointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (Confirm, Complete, Cancel)
// @route   PATCH /api/appointments/:id/status
// @access  Private (Doctor, Staff, Admin, Patient cancel only)
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return errorResponse(res, 400, 'Invalid appointment status');
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return errorResponse(res, 404, 'Appointment not found');
    }

    // Role-specific check
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!patient || appointment.patientId.toString() !== patient._id.toString()) {
        return errorResponse(res, 403, 'Unauthorized to modify this appointment');
      }
      if (status !== 'Cancelled') {
        return errorResponse(res, 403, 'Patients can only cancel their appointments.');
      }
    }

    appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;
    await appointment.save();

    const updated = await Appointment.findById(appointment._id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' },
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' },
      })
      .populate('departmentId', 'name');

    return successResponse(res, 200, `Appointment status updated to ${status}`, updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Reschedule appointment date/time
// @route   PATCH /api/appointments/:id/reschedule
// @access  Private (Staff, Admin, Doctor)
const rescheduleAppointment = async (req, res, next) => {
  try {
    const { appointmentDate, timeSlot } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return errorResponse(res, 404, 'Appointment not found');
    }

    const targetDate = new Date(appointmentDate);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const conflict = await Appointment.findOne({
      _id: { $ne: appointment._id },
      doctorId: appointment.doctorId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      timeSlot,
      status: { $in: ['Pending', 'Confirmed'] },
    });

    if (conflict) {
      return errorResponse(res, 400, `Slot ${timeSlot} on this date is already booked.`);
    }

    appointment.appointmentDate = startOfDay;
    appointment.timeSlot = timeSlot;
    appointment.status = 'Confirmed';
    await appointment.save();

    return successResponse(res, 200, 'Appointment rescheduled successfully', appointment);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 400, `Slot ${req.body.timeSlot} on this date is already booked.`);
    }
    next(error);
  }
};

module.exports = {
  bookAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  rescheduleAppointment,
};

