const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  updateDoctorProfile,
  getDoctorAvailability,
} = require('../controllers/doctor.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/availability', getDoctorAvailability);

router.put('/:id', protect, authorize('admin', 'doctor'), updateDoctorProfile);

module.exports = router;

