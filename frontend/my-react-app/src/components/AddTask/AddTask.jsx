import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddTask.css"; // Create this CSS file similar to ProjectDetails.css
import { Footer } from '../Footer/Footer';

const AddTask = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // id will represent the project id
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [taskData, setTaskData] = useState({
    task: "Scripting",
    startTime: "",
    endTime: "",
  });

  // Get the token from sessionStorage
  const token = sessionStorage.getItem("token");
  const userid = sessionStorage.getItem("userId");

  const fetchProject = async () => {
    try {
      const response = await fetch(`http://localhost:8000/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Project not found");
      }

      const result = await response.json();
      setProject(result.data); // Adjust this based on your API response structure
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};

    if (!taskData.task) {
      errors.task = "Task is required";
    }

    if (!taskData.startTime) {
      errors.startTime = "Start Time is required";
    }

    if (!taskData.endTime) {
      errors.endTime = "End Time is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleAddTask = async () => {
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    try {
      const response = await fetch(`http://localhost:8000/task/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...taskData,
          projectid: id,
          userid: userid, // Include userid in the payload
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      await response.json();
      navigate(`/projects/${id}`); // Navigate back to project details page
    } catch (error) {
      setError(error);
    }
  };

  const handleBackButton = () => {
    navigate(-1);
  };

  // Clear errors after 2 seconds
  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      const timer = setTimeout(() => {
        setFormErrors({});
      }, 2000);

      return () => clearTimeout(timer); // Cleanup timeout on unmount or if errors change
    }
  }, [formErrors]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="all-page">
        <button className="back-btn-task" onClick={handleBackButton}>
          Back
        </button>
        <div className="add-task-page">
          <h1>Add Task</h1>
          <div className="task-form">
            <div className="form-group">
              <label htmlFor="task">Task:</label>
              <select
                id="task"
                name="task"
                value={taskData.task}
                onChange={handleInputChange}
                required
              >
                <option value="Scripting">Scripting</option>
                <option value="Script Changes">Script Changes</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="Data checking">Data checking</option>
                <option value="Field Work">Field Work</option>
                <option value="Overlay">Overlay</option>
              </select>
              {formErrors.task && (
                <span className="error-message">{formErrors.task}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="startTime">Start Time:</label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                value={taskData.startTime}
                onChange={handleInputChange}
                required
              />
              {formErrors.startTime && (
                <span className="error-message">{formErrors.startTime}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="endTime">End Time:</label>
              <input
                type="datetime-local"
                id="endTime"
                name="endTime"
                value={taskData.endTime}
                onChange={handleInputChange}
                required
              />
              {formErrors.endTime && (
                <span className="error-message">{formErrors.endTime}</span>
              )}
            </div>
            <button className="submit-btn" onClick={handleAddTask}>
              Add Task
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddTask;
