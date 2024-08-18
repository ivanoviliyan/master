import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Project from "../Project/Project";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userData?.id || null;
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = `http://localhost:8000/projects/user/${userId}`;
  const userDataUrl = `http://localhost:8000/users/${userId}`;

  useEffect(() => {
    if (userId) {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          setData(result);
        })
        .catch((error) => {
          setError(error);
        });

      fetch(userDataUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          setUser(result);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError(new Error("User ID is not available"));
    }
  }, [userId]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleLogOut = () => {
    navigate('/login');
  }

  return (
    <>
      <div className="user-container">
        <button className="btn-logout" onClick={handleLogOut}>Logout</button>
        <div className="user-info">
          <h2>🖐🏼 Welcome back <span>{user?.data?.name}</span></h2>
          <p>Please find all projects that you are assigned to:</p>
        </div>
        <button className="btn-options">Options</button>
      </div>
      <div className="projects-grid">
        {data && Array.isArray(data) && data.length > 0 ? (
          data.map((entry) => (
            <Project
              key={entry._id}
              _id={entry._id}
              name={entry.name}
              description={entry.description}
              status={entry.status}
              teamMembers={entry.teamMembers}
              history={entry.history}
            />
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </>
  );
};

export default Home;
