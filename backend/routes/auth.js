const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.post('/login', authController.login);
router.get('/verify', authController.verify);
router.get('/profile', requireAuth, authController.getProfile);
router.put('/update-profile', requireAuth, authController.updateProfile);
router.post('/logout', authController.logout);

module.exports = router;
