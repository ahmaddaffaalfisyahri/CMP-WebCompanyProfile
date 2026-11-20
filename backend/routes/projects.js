const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');
const { requireAuth } = require('../middleware/auth');

router.get('/', projectsController.getAllProjects);
router.get('/:id', projectsController.getProjectById);
router.post('/', requireAuth, projectsController.createProject);
router.put('/:id', requireAuth, projectsController.updateProject);
router.delete('/:id', requireAuth, projectsController.deleteProject);

module.exports = router;
