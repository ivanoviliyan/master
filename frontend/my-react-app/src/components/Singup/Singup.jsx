import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Singup.css";
import logoImg from "../Login/assets/logo-no-background.svg";

const Singup = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState({
    name: '',
    password: '',
    email: '',
    country: '',
    city: '',
    address: '',
    phone: '',
    website: '',
    establishedYear: '',
    industry: '',
    logo: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany({
      ...company,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...company,
          socialMedia: {
            linkedin: company.linkedin,
            twitter: company.twitter,
            facebook: company.facebook,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Company data sent successfully:', data);
    } catch (error) {
      console.error('Error sending company data:', error);
    }
  };

  const handleCancel = () => {
    navigate('/');
  }

  return (
    <>
      <div className="singup-form">
        <div className="label">
          <label htmlFor="sing-up">Sign up form</label>
          <img className="singup-logo" src={logoImg} alt="Company Logo" />
        </div>
        <div className="rows">
          <div className="row">
            <label htmlFor="name">Company name:</label>
            <input type="text" name="name" value={company.name} onChange={handleChange} />
          </div>
          <div className="row">
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" value={company.password} onChange={handleChange} />
          </div>
          <div className="row">
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" value={company.email} onChange={handleChange} />
          </div>
          <div className="row">
            <label htmlFor="country">Country:</label>
            <input type="text" name="country" value={company.country} onChange={handleChange} />
          </div>
          <div className="row">
            <label htmlFor="city">City:</label>
            <input type="text" name="city" value={company.city} onChange={handleChange} />
          </div>
          <div className="row">
            <label htmlFor="address">Address:</label>
            <input type="text" name="address" value={company.address} onChange={handleChange} />
          </div>
          <div className="row">
            <label htmlFor="phone">Phone:</label>
            <input type="text" name="phone" value={company.phone} onChange={handleChange} />
          </div>
          <div className="row">
            <label htmlFor="website">Website:</label>
            <input type="text" name="website" value={company.website} onChange={handleChange} />
          </div>
          <div className="row">
            <label>Established Year:</label>
            <input type="number" name="establishedYear" value={company.establishedYear} onChange={handleChange} />
          </div>
          <div className="row">
            <label>Industry:</label>
            <select name="industry" value={company.industry} onChange={handleChange} required>
              <option value="">Select Industry</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Retail">Retail</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Transportation">Transportation</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="row">
            <label>Logo URL:</label>
            <input type="text" name="logo" value={company.logo} onChange={handleChange} />
          </div>
          <div className="row">
            <label>LinkedIn:</label>
            <input type="text" name="linkedin" value={company.linkedin} onChange={handleChange} />
          </div>
          <div className="row">
            <label>Twitter:</label>
            <input type="text" name="twitter" value={company.twitter} onChange={handleChange} />
          </div>
          <div className="row">
            <label>Facebook:</label>
            <input type="text" name="facebook" value={company.facebook} onChange={handleChange} />
          </div>
          <div className="row">
            <label>Description:</label>
            <textarea name="description" value={company.description} onChange={handleChange}></textarea>
          </div>
        </div>

        <div className="buttons-container">
          <button className="singup" onClick={handleSubmit}>Sign up</button>
          <button className="cancel" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </>
  );
};

export default Singup;
