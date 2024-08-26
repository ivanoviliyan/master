const mongoose = require("mongoose"); // Import mongoose
const Project = require("../models/projectModel");
const User = require("../models/userModel");

const getAllProjects = async (req, res) => { 
  try {
    const projects = await Project.find();

    if (projects.length > 0) {
      return res.status(200).json(projects);
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

    // Find project by ID and populate the teamMembers and history.taskAdder fields
    const project = await Project.findById(id)
      .populate("teamMembers", "name") // Populate teamMembers with their names
      .populate({
        path: "history", // Populate history array
        populate: {
          path: "userid", // Populate user details in each task
          select: "name",
        },
        options: { sort: { createdAt: -1 } }, // Sort history tasks by creation date in descending order
      })
      .exec();

    if (project) {
      return res.status(200).json(project);
    }

    return res
      .status(404)
      .json({ message: `Project with ID ${id} does not exist!` });
  } catch (error) {
    console.error("Error retrieving project:", error);
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
    const { teamMemberId, ...projectUpdates } = req.body;

    // If teamMemberId is provided, add it to the project's teamMembers array
    if (teamMemberId) {
      const project = await Project.findById(id);
      if (project) {
        // Ensure the team member is not already in the array
        if (!project.teamMembers.includes(teamMemberId)) {
          project.teamMembers.push(teamMemberId);
          await project.save();
        }
      }
    }

    // Update other project fields
    const updatedProject = await Project.findByIdAndUpdate(id, projectUpdates, {
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
    const projects = await Project.find({ teamMembers: userId }).populate(
      "teamMembers",
      "name"
    ); // Populate the 'teamMembers' field with the 'name' field of the User model

    // Respond with the projects
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const addTeamMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    // Ensure both project and user exist
    const project = await Project.findById(projectId);
    const user = await User.findById(userId);

    if (!user || !project) {
      return res.status(404).json({ message: "User or Project not found" });
    }

    // Add the user to the project’s team members array
    if (!user) {
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { $addToSet: { teamMembers: user._id } }, // $addToSet prevents duplicates
        { new: true }
      ).populate("teamMembers", "name surname");
  
      return res.status(200).json({ data: updatedProject });
    }

    return res.status(200).json({ message: "User is already added!" });

  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({ message: "Error updating project" });
  }
};


const removeTeamMember = async (req, res) => {
  try {
    const { projectId, memberId } = req.params;

    console.log(`Project ID: ${projectId}, Member ID: ${memberId}`);

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $pull: { teamMembers: memberId } },
      { new: true }
    ).populate("teamMembers", "name surname");

    if (!updatedProject) {
      return res.status(404).json({ message: "Failed to update project or member not found." });
    }

    return res.status(200).json({ data: updatedProject });
  } catch (error) {
    console.error("Error during removeTeamMember:", error);
    return res.status(500).json({ message: "Error removing team member!" });
  }
};


module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectsForUser,
  addTeamMember,
  removeTeamMember,
};
