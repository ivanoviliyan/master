import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Options.css";
import { ResetEmail } from "../ResetEmailPass/ResetEmail";
import { ResetPassword } from "../ResetEmailPass/ResetPassword";
import {Footer} from '../Footer/Footer';

export const Options = () => {
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null); // To manage error state
  const navigate = useNavigate(); // Use navigate hook for navigation
  const [showCred, setShowCred] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    level: "",
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`http://localhost:8000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token in headers
          },
        });
        if (!response.ok) {
          throw new Error("User not found"); // Improved error message
        }
        const result = await response.json();
        setData(result.data);
        setFormData({
          role: result.data.role || "",
          level: result.data.level || "",
        });
      } catch (error) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Update loading state
      }
    };

    if (userId) {
      getUser();
    } else {
      setError("User ID is missing"); // Handle case where userId is not available
      setLoading(false);
    }
  }, [userId]);

  if (loading) return <p>Loading...</p>; // Show loading state
  if (error) return <p>Error: {error}</p>; // Show error message

  const handleShowCred = () => {
    setShowCred(!showCred);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8000/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      const result = await response.json();
      setData(result.data); // Update the local state with the updated user data
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      setError(error.message); // Handle error
    }
  };

  return (
    <>
      <div className="user-page">
        <div className="header">
          <button className="back-btn" onClick={handleBack}>
            Back
          </button>
          <h2>
            🖐🏼 Hi <span>{data?.name}</span>. Please find your profile data below:
          </h2>
        </div>
        <div className="user-data">
          <p>Name: {data?.name}</p>
          <p>Email: {data?.email}</p>

          {isEditing ? (
            <>
              <div className="form-group">
                <label>Role:</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="Scripter">Scripter</option>
                  <option value="Custom scripter">Custom scripter</option>
                  <option value="Quality assurance">Quality assurance</option>
                  <option value="Data processing">Data processing</option>
                  <option value="Project manager">Project manager</option>
                  <option value="Field work">Field work</option>
                </select>
              </div>
              <div className="form-group">
                <label>Level:</label>
                <select name="level" value={formData.level} onChange={handleChange}>
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
            </>
          ) : (
            <>
              <p>Role: {data?.role || "Not provided"}</p>
              <p>Level: {data?.level || "Not provided"}</p>
              <button className="edit-btn" onClick={handleEdit}>
                Edit
              </button>
            </>
          )}

          <div className="user-change">
            <button className="pass-reset" onClick={handleShowCred}>
              Reset Credentials
            </button>
          </div>
        </div>
        <div className="show">
          {showCred && (
            <>
              <ResetEmail /> <ResetPassword />
            </>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};
