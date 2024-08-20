import React, { useState, useEffect } from "react";
import "./Find.css";
import { useParams } from "react-router-dom";

const Find = ({ onAddMember }) => {
  const [member, setMember] = useState("");
  const [foundMembers, setFoundMembers] = useState([]);
  const { id } = useParams();

  const findMember = (e) => {
    if (String(e.target.value).length > 0) {
      setMember(e.target.value);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/users/member/${member}`
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
      const response = await fetch(
        `http://localhost:8000/projects/${id}/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add user to project");
      }

      // Fetch user details
      const userResponse = await fetch(`http://localhost:8000/users/${userId}`);
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user details");
      }

      const user = await userResponse.json();
      onAddMember(user.data); // Pass complete user object
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <>
      <div className="find-members">
        <p>Teammates</p>
        <div className="find-input">
          <input onInput={findMember} type="text" />
          <button className="search-btn">Search</button>
        </div>
        <div className="all-members">
          {foundMembers.map((member) => (
            <div key={member._id} className="member">
              <span className="user-data">{member.name}</span>
              <span className="user-data">{member.level}</span>
              <span className="user-data">{member.role}</span>
              <button
                className="user-add-btn"
                onClick={() => {
                  handleAdd(member._id);
                }}
              >
                Add
              </button>
              <div className="separator"></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Find;
