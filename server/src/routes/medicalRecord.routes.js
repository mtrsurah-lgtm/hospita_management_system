const express = require('express');
const router = express.Router();
const {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
} = require('../controllers/medicalRecord.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

router.route('/')
  .get(getMedicalRecords)
  .post(authorize('doctor', 'admin'), createMedicalRecord);

router.route('/:id')
  .get(getMedicalRecordById)
  .put(authorize('doctor', 'admin'), updateMedicalRecord);

module.exports = router;

