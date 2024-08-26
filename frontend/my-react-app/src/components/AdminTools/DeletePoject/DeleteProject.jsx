import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeleteProject.css'; // Create this CSS file for styling
import { Footer } from '../../Footer/Footer';

function DeleteProject() {
  const [projectId, setProjectId] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const handleInputChange = (e) => {
    setProjectId(e.target.value);
  };

  const handleConfirmationChange = (e) => {
    setConfirmation(e.target.value);
  };

  const handleDelete = async () => {
    if (confirmation !== 'DELETE') {
      setError('Please type DELETE to confirm.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT token in headers
        },
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.message || 'Error deleting project!');
      }

      setSuccess('Project deleted successfully!');
      setError(null);
      setProjectId('');
      setConfirmation('');
      setTimeout(() => navigate('/home'), 2000); // Redirect after 2 seconds
    } catch (error) {
      setError(error.message);
      setSuccess(null);
    }
  };

  const handleBackBtn = () => {
    navigate(-1);
  }

  const getIDs = () => {
    navigate('/all-projects');
  }

  return (
    <>
      <div className='nav'>
        <button onClick={handleBackBtn}>Back</button>
        <button onClick={getIDs}>Get ID</button>
      </div>
      <div className="delete-project-page">
        <h1>Delete Project</h1>
        <div className="form-group">
          <label htmlFor="projectId">Project ID:</label>
          <input
            type="text"
            id="projectId"
            value={projectId}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmation">Type "DELETE" to confirm:</label>
          <input
            type="text"
            id="confirmation"
            value={confirmation}
            onChange={handleConfirmationChange}
            required
          />
        </div>
        <button onClick={handleDelete} className="delete-button">
          Delete Project
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
      <Footer />
    </>
  );
}

export default DeleteProject;
