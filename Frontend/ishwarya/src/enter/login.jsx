import React, { useState } from 'react';
import './login.css';
import tableImage from '../assets/table.jpg';
import axios from 'axios';
import {
  FaUser,
  FaLock,
  FaWhatsapp,
  FaInstagram,
  FaTelegram,
  FaTwitter
} from 'react-icons/fa';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await axios.post('https://localhost:7248/api/UserLogin/login', formData);
      const data = response.data;

      if (data.status === "success") {
        localStorage.setItem("loginData", JSON.stringify({
          ...data,
          password // save the entered password too
        }));

        // Redirect based on role
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          alert("Login succeeded but no redirect URL found");
        }
      } else {
        alert("Login failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid username or password");
    }
  };

  return (
    <div className="login-bg">
      <div className="login-frame">
        {/* Left Image Panel */}
        <div className="login-left">
          <img src={tableImage} alt="table" />
        </div>

        {/* Right Form Panel */}
        <div className="login-right">
          <h2 className="welcome-text">Welcome to Ishwarya Institute</h2>
          <h1 className="sign-in-text">Sign In</h1>

          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-btn" onClick={handleLogin}>
            Log In
          </button>

          <p className="social-text">Follow us on social platforms</p>
          <div className="social-icons">
            <FaWhatsapp className="icon whatsapp" />
            <FaInstagram className="icon instagram" />
            <FaTelegram className="icon telegram" />
            <FaTwitter className="icon twitter" />
          </div>
        </div>
      </div>
    </div>
  );
}
