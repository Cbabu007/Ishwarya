import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Class.css';
import { Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
import { PDFDownloadLink } from '@react-pdf/renderer';


export default function QuestionAnswerUpload() {
  const [form, setForm] = useState({
    course: '',
    testName: '',
    subject: '',
    topic: '',
    testNo: '',
    questionFile: null,
    answerFile: null,
  });

  const [options, setOptions] = useState({
    courses: [],
    testNames: [],
    subjects: [],
    topics: [],
    testNos: [],
  });

  const api = 'https://localhost:7248/api/admin/questionanswer';

  useEffect(() => {
    axios.get(`${api}/courses`).then(res => setOptions(o => ({ ...o, courses: res.data })));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({ ...prev, [name]: files ? files[0] : value }));

    if (name === 'course') {
      axios.get(`${api}/testnames`, { params: { course: value } }).then(res =>
        setOptions(o => ({ ...o, testNames: res.data, subjects: [], topics: [], testNos: [] }))
      );
    }

    if (name === 'testName') {
      axios.get(`${api}/subjects`, { params: { course: form.course, testName: value } }).then(res =>
        setOptions(o => ({ ...o, subjects: res.data, topics: [], testNos: [] }))
      );
    }

    if (name === 'subject') {
      axios.get(`${api}/topics`, {
        params: { course: form.course, testName: form.testName, subject: value }
      }).then(res =>
        setOptions(o => ({ ...o, topics: res.data, testNos: [] }))
      );
    }

    if (name === 'topic') {
      axios.get(`${api}/testnos`, {
        params: {
          course: form.course,
          testName: form.testName,
          subject: form.subject,
          topic: value
        }
      }).then(res =>
        setOptions(o => ({ ...o, testNos: res.data }))
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('course', form.course);
    data.append('testName', form.testName);
    data.append('subject', form.subject);
    data.append('topic', form.topic);
    data.append('testNo', form.testNo);
    if (form.questionFile) data.append('questionFile', form.questionFile);
    if (form.answerFile) data.append('answerFile', form.answerFile);

    if (!form.questionFile && !form.answerFile) {
      alert("Please select at least one file to upload.");
      return;
    }

    try {
      await axios.post(`${api}/upload`, data);
      alert('Uploaded Successfully');
      handleClear();
    } catch (err) {
      console.log(err.response?.data);
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleClear = () => {
    setForm({
      course: '',
      testName: '',
      subject: '',
      topic: '',
      testNo: '',
      questionFile: null,
      answerFile: null
    });
    setOptions(prev => ({ ...prev, testNames: [], subjects: [], topics: [], testNos: [] }));
  };

  return (
    <div className="upload-container">
      <div className="upload-form">
        <h2>Upload Question / Answer Paper</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-row">
            <select name="course" value={form.course} onChange={handleChange} required>
              <option value="">Select Course</option>
              {options.courses.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>

            <select name="testName" value={form.testName} onChange={handleChange} required>
              <option value="">Select Test Name</option>
              {options.testNames.map((t, i) => <option key={i} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="form-row">
            <select name="subject" value={form.subject} onChange={handleChange} required>
              <option value="">Select Subject</option>
              {options.subjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>

            <select name="topic" value={form.topic} onChange={handleChange} required>
              <option value="">Select Topic</option>
              {options.topics.map((t, i) => <option key={i} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="form-row">
            <select name="testNo" value={form.testNo} onChange={handleChange} required>
              <option value="">Select Test No</option>
              {options.testNos.map((t, i) => <option key={i} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="form-row">
            <label>Question Paper:</label>
            <input
              type="file"
              name="questionFile"
              accept=".doc,.docx,.xls,.xlsx,.pdf"
              onChange={handleChange}
            />
            {form.questionFile && (
              <>
                <div className="file-name">{form.questionFile.name}</div>
                {form.questionFile.type === "application/pdf" ? (
                  <iframe
                    src={URL.createObjectURL(form.questionFile)}
                    title="Question PDF Preview"
                    width="100%"
                    height="300"
                    style={{ border: "1px solid #ccc", marginTop: 8 }}
                  />
                ) : (
                  <div style={{ color: "#888", fontSize: 13, marginTop: 8 }}>
                    {form.questionFile.name.endsWith('.doc') || form.questionFile.name.endsWith('.docx')
                      ? "Word preview not supported in browser. Download to view."
                      : form.questionFile.name.endsWith('.xls') || form.questionFile.name.endsWith('.xlsx')
                      ? "Excel preview not supported in browser. Download to view."
                      : null}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="form-row">
            <label>Answer Paper:</label>
            <input
              type="file"
              name="answerFile"
              accept=".doc,.docx,.xls,.xlsx,.pdf"
              onChange={handleChange}
            />
            {form.answerFile && (
              <>
                <div className="file-name">{form.answerFile.name}</div>
                {form.answerFile.type === "application/pdf" ? (
                  <iframe
                    src={URL.createObjectURL(form.answerFile)}
                    title="Answer PDF Preview"
                    width="100%"
                    height="300"
                    style={{ border: "1px solid #ccc", marginTop: 8 }}
                  />
                ) : (
                  <div style={{ color: "#888", fontSize: 13, marginTop: 8 }}>
                    {form.answerFile.name.endsWith('.doc') || form.answerFile.name.endsWith('.docx')
                      ? "Word preview not supported in browser. Download to view."
                      : form.answerFile.name.endsWith('.xls') || form.answerFile.name.endsWith('.xlsx')
                      ? "Excel preview not supported in browser. Download to view."
                      : null}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-btn">Submit</button>
            <button type="button" onClick={handleClear} className="clear-btn">Clear</button>
          </div>
        </form>
      </div>
    </div>
  );
}
