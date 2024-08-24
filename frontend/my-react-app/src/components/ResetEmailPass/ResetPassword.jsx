import React, { useState } from "react";
import "./ResetEmailPass.css";
import { useNavigate } from "react-router-dom";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Get the token from sessionStorage
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("id");

  const handleSubmit = async () => {
    // Basic validation
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/users/${userId}/reset-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include JWT token in headers
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.text();
        try {
          const parsedError = JSON.parse(errorResponse);
          throw new Error(parsedError.message || "Failed to reset password");
        } catch (jsonError) {
          throw new Error(errorResponse || "Failed to reset password");
        }
      }

      const result = await response.json();
      setMessage(result.message || "Password reset successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setError(error.message || "An error occurred");
    }
  };

  return (
    <div className="cred">
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="Old Password"
        className="cred-input"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="New Password"
        className="cred-input"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Retype New Password"
        className="cred-input"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button onClick={handleSubmit}>Reset Password</button>
      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};
