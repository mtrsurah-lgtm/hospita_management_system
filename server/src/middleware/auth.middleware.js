const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { errorResponse } = require('../utils/response');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 401, 'Authentication failed. No access token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_hospital_system_secure_2026_xyz');

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return errorResponse(res, 401, 'User associated with this token no longer exists.');
    }

    if (!user.isActive) {
      return errorResponse(res, 403, 'Account has been deactivated. Please contact an administrator.');
    }

    req.user = user;

    // Attach profile ID for Doctors or Patients if applicable
    if (user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ userId: user._id });
      req.doctorProfile = doctorProfile;
    } else if (user.role === 'patient') {
      const patientProfile = await Patient.findOne({ userId: user._id });
      req.patientProfile = patientProfile;
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Session expired. Please log in again.');
    }
    return errorResponse(res, 401, 'Invalid authentication token.');
  }
};

module.exports = { protect };

