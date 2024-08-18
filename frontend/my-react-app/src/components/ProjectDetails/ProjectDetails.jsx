import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProjectDetails.css"; // Add custom styles if needed

const ProjectDetails = () => {
  const { id } = useParams(); // Get project ID from URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:8000/projects/${id}`);
        if (!response.ok) {
          throw new Error("Project not found");
        }
        const result = await response.json();
        setProject(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="project-details">
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <p>Status: {project.status}</p>
      <div className="team-members">
        <h4>Team Members:</h4>
        {project.teamMembers && project.teamMembers.length > 0 ? (
          project.teamMembers.map((member, index) => (
            <p key={index}>{member.name}</p>
          ))
        ) : (
          <p>No team members available.</p>
        )}
      </div>
      <div className="history">
        <h4>History:</h4>
        {project.history && project.history.length > 0 ? (
          project.history.map((entry, index) => (
            <div key={index}>
              <p>Task: {entry.task}</p>
              <p>
                Duration: {new Date(entry.duration.start).toLocaleDateString()} to {new Date(entry.duration.end).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No history available.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
