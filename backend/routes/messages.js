const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, messagesController.getAll);
router.post('/', messagesController.create);
router.put('/:id/status', requireAuth, messagesController.updateStatus);
router.delete('/:id', requireAuth, messagesController.delete);

module.exports = router;
