const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Department = require('../models/Department');
const Appointment = require('../models/Appointment');
const Billing = require('../models/Billing');
const { successResponse } = require('../utils/response');

// @desc    Get system-wide overview statistics
// @route   GET /api/analytics/overview
// @access  Private (Admin, Staff)
const getSystemOverview = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      totalPatients,
      totalDoctors,
      totalStaff,
      totalDepartments,
      todayAppointments,
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      cancelledAppointments,
      billingAggregate,
    ] = await Promise.all([
      Patient.countDocuments(),
      Doctor.countDocuments(),
      User.countDocuments({ role: 'staff' }),
      Department.countDocuments(),
      Appointment.countDocuments({ appointmentDate: { $gte: todayStart, $lte: todayEnd } }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'Completed' }),
      Appointment.countDocuments({ status: 'Pending' }),
      Appointment.countDocuments({ status: 'Cancelled' }),
      Billing.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$paidAmount' },
            totalInvoiced: { $sum: '$totalAmount' },
          },
        },
      ]),
    ]);

    const revenue = billingAggregate[0] || { totalRevenue: 0, totalInvoiced: 0 };

    // Doctors by department
    const departments = await Department.find().select('name').lean();
    const deptDistribution = await Promise.all(
      departments.map(async (dept) => {
        const count = await Doctor.countDocuments({ departmentId: dept._id });
        return {
          name: dept.name,
          doctorCount: count,
        };
      })
    );

    // Recent 5 appointments
    const recentAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name' },
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' },
      })
      .populate('departmentId', 'name');

    return successResponse(res, 200, 'Analytics retrieved', {
      counts: {
        patients: totalPatients,
        doctors: totalDoctors,
        staff: totalStaff,
        departments: totalDepartments,
        todayAppointments,
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        cancelledAppointments,
      },
      financials: {
        totalRevenue: revenue.totalRevenue,
        totalInvoiced: revenue.totalInvoiced,
        pendingCollection: Math.max(0, revenue.totalInvoiced - revenue.totalRevenue),
      },
      deptDistribution,
      recentAppointments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSystemOverview,
};

