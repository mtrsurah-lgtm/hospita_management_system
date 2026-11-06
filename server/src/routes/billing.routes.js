const express = require('express');
const router = express.Router();
const {
  createInvoice,
  getInvoices,
  updatePaymentStatus,
} = require('../controllers/billing.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

router.route('/')
  .get(getInvoices)
  .post(authorize('admin', 'staff'), createInvoice);

router.patch('/:id/payment', authorize('admin', 'staff'), updatePaymentStatus);

module.exports = router;

