const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const appearanceController = require('../controllers/appearanceController');
const { requireAuth } = require('../middleware/auth');

router.get('/', settingsController.getSettings);
router.put('/', requireAuth, settingsController.updateSettings);
router.get('/appearance', appearanceController.getAppearance);
router.put('/appearance', requireAuth, appearanceController.updateAppearance);

module.exports = router;
