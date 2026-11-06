const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Get all users (filtered by role, search)
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return successResponse(res, 200, 'Users retrieved successfully', users, {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a user (Staff / Doctor / Admin / Patient)
// @route   POST /api/users
// @access  Private (Admin)
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, departmentId, specialization, consultationFee } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 400, 'User with this email already exists');
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'staff',
      phone: phone || '',
    });

    let extraProfile = null;

    if (role === 'doctor') {
      if (!departmentId || !specialization) {
        return errorResponse(res, 400, 'Department and specialization are required for doctor accounts');
      }
      extraProfile = await Doctor.create({
        userId: user._id,
        departmentId,
        specialization,
        consultationFee: consultationFee || 50,
      });
    } else if (role === 'patient') {
      extraProfile = await Patient.create({
        userId: user._id,
        dateOfBirth: req.body.dateOfBirth || new Date('1990-01-01'),
        gender: req.body.gender || 'Other',
        bloodGroup: req.body.bloodGroup || 'Unknown',
      });
    }

    return successResponse(res, 201, 'User created successfully', {
      user,
      profile: extraProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (Active / Inactive)
// @route   PATCH /api/users/:id/status
// @access  Private (Admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    if (user._id.toString() === req.user._id.toString()) {
      return errorResponse(res, 400, 'You cannot deactivate your own account.');
    }

    user.isActive = !user.isActive;
    await user.save();

    return successResponse(res, 200, `User account ${user.isActive ? 'activated' : 'deactivated'} successfully`, user);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    if (user._id.toString() === req.user._id.toString()) {
      return errorResponse(res, 400, 'You cannot delete your own account.');
    }

    // Clean up profile models
    if (user.role === 'doctor') {
      await Doctor.deleteOne({ userId: user._id });
    } else if (user.role === 'patient') {
      await Patient.deleteOne({ userId: user._id });
    }

    await User.findByIdAndDelete(user._id);

    return successResponse(res, 200, 'User and associated data removed successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  toggleUserStatus,
  deleteUser,
};

