import React from "react";
import { useNavigate } from "react-router-dom";
import "./Options.css";
import { ResetEmail } from "../ResetEmailPass/ResetEmail";
import { ResetPassword } from "../ResetEmailPass/ResetPassword";
import { useState, useEffect } from "react";

export const Options = () => {
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null); // To manage error state
  const navigate = useNavigate(); // Use navigate hook for navigation
  const [showCred, setShowCred] = useState(false);

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
    console.log(showCred);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="user-page">
        <div className="header">
          <button className="back-btn" onClick={handleBack}>
            Back
          </button>
          <h2>
            🖐🏼 Hi{" "}
            <span>{data?.name}. Please find your profile data below:</span>
          </h2>
        </div>
        <div className="user-data">
          <p>Name: {data?.name}</p>
          <p>Email: {data?.email}</p>
          <p>Level: {data?.level}</p>
          <p>Role: {data?.role}</p>
          <p>Phone number: {data?.telephoneNumber}</p>
          <div className="user-change">
            <button className="pass-reset" onClick={handleShowCred}>
              Reset Credentials
            </button>
          </div>
        </div>
        <div className="show">
          {showCred && <><ResetEmail /> <ResetPassword /></>}
        </div>
      </div>
    </>
  );
};
