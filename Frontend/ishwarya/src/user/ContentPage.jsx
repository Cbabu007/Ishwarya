import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContentPage.css';
import axios from 'axios';

export default function ContentPage() {
  const [contentData, setContentData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [courseList, setCourseList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [previewStates, setPreviewStates] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    if (!loginData.username || !loginData.password) {
      alert("Login required");
      navigate('/enter/login');
      return;
    }

    const { username, password } = loginData;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    axios
      .post("https://localhost:7248/api/user/content/by-login", formData)
      .then((res) => {
        setContentData(res.data);
        const courses = [...new Set(res.data.map(item => item.course))];
        setCourseList(courses);
      })
      .catch((err) => {
        console.error("Error fetching content:", err);
        alert("Unable to load content.");
      });
  }, [navigate]);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    const subjects = [...new Set(contentData.filter(item => item.course === course).map(item => item.subject))];
    setSubjectList(subjects);
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setPreviewStates({}); // reset previews
  };

  const togglePreview = (index, type) => {
    setPreviewStates((prev) => ({
      ...prev,
      [index]: {
        video: type === 'video' ? true : false,
        pdf: type === 'pdf' ? true : false,
      }
    }));
  };

 const filteredTopics = contentData
  .filter(item => item.course === selectedCourse && item.subject === selectedSubject)
  .reverse();


  return (
    <div className="page-content">
      {!selectedCourse &&
        courseList.map((course, index) => (
          <div key={index} className="frame-box">
            <div className="nav-card" onClick={() => handleCourseClick(course)}>
              {course}
            </div>
          </div>
        ))
      }

      {selectedCourse && !selectedSubject &&
        subjectList.map((subject, index) => (
          <div key={index} className="frame-box">
            <div className="nav-card" onClick={() => handleSubjectClick(subject)}>
              {subject}
            </div>
          </div>
        ))
      }

      {selectedSubject && filteredTopics.length > 0 && (
        <div className="frame-box">
          <div className="course-title">📘 Course: {selectedCourse}</div>
          <div className="content-label">📚 Subject: {selectedSubject}</div>

          {filteredTopics.map((item, index) => (
            <div key={index} style={{ marginTop: '24px' }}>
              {index > 0 && <hr style={{ margin: '30px 0' }} />}
              <div className="content-label">📌 Topic: {item.topic}</div>

              <div className="button-row">
                <button className="action-btn" onClick={() => togglePreview(index, 'video')}>
                  🎥 Show Video
                </button>
                <button className="action-btn" onClick={() => togglePreview(index, 'pdf')}>
                  📄 Show PDF
                </button>
              </div>

              <div className="preview-container">
                {previewStates[index]?.video && (
                  <div className="video-preview">
                    <h4>📽️ Video</h4>
                    <video width="100%" height="300" controls>
                      <source src={`https://localhost:7248${item.videoPath}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {previewStates[index]?.pdf && (
                  <div className="pdf-preview">
                    <h4>🧾 PDF</h4>
                    <iframe
                      src={`https://localhost:7248${item.pdfPath}`}
                      width="100%"
                      height="400"
                      title="PDF Preview"
                      style={{ border: '1px solid #ccc', borderRadius: '10px' }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
