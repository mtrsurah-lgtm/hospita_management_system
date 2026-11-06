const express = require('express');
const router = express.Router();
const { getSystemOverview } = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);
router.use(authorize('admin', 'staff'));

router.get('/overview', getSystemOverview);

module.exports = router;

