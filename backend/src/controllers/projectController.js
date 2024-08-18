const Project = require("../models/projectModel");
const mongoose = require("mongoose"); // Import mongoose

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    if (projects.length > 0) {
      return res
        .status(200)
        .json(projects);
    }

    return res.status(404).json({ message: "No existing projects!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Cannot retrieve projects!" });
  }
};

const getProjectById = async (req, res) => {
  try {
    const id = req.params.id;

    // Find project by ID and populate the teamMembers field
    const project = await Project.findById(id)
      .populate('teamMembers', 'name') // Populate teamMembers with their names
      .exec();

    if (project) {
      return res.status(200).json(project);
    }

    return res.status(404).json({ message: `Project with ID ${id} does not exist!` });
  } catch (error) {
    console.error('Error retrieving project:', error);
    return res.status(500).json({ message: "Error retrieving project!" });
  }
};

const createProject = async (req, res) => {
  try {
    const project = req.body;
    const document = await Project.create(project);
    return res
      .status(201)
      .json({ data: document, message: "Project created successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating project!" });
  }
};

const updateProject = async (req, res) => {
  try {
    const id = req.params.id;
    const project = req.body;
    const updatedProject = await Project.findByIdAndUpdate(id, project, {
      new: true,
    });

    if (updatedProject) {
      return res.status(200).json({
        data: updatedProject,
        message: "Project updated successfully!",
      });
    }

    return res
      .status(404)
      .json({ message: `Project with ID ${id} does not exist!` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating project!" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const id = req.params.id;
    const exists = await Project.findById(id);

    if (exists) {
      await Project.deleteOne({ _id: id });
      return res.status(200).json({ message: "Project deleted successfully!" });
    }

    return res.status(404).json({ message: "The provided ID does not exist!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting project!" });
  }
};

const getProjectsForUser = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if the user ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userId = new mongoose.Types.ObjectId(id);

    // Find projects where the user is part of the teamMembers array
    const projects = await Project.find({ teamMembers: userId })
      .populate('teamMembers', 'name'); // Populate the 'teamMembers' field with the 'name' field of the User model

    // Respond with the projects
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectsForUser,
};
