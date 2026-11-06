const express = require('express');
const router = express.Router();
const {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  getPatientFullHistory,
} = require('../controllers/patient.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

router.route('/')
  .get(authorize('admin', 'staff', 'doctor'), getPatients)
  .post(authorize('admin', 'staff'), createPatient);

router.route('/:id')
  .get(getPatientById)
  .put(updatePatient);

router.get('/:id/history', getPatientFullHistory);

module.exports = router;

