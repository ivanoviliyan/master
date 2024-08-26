import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProjectDetails.css";
import Find from "../Find/Find";
import { Footer } from '../Footer/Footer';
import getAdmins from '../../admins.js';

const ProjectDetails = () => {
  const permission = getAdmins();
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

  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");
  const isAdmin = sessionStorage.getItem("isAdmin");


  const fetchProject = async () => {
    try {
      const response = await fetch(`http://localhost:8000/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      // Check the result and set the project data
      if (result && result._id) {
        setProject(result);
        setFormData({
          name: result.name || "",
          description: result.description || "",
          status: result.status || "Not Started",
        });
      } else {
        throw new Error("Project data is missing from the API response");
      }
    } catch (error) {
      console.error("Error fetching project:", error.message);
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


  const removeTeamMember = async (memberId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/projects/${id}/${memberId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

  const handleRemoveTask = async (taskId) => {
    if (!project || !project.history) return;

    const updatedHistory = project.history.filter((task) => task._id !== taskId);

    try {
      const response = await fetch(`http://localhost:8000/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...project,
          history: updatedHistory,
        }),
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
          Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
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

  console.log(project);

  return (
    <>
      <div className="prjct-page">
        <div className="project-details">
          <button className="back-btn-details" onClick={handleBackButton}>
            Back
          </button>
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
                <h1>{project?.name || "No name"}</h1>
                {isAdmin && <button
                  className="project-details-btn"
                  onClick={() => handleEditField("name")}
                >
                  Change name
                </button>
                }
              </>
            )}
          </div>
          <div className="start-end-date">
            <p>
              <span>Start date:</span>{" "}
              {project?.startDate ? new Date(project.startDate).toLocaleDateString() : "N/A"}
            </p>
            <p>
              <span>End date:</span>{" "}
              {project?.endDate ? new Date(project.endDate).toLocaleDateString() : "N/A"}
            </p>
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
                <p>{project?.description || "No description"}</p>
                {isAdmin && <button
                  className="project-details-btn"
                  onClick={() => handleEditField("description")}
                >
                  Change description
                </button>}
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
                  <span>Status:</span> {project?.status || "No status"}
                </p>
                {isAdmin && <button
                  className="project-details-btn"
                  onClick={() => handleEditField("status")}
                >
                  Change status
                </button>}
              </>
            )}
          </div>
          <div className="edit-team">
            <div className="edit-team-members">
              <h2>Team Members</h2>
              {isAdmin && <button className="project-details-btn" onClick={handleFindMembers}>
                {showFind ? "Hide members tab" : "Show members tab"}
              </button>}
            </div>
            {project?.teamMembers && project.teamMembers.length > 0 ? (
              <div className="team-members-list">
                {project.teamMembers.map((member) => (
                  <div key={member._id} className="team-member">
                    <span>{member.name}</span>
                    {isAdmin && <button onClick={() => removeTeamMember(member._id)}>Remove</button>}
                  </div>
                ))}
              </div>
            ) : (
              <p>No team members added yet.</p>
            )}
          </div>

          <div className="history">
            <div className="history-cont">
              <h4>History:</h4>
            </div>
            {project?.history && project.history.length > 0 ? (
              project.history.map((task) => (
                <div className="task-row" key={task._id}>
                  {isAdmin && <button
                    className="remove-btn"
                    onClick={() => handleRemoveTask(task._id)}
                  >
                    Remove task
                  </button>}
                  <p>
                    <span>Performer:</span>{" "}
                    {task.userid ? task.userid.name || "Unknown" : "Unknown"}
                  </p>
                  <p>
                    <span>Task:</span> {task.task || "No task description"}
                  </p>
                  <p>
                    <span>Duration:</span>{" "}
                    {task.startTime && task.endTime
                      ? `${new Date(task.startTime).toLocaleDateString()} to ${new Date(task.endTime).toLocaleDateString()}`
                      : "N/A"}
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
      <Footer />
    </>
  );
};

export default ProjectDetails;
