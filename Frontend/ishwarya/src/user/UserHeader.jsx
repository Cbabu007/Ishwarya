import React, { useState, useEffect } from 'react';
import './UserHeader.css';
import logo from '../assets/instituteLogo.jpg';

export default function UserHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', photo: '' });

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem("loginData"));
    if (loginData) {
      let photoUrl = loginData.photo;
      if (photoUrl) {
        // Always prefix backend URL if path starts with /uploads/
        if (photoUrl.startsWith("/uploads/")) {
          photoUrl = `https://localhost:7248${photoUrl}`;
        } else if (!photoUrl.startsWith("http")) {
          // If photoUrl does not start with http or /, prefix with your backend URL
          photoUrl = `https://localhost:7248/${photoUrl.replace(/\\/g, '/')}`;
        }
      }
      setUserInfo({
        name: `${loginData.firstName} ${loginData.middleName || ''} ${loginData.lastName}`.replace(/\s+/g, ' ').trim(),
        photo: photoUrl
      });
    }
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="Institute Logo" />
        </div>

        {/* Desktop Menu */}
        <nav className="nav">
          <a href="/user/dashboard">🏠 Dashboard</a>
          <a href="/user/tests">🧪 Tests</a>
          <a href="/user/content">📚 Content</a>
        </nav>

        {/* Profile Dropdown */}
        <div className="profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {userInfo.photo ? (
            <img
              src={userInfo.photo}
              onError={e => {
                if (e.target.src !== window.location.origin + "/default-profile.png") {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = "/default-profile.png";
                }
              }}
              alt="Profile"
              className="profile-pic"
            />
          ) : (
            <div className="circle"></div>
          )}
          <span className="user-name">{userInfo.name}</span>
          <span className="arrow">▼</span>
          {dropdownOpen && (
            <div className="dropdown">
             
              <a href="/logout">🔓 Logout</a>
            </div>
          )}
        </div>

        {/* Hamburger (Mobile Menu Toggle) */}
        <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          ☰
        </div>
      </div>

      {/* Mobile Menu Section */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <a href="/user/dashboard">🏠 Dashboard</a>
          <a href="/user/tests">🧪 Tests</a>
          <a href="/user/content">📚 Content</a>
          <hr />
         
          <a href="/logout">🔓 Logout</a>
        </div>
      )}
    </header>
  );
}
