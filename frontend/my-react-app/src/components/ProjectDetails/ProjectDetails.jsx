import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProjectDetails.css";
import Find from "../Find/Find";

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Not Started",
    newTask: {
      task: "Scripting",
      start: "",
      end: "",
    },
  });
  const [showFind, setShowFind] = useState(false);

  // Get the token from sessionStorage
  const token = sessionStorage.getItem("token");

  const fetchProject = async () => {
    try {
      const response = await fetch(`http://localhost:8000/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT token in headers
        },
      });

      if (!response.ok) {
        throw new Error("Project not found");
      }

      const result = await response.json();
      setProject(result);
      setFormData({
        name: result.name || "",
        description: result.description || "",
        status: result.status || "Not Started",
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      newTask: { ...prevData.newTask, [name]: value },
    }));
  };

  const removeTeamMember = async (memberId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/projects/${id}/${memberId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include JWT token in headers
          },
        }
      );

      if (!response.ok) {
        const errorResponse = await response.text();
        try {
          const parsedError = JSON.parse(errorResponse);
          throw new Error(
            parsedError.message || "Failed to remove team member"
          );
        } catch (jsonError) {
          throw new Error(errorResponse || "Failed to remove team member");
        }
      }

      const updatedProject = await response.json();
      setProject(updatedProject.data);
    } catch (error) {
      setError(error);
    }
  };

  const handleRemoveTask = async (taskIndex) => {
    const updatedHistory = project.history.filter(
      (_, index) => index !== taskIndex
    );

    try {
      const response = await fetch(`http://localhost:8000/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include JWT token in headers
        },
        body: JSON.stringify({ history: updatedHistory }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove task");
      }

      const updatedProject = await response.json();
      setProject(updatedProject.data);
    } catch (error) {
      setError(error);
    }
  };

  const handleEditField = (field) => {
    setEditField(field);
  };

  const handleCancelEdit = () => {
    if (project) {
      setEditField(null);
      setFormData({
        name: project.name || "",
        description: project.description || "",
        status: project.status || "Not Started",
        newTask: {
          task: "Scripting",
          start: "",
          end: "",
        },
      });
    }
  };

  const handleUpdateProject = async () => {
    if (!project) return;

    try {
      const updatedProjectData = {
        ...project,
        name: formData.name,
        description: formData.description,
        status: formData.status,
      };

      const response = await fetch(`http://localhost:8000/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include JWT token in headers
        },
        body: JSON.stringify(updatedProjectData),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      await fetchProject();
      setEditField(null);
    } catch (error) {
      setError(error);
    }
  };

  const handleFindMembers = () => {
    setShowFind(!showFind);
  };

  const handleAddMember = async (newMember) => {
    if (!project || !project.teamMembers) return;

    const isMemberAlreadyAdded = project.teamMembers.some(
      (member) => member._id === newMember._id
    );

    if (isMemberAlreadyAdded) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include JWT token in headers
        },
        body: JSON.stringify({
          ...project,
          teamMembers: [...project.teamMembers, newMember],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add member to project");
      }

      fetchProject();
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleBackButton = () => {
    navigate(-1);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="prjct-page">
        <div className="project-details">
          <button className="back-btn" onClick={handleBackButton}>Back</button>
          <div className="edit-name">
            {editField === "name" ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <button className="save-btn" onClick={handleUpdateProject}>
                  Save
                </button>
                <button className="cancel-btn" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h1>{project.name}</h1>
                <button
                  className="project-details-btn"
                  onClick={() => handleEditField("name")}
                >
                  Change name
                </button>
              </>
            )}
          </div>
          <div className="edit-desc">
            {editField === "description" ? (
              <>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
                <button className="save-btn" onClick={handleUpdateProject}>
                  Save
                </button>
                <button className="cancel-btn" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p>{project.description}</p>
                <button
                  className="project-details-btn"
                  onClick={() => handleEditField("description")}
                >
                  Change description
                </button>
              </>
            )}
          </div>
          <div className="edit-status">
            {editField === "status" ? (
              <>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
                <div className="status-btns">
                  <button className="save-btn" onClick={handleUpdateProject}>
                    Save
                  </button>
                  <button className="cancel-btn" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>
                  <span>Status:</span> {project.status}
                </p>
                <button
                  className="project-details-btn"
                  onClick={() => handleEditField("status")}
                >
                  Change status
                </button>
              </>
            )}
          </div>
          <div className="team-cont">
            <h4>Team members</h4>
            <button
              className="project-details-btn"
              onClick={handleFindMembers}
            >
              Find members
            </button>
          </div>
          <div className="team-members-pr">
            {project &&
            project.teamMembers &&
            project.teamMembers.length > 0 ? (
              project.teamMembers.map((member) => (
                <div className="team-row" key={member._id}>
                  <p>
                    {member.name} {member.surname}
                  </p>
                  <button
                    className="remove-btn"
                    onClick={() => removeTeamMember(member._id)}
                  >
                    Remove member
                  </button>
                </div>
              ))
            ) : (
              <p>No team members available.</p>
            )}
          </div>
          <div className="history">
            <div className="history-cont">
              <h4>History:</h4>
            </div>
            {project && project.history && project.history.length > 0 ? (
              project.history.map((entry, index) => (
                <div className="task-row" key={index}>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveTask(index)}
                  >
                    Remove task
                  </button>
                  <p>
                    <span>Performer:</span>{" "}
                    {entry.taskAdder ? entry.taskAdder.name : "Unknown"}
                  </p>
                  <p>
                    <span>Task:</span> {entry.task}
                  </p>
                  <p>
                    <span>Duration:</span>{" "}
                    {new Date(entry.duration.start).toLocaleDateString()} to{" "}
                    {new Date(entry.duration.end).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No history available.</p>
            )}
          </div>
        </div>
        {showFind && <Find onAddMember={handleAddMember} />}
      </div>
    </>
  );
};

export default ProjectDetails;
