import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import passwordImg from "./assets/password.png";
import emailImg from "./assets/email.png";
import logoImg from "./assets/logo-no-background.svg";

const Login = () => {
  const url = "http://localhost:8000/login";
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState(null);

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const clearMessage = (n) => {
      setTimeout(() => {
        setErrorMessage("");
      }, n);
    };

    const regex = {
      email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      password:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    };

    if (!regex.email.test(email)) {
      setErrorMessage(
        "Invalid email format. Please provide a valid email address."
      );
      clearMessage(4000);
      return;
    }

    if (!regex.password.test(password)) {
      setErrorMessage(`
        Password must be at least 8 characters long and contain:
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one number
        - At least one special character (@$!%*?&)
      `);
      clearMessage(8000);
      return;
    }

    const loginData = {
      email,
      password,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        navigate('/home', { state: { userData: data } });
      })
      .catch(error => {
        setErrorMessage('Wrong credentials! Please check your email and password');
        clearMessage(2000);
    });
  };

  return (
    <>
      <div className="page">
        <div className="login">
          <div className="login-container">
            <p>Login</p>
            <div className="input-container">
              <div className="login-row">
                <img src={emailImg} className="login-icon" alt="Email Icon" />
                <input
                  type="email"
                  name="email"
                  id="email-input"
                  value={email}
                  onChange={handleInputChange}
                  placeholder="Email"
                />
              </div>
              <div className="login-row">
                <img
                  src={passwordImg}
                  className="login-icon"
                  alt="Password Icon"
                />
                <input
                  type="password"
                  name="password"
                  id="password-input"
                  value={password}
                  onChange={handleInputChange}
                  placeholder="Password"
                />
              </div>
            </div>
            {errorMessage && (
              <span className="error-message">{errorMessage}</span>
            )}
          </div>
          <img src={logoImg} alt="Logo" className="logo" />
        </div>
        <div className="buttons-container">
          <button className="btn-signup" onClick={handleSignUp}>
            Sign up
          </button>
          <button className="btn-login" onClick={handleSubmit}>
            Login
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
