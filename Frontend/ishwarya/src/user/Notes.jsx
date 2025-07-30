import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notes.css';
import axios from 'axios';

export default function Notes() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem('loginData'));
    if (!loginData || !loginData.studentProfile) {
      alert("Login required");
      navigate('/enter/login');
      return;
    }

    const { userName, password } = loginData.studentProfile;

    const formData = new FormData();
    formData.append("username", userName);
    formData.append("password", password);

    axios
      .post('https://localhost:7248/api/user/course/by-login', formData)
      .then(res => {
        const uniqueCourses = [...new Set(res.data.map(c => c.courseName))];
        setCourses(uniqueCourses);
      })
      .catch(err => {
        console.error("Failed to fetch courses:", err);
        alert("Could not load course list");
      });
  }, [navigate]);

  return (
    <div className="frame-box">
      {courses.map((course, index) => (
        <div key={index} className="nav-card" onClick={() => navigate('/user/subject', { state: { course } })}>
          <b>{course}</b>
        </div>
      ))}
    </div>
  );
}
