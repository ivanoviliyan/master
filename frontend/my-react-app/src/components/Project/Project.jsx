import React from "react";
import "./Project.css";
import { useNavigate } from "react-router-dom";
import moreDetailsImg from "../../assets/newpage.png";
import copyIcon from "../../assets/copyIcon.png"; // Make sure to have a copy icon image or use an icon from a library

const Project = ({ _id, name, description, status, teamMembers, history }) => {
  const navigate = useNavigate();

  const handleMoreDetails = (e) => {
    e.preventDefault();
    navigate(`/projects/${_id}`);
  };

  const handleAddTaskClick = (e) => {
    e.preventDefault();
    navigate(`/add-task/${_id}`);
  };

  const handleCopyId = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(_id)
      .then(() => {
        alert("Project ID copied to clipboard!");
      })
      .catch(err => {
        alert("Failed to copy ID to clipboard.");
      });
  };

  return (
    <div className="project-card">
      <div className="more-info">
        <h2 className="colored">{name}</h2>
        <div className="new-page-png">
          <button className="btn-details" onClick={handleAddTaskClick}>
            Add Task
          </button>
          <button className="btn-details" onClick={handleMoreDetails}>
            Details
            <img src={moreDetailsImg} alt="More details" />
          </button>
        </div>
      </div>
      <p>{description}</p>
      <p className="colored">Status: {status}</p>
      <h4 className="colored">Team Members:</h4>
      <div className="team-members">
        {teamMembers && teamMembers.length > 0 ? (
          teamMembers.map((el, index) => (
            <div key={index}>
              <p className="team-member-prop">{el.name}</p>
            </div>
          ))
        ) : (
          <p>No team members available.</p>
        )}
      </div>
      <button className="btn-copy-id" onClick={handleCopyId}>
        Copy ID
        <img src={copyIcon} alt="Copy ID" />
      </button>
    </div>
  );
};

export default Project;
