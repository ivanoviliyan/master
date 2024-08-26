const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskControlller'); // Ensure this path is correct

// Routes for task management
router.post('/create', taskController.createTask);
// Define additional routes as needed, e.g.:
// router.get('/', taskController.getAllTasks);

module.exports = router;
