import React, { useState, useEffect } from 'react';
import './CreateProject.css';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../../Footer/Footer';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Not Started',
    teamMembers: [], 
    startDate: '',
    endDate: '',
    history: []
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.description) {
      newErrors.description = 'Description is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else if (isNaN(Date.parse(formData.startDate))) {
      newErrors.startDate = 'Start date is invalid';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (isNaN(Date.parse(formData.endDate))) {
      newErrors.endDate = 'End date is invalid';
    }

    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    try {
      const response = await fetch('http://localhost:8000/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/projects/${data.data._id}`);
      } else {
        console.error('Failed to create project:', response.statusText);
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleBackBtn = () => {
    navigate(-1);
  };

  // Clear errors after 4 seconds
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => {
        setErrors({});
      }, 2000);
      
      return () => clearTimeout(timer); // Cleanup timeout on unmount or if errors change
    }
  }, [errors]);

  return (
    <>
      <div className='create-p-container'>
        <button className='back-btn' onClick={handleBackBtn}>Back</button>
        <p className='create-p'>Create project</p>
      </div>
      <div className='create-p-page'>
        <div className="form-container">
          <div className="form-group">
            <label>Project Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange}
              required
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
            {errors.status && <span className="error-message">{errors.status}</span>}
          </div>

          <div className="form-group">
            <label>Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            {errors.startDate && <span className="error-message">{errors.startDate}</span>}
          </div>
          <div className="form-group">
            <label>End Date:</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
            {errors.endDate && <span className="error-message">{errors.endDate}</span>}
          </div>

          <button onClick={handleSubmit} className="submit-button">Create Project</button>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default CreateProject;
