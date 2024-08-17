import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const userId = location.state?.userData?.id || null;
  const [data, setData] = useState(null); // State to hold the fetched data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle any errors
  const url = `http://localhost:8000/projects/user/${userId}`;

  useEffect(() => {
    if (userId) { // Ensure userId is valid before making the fetch request
      fetch(url)
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
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false); // No need to load if userId is not available
      setError(new Error("User ID is not available"));
    }
  }, [userId]);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1>Welcome to the Home Page</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
};

export default Home;
