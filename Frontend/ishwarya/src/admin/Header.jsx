import React, { useState, useEffect } from 'react';
import './Header.css';
import logo from '../assets/instituteLogo.jpg';

export default function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState({ name: '', photo: '' });

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem("loginData"));
    if (loginData) {
      let photoUrl = loginData.photo;
      if (photoUrl) {
        // Always prefix backend URL if path starts with /uploads/
        if (photoUrl.startsWith("/uploads/")) {
          photoUrl = `https://localhost:7248${photoUrl}`;
        } else if (!photoUrl.startsWith("http")) {
          photoUrl = `https://localhost:7248/${photoUrl.replace(/\\/g, '/')}`;
        }
      }
      setAdminInfo({
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

        {/* Desktop Nav */}
        <nav className="nav">
          <a href="/admin/students">👨‍🎓 Registration</a>
          <a href="/admin/class">🏫 Upload</a>
          <a href="/admin/tests">📝 Tests</a>
          <a href="/admin/notes">📚 Notes</a>
        </nav>

        {/* Profile Dropdown */}
        <div className="profile" onClick={() => setProfileOpen(!profileOpen)}>
          {adminInfo.photo ? (
            <img
              src={adminInfo.photo}
              onError={e => {
                e.target.onerror = null;
                e.target.src = "/default-profile.png";
              }}
              alt="Profile"
              className="profile-pic"
            />
          ) : (
            <div className="circle"></div>
          )}
          <span className="user-name">{adminInfo.name}</span>
          <span className="arrow">▼</span>
          {profileOpen && (
            <div className="dropdown">
              <a href="/home">🔓 Logout</a>
            </div>
          )}
        </div>

        {/* Hamburger Icon */}
        <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          ☰
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <a href="/admin/students">👨‍🎓 Registration</a>
          <a href="/admin/class">🏫 Upload</a>
          <a href="/admin/tests">📝 Tests</a>
          <a href="/admin/notes">📚 Notes</a>
          <hr />
          <a href="/home">🔓 Logout</a>
        </div>
      )}
    </header>
  );
}
