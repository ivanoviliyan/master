import React, { useState, useEffect } from "react";
import "./Find.css";
import { useParams } from "react-router-dom";


const Find = ({ onAddMember }) => {
  const [member, setMember] = useState("");
  const [foundMembers, setFoundMembers] = useState([]);
  const { id } = useParams();
  const [message, setMessage] = useState(""); // State to hold error message

  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token"); // Get the token from session storage

  const findMember = (e) => {
    setMember(e.target.value);
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/users/member/${member}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request headers
            },
          }
        );
        if (!response.ok) {
          throw new Error("Project not found");
        }
        const result = await response.json();
        setFoundMembers(result);
      } catch (error) {
        console.log(error);
      }
    };

    if (member) {
      getUser();
    }
  }, [member]);

  const handleAdd = async (userId) => {
    try {
      // Fetch the current project details to get the list of team members
      const projectResponse = await fetch(
        `http://localhost:8000/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        }
      );
      if (!projectResponse.ok) {
        throw new Error("Failed to fetch project details");
      }

      const project = await projectResponse.json();

      // Check if the user is already in the team members list
      const isAlreadyAdded = project.teamMembers.some(
        (member) => member._id === userId
      );

      if (isAlreadyAdded) {
        setMessage("User already has been added.");
        setTimeout(() => {
          setMessage(""); // Clear the message after 2 seconds
        }, 2000);
        return;
      }

      // If not already added, proceed to add the user
      const response = await fetch(
        `http://localhost:8000/projects/${id}/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add user to project");
      }

      // Fetch user details after adding
      const userResponse = await fetch(`http://localhost:8000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user details");
      }

      const user = await userResponse.json();
      onAddMember(user.data); // Pass the user object to ProjectDetails
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <>
      <div className="find-members">
        <p>Teammates</p>
        <div className="find-input">
          <input
            onInput={findMember}
            type="text"
            placeholder="Search for members"
          />
        </div>
        {message && <span className="error-msg">{message}</span>}{" "}
        {/* Conditionally render the Error component */}
        <div className="all-members">
          {foundMembers.map((member) => (
            <div key={member._id} className="member">
              <span>Name: <u>{member.name}</u></span>
              <span>Level: <u>{member.level}</u></span>
              <span>Role: <u>{member.role}</u></span>
              <button
                className="user-add-btn"
                onClick={() => handleAdd(member._id)}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Find;
