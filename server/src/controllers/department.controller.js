const Department = require('../models/Department');
const Doctor = require('../models/Doctor');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Get all active departments
// @route   GET /api/departments
// @access  Public
const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({ isActive: true })
      .populate({
        path: 'headDoctor',
        populate: { path: 'userId', select: 'name email avatar' },
      })
      .lean();

    // Attach doctor count to each department
    const departmentsWithCounts = await Promise.all(
      departments.map(async (dept) => {
        const doctorCount = await Doctor.countDocuments({ departmentId: dept._id });
        return {
          ...dept,
          doctorCount,
        };
      })
    );

    return successResponse(res, 200, 'Departments retrieved successfully', departmentsWithCounts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single department with its doctors
// @route   GET /api/departments/:id
// @access  Public
const getDepartmentById = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id).populate({
      path: 'headDoctor',
      populate: { path: 'userId', select: 'name email phone avatar' },
    });

    if (!department) {
      return errorResponse(res, 404, 'Department not found');
    }

    const doctors = await Doctor.find({ departmentId: department._id }).populate(
      'userId',
      'name email phone avatar'
    );

    return successResponse(res, 200, 'Department details retrieved', {
      department,
      doctors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create department
// @route   POST /api/departments
// @access  Private (Admin)
const createDepartment = async (req, res, next) => {
  try {
    const { name, description, headDoctor, icon, image } = req.body;

    const existing = await Department.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return errorResponse(res, 400, 'A department with this name already exists.');
    }

    const department = await Department.create({
      name,
      description,
      headDoctor: headDoctor || null,
      icon: icon || 'Activity',
      image: image || '',
    });

    return successResponse(res, 201, 'Department created successfully', department);
  } catch (error) {
    next(error);
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin)
const updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!department) {
      return errorResponse(res, 404, 'Department not found');
    }

    return successResponse(res, 200, 'Department updated successfully', department);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete / Deactivate department
// @route   DELETE /api/departments/:id
// @access  Private (Admin)
const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return errorResponse(res, 404, 'Department not found');
    }

    const doctorCount = await Doctor.countDocuments({ departmentId: department._id });
    if (doctorCount > 0) {
      return errorResponse(
        res,
        400,
        `Cannot delete department with ${doctorCount} active doctor(s) assigned. Reassign them first.`
      );
    }

    await Department.findByIdAndDelete(department._id);

    return successResponse(res, 200, 'Department deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};

