import React from "react";
import "./Tools.css";
import { useNavigate } from "react-router-dom";

const Tools = () => {
  const navigate = useNavigate();

  const handleCreateProject = () => {
    navigate('/create-project');
  }

  const handleDeleteProject = () => {
    navigate('/delele-project');
  }

  const handleAllProject = () => {
    navigate('/all-projects');
  }


  return (
    <>
      <div className="admin-tools">
          <span>Admin tools</span>
          <button onClick={handleCreateProject}>Create project</button>
          <button onClick={handleDeleteProject}>Delete project</button>
          <button onClick={handleAllProject}>All projects</button>
      </div>
    </>
  );
};
export default Tools;