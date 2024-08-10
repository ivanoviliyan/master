import React, { useState } from "react";
import "./Login.css";
import passwordImg from "./assets/password.png";
import emailImg from "./assets/email.png";
import logoImg from "./assets/logo-no-background.svg";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginData, setLoginData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;




    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const regex = {
      email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    }

    const data = {
      email,
      password,
    }

    if (regex.email.test(data.email) && regex.password.test(data.password)) {
      setLoginData(data);
    } else {
      alert('Wrong data!');
    }
  }

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
                />
              </div>
              <div className="login-row">
                <img src={passwordImg} className="login-icon" alt="Password Icon" />
                <input
                  type="password"
                  name="password"
                  id="password-input"
                  value={password}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <img src={logoImg} alt="Logo" className="logo" />
        </div>
        <div className="buttons-container">
          <button className="btn-signup">Sign up</button>
          <button className="btn-login" onClick={handleSubmit}>Login</button>
        </div>
      </div>
    </>
  );
};

export default Login;