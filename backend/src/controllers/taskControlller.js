const Task = require('../models/TaskModel');
const Project = require('../models/projectModel');

// Create a new task
const createTask = async (req, res) => {
    try {
        const { userid, projectid, task, startTime, endTime } = req.body;

        // Validate input
        if (!userid || !projectid || !task || !startTime) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Create a new task
        const newTask = await Task.create({
            userid,
            projectid,
            task,
            startTime,
            endTime
        });

        // Update the project's history with the new task
        const project = await Project.findByIdAndUpdate(
            projectid,
            { $push: { history: newTask._id } },
            { new: true, useFindAndModify: false } // Return the updated project
        );

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(201).json({ data: newTask, message: 'Task created and added to project history successfully!' });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Error creating task" });
    }
};

// Get project with populated tasks
const getProjectWithTasks = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('teamMembers')
            .populate({
                path: 'history',
                populate: {
                    path: 'userid', // Populate user details in tasks
                    select: 'name' // Select only the name field
                }
            });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ data: project });
    } catch (error) {
        console.error("Error retrieving project:", error);
        res.status(500).json({ message: "Error retrieving project" });
    }
};

module.exports = {
    createTask,
    getProjectWithTasks,
};
