const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  rescheduleAppointment,
} = require('../controllers/appointment.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

router.route('/')
  .get(getAppointments)
  .post(bookAppointment);

router.route('/:id')
  .get(getAppointmentById);

router.patch('/:id/status', updateAppointmentStatus);
router.patch('/:id/reschedule', authorize('admin', 'staff', 'doctor'), rescheduleAppointment);

module.exports = router;

