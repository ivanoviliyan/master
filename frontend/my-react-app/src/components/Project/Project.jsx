import React from "react";
import "./Project.css";
import { useNavigate } from "react-router-dom";
import moreDetailsImg from "../../assets/newpage.png";

const Project = ({ _id, name, description, status, teamMembers, history }) => {
  const navigate = useNavigate();

  const handleMoreDetails = (e) => {
    e.preventDefault();
    navigate(`/projects/${_id}`);
  };

  return (
    <div className="project-card">
      <div className="more-info">
        <h2 className="colored">{name}</h2>
        <div className="new-page-png">
          <button className="btn-details" onClick={handleMoreDetails}>
            Details
            <img src={moreDetailsImg} alt="" srcset="" />
          </button>
        </div>
      </div>
      <p>{description}</p>
      <p>Status: {status}</p>
      <div className="team-members">
        <h4 className="colored">Team Members:</h4>
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
    </div>
  );
};

export default Project;
