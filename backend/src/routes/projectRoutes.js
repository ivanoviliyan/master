const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Define project routes
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.get('/user/:id', projectController.getProjectsForUser);
router.delete('/:projectId/:memberId', projectController.removeTeamMember);
router.put('/:projectId/:userId', projectController.addTeamMember);


module.exports = router;