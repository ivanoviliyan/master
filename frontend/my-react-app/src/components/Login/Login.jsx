import React from "react";
import "./Login.css";
import passwordImg from "./assets/password.png";
import emailImg from "./assets/email.png";

const Login = () => {
  return (
    <>
      <div className="login-container">
        <p>Login</p>
        <div className="input-container">
          <div className="row">
            <img src={emailImg} className="login-icon" alt="" srcset="" />
            <input type="email" name="" id="" />
          </div>
          <div className="row">
            <img src={passwordImg} className="login-icon" alt="" srcset="" />
            <input type="password" name="" id="" />
          </div>
        </div>
        <div className="buttons-container">
          <button className="btn-singup">Sing up</button>
          <button className="btn-login">Login</button>
        </div>
      </div>
    </>
  );
};

export default Login;
