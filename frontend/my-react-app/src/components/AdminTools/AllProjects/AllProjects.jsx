import React, { useEffect, useState } from 'react';
import Project from '../../Project/Project';
import './AllProjects.css';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../../Footer/Footer';

function AllProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]); // State for filtered projects
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const getAllProjects = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/projects`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include JWT token in headers
            },
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok'); // Throw an error if not
        }

        const data = await response.json(); // Parse JSON data from the response
        setProjects(data); // Set the full list of projects
        setFilteredProjects(data); // Initialize the filtered projects with all projects
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error); // Handle errors
      }
    };

    getAllProjects();
  }, [token]);

  // Function to handle the search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter projects based on the search query
    const filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(query)
    );
    setFilteredProjects(filtered);

  };

  const handleBackBtn = () => {
    navigate(-1)
  }

  const handleDeleteProject = () => {
    navigate('/delele-project');
  }
  

  return (
    <>
      <div className="cont">
        <button className='back-btn-all' onClick={handleBackBtn}>Back</button>
        <h1 className='all-projects'>All Projects</h1>
        <button onClick={handleDeleteProject}>Delete Project</button>
      </div>
      <div className="inputholder">
      <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects && filteredProjects.length > 0 ? (
          filteredProjects.map((entry) => (
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
}

export default AllProjects;
