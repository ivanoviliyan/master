import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Singup.css";
import logoImg from "../Login/assets/logo-no-background.svg";

const Signup = () => {
  const navigate = useNavigate();
  const [register, setRegister] = useState({
    name: '',
    password: '',
    email: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegister({
      ...register,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(register),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Registration data sent successfully:', data);
    } catch (error) {
      console.error('Error sending registration data:', error);
    }
  };

  const handleCancel = () => {
    navigate('/');
  }

  return (
    <>
      <div className="signup-form">
        <div className="label">
          <label htmlFor="sign-up">Sign up form</label>
          <img className="signup-logo" src={logoImg} alt="Company Logo" />
        </div>
        <div className="rows">
        <div className="row">
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" value={register.email} onChange={handleChange} />
          </div>
          <div className="row">
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" value={register.password} onChange={handleChange} />
          </div>
          <div className="row">
            <label htmlFor="name">Name:</label>
            <input type="text" name="name" value={register.name} onChange={handleChange} />
          </div>
          <div className="row">
            <label htmlFor="phone">Phone:</label>
            <input type="text" name="phone" value={register.phone} onChange={handleChange} />
          </div>
        </div>

        <div className="buttons-container-singup">
          <button className="signup" onClick={handleSubmit}>Sign up</button>
          <button className="cancel" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </>
  );
};

export default Signup;
