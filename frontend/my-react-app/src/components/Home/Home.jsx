import React, { useState, useEffect } from "react";
import Project from "../Project/Project";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import Tools from '../Tools/Tools';
import {Footer} from '../Footer/Footer';
import getAdmins from '../../admins.js';



const Home = () => {
  const isAdmin = sessionStorage.getItem("isAdmin");
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token"); // Get the token from session storage

  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  const url = `http://localhost:8000/projects/user/${userId}`;
  const userDataUrl = `http://localhost:8000/users/${userId}`;

  useEffect(() => {
    if (userId && token) {
      // Ensure userId and token are available
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      })
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

      fetch(userDataUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      })
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
      setError(new Error("User ID or token is not available"));
    }
  }, [userId, token]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleLogOut = () => {
    sessionStorage.removeItem("token"); // Remove the token on logout
    sessionStorage.removeItem("userId"); // Remove the userId on logout
    navigate("/");
  };

  const handleOptionsClick = () => {
    navigate("/options");
  };

  const handleAdminClick = () => {
    navigate("/admin-menu");
  }

  return (
    <>
      <div className="user-container">
        <button className="btn-logout" onClick={handleLogOut}>
          Logout
        </button>
        <div className="user-info">
          <h2>
            🖐🏼 Welcome back <span>{user?.data.name}</span>
          </h2>
          <p>Please find all projects that you are assigned to:</p>
        </div>
        
        <button className="btn-options" onClick={handleOptionsClick}>
          Options
        </button>
        {isAdmin && <button className="admin-btn" onClick={handleAdminClick}>Admin Menu</button>}
      </div>
      {isAdmin && <Tools/>}
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
      <Footer/>
    </>
  );
};

export default Home;
