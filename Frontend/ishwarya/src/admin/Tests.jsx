import React, { useEffect, useState } from "react";
import "./Tests.css";

const TABS = ["ADD", "EDIT", "VIEW", "DELETE"];
const LANGUAGES = ["Tamil", "English", "Hindi", "Maths"];
const ANSWERS = ["A", "B", "C", "D"];

function getFontFamily(language) {
  switch (language) {
    case "Tamil":
      return "'Bamini', 'Noto Sans Tamil', Latha, Arial, sans-serif";
    case "Hindi":
      return "'Noto Sans Devanagari', Mangal, Arial, sans-serif";
    case "Maths":
      return "'Cambria Math', 'Times New Roman', serif";
    default:
      return "Arial, sans-serif";
  }
}

export default function Tests() {
  const [activeTab, setActiveTab] = useState("ADD");

  // Dropdown options for EDIT
  const [courses, setCourses] = useState([]);
  const [testNames, setTestNames] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [testNos, setTestNos] = useState([]);

  // Selected values for EDIT
  const [filters, setFilters] = useState({
    course: "",
    testName: "",
    subject: "",
    topic: "",
    testNo: "",
    language: "",
  });

  // Questions for the selected test (EDIT)
  const [editQuestions, setEditQuestions] = useState([]);
  const [editableRows, setEditableRows] = useState({});

  // Fetch dropdown data for EDIT tab
  useEffect(() => {
    if (activeTab === "EDIT" || activeTab === "VIEW" || activeTab === "DELETE") {
      fetch("https://localhost:7248/api/admin/tests/edit/dropdowns")
        .then((res) => res.json())
        .then((data) => {
          setCourses(data.courses || []);
          setTestNames(data.testNames || []);
          setSubjects(data.subjects || []);
          setTopics(data.topics || []);
          setTestNos(data.testNos || []);
        })
        .catch((err) => {
          console.error("Failed to fetch dropdowns:", err);
        });
    }
  }, [activeTab]);

  // Fetch questions for EDIT/VIEW/DELETE using POST to /edit/get
  useEffect(() => {
    if (
      (activeTab === "EDIT" || activeTab === "VIEW" || activeTab === "DELETE") &&
      filters.course &&
      filters.testName &&
      filters.subject &&
      filters.topic &&
      filters.testNo &&
      filters.language
    ) {
     fetch("https://localhost:7248/api/admin/tests/edit/get", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    course: filters.course,
    testName: filters.testName,
    subject: filters.subject,
    topic: filters.topic,
    testNo: filters.testNo,
    language: filters.language
  })
})

        .then(async (res) => {
          if (!res.ok) {
            setEditQuestions([]);
            setEditableRows({});
            return;
          }
          const data = await res.json();
          setEditQuestions(Array.isArray(data) ? data : [data]);
          setEditableRows({});
        })
        .catch(() => {
          setEditQuestions([]);
          setEditableRows({});
        });
    }
  }, [activeTab, filters]);

  // Handle select changes for EDIT
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Handle checkbox for row edit

  // Handle row field change
  const handleRowChange = (idx, field, value) => {
    setEditQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q))
    );
  };

  // Save changes for a row

  // ADD TAB STATE AND HANDLERS
  const [testDetails, setTestDetails] = useState({
    course: "",
    courseType: "",
    testName: "",
    subject: "",
    topic: "",
    testNo: "",
    date: "",
    language: "",
    timing: "",
    action: "",
  });
  const [question, setQuestion] = useState({
    questionNo: "",
    text: "",
    options: { A: "", B: "", C: "", D: "" },
    answer: "A",
    vertical: false,
    horizontal: false,
    timing: "", // <-- added (if you want per-question timing)
  });
  const [questions, setQuestions] = useState([]);

  const handleTestChange = (e) => {
    setTestDetails({ ...testDetails, [e.target.name]: e.target.value });
  };
  const handleQChange = (e) => {
    const { name, value, checked } = e.target;
    if (["vertical", "horizontal"].includes(name)) {
      setQuestion({ ...question, [name]: checked });
    } else if (["A", "B", "C", "D"].includes(name)) {
      setQuestion({
        ...question,
        options: { ...question.options, [name]: value },
      });
    } else {
      setQuestion({ ...question, [name]: value });
    }
  };
  const addQuestion = () => {
    setQuestions([...questions, question]);
    setQuestion({
      questionNo: "",
      text: "",
      options: { A: "", B: "", C: "", D: "" },
      answer: "A",
      vertical: false,
      horizontal: false,
      timing: "", // reset timing
    });
  };
  const clearQuestion = () => {
    setQuestion({
      questionNo: "",
      text: "",
      options: { A: "", B: "", C: "", D: "" },
      answer: "A",
      vertical: false,
      horizontal: false,
      timing: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const q of questions) {
      const payload = {
        course: testDetails.course,
        testName: testDetails.testName,
        subject: testDetails.subject,
        topic: testDetails.topic,
        testNo: testDetails.testNo,
        language: testDetails.language,
        date: testDetails.date,
        timing: testDetails.timing, // <-- send timing
        questionNo: q.questionNo,
        question: q.text,
        type:
          q.vertical && q.horizontal
            ? "Both"
            : q.vertical
            ? "Vertical"
            : q.horizontal
            ? "Horizontal"
            : "None",
        optionA: q.options.A,
        optionB: q.options.B,
        optionC: q.options.C,
        optionD: q.options.D,
        answer: q.answer,
      };

      const response = await fetch("https://localhost:7248/api/admin/tests/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        alert("Failed to add test for question " + (q.questionNo || q.text));
        return;
      }
    }

    alert("All questions added successfully!");
    setTestDetails({
      course: "",
      courseType: "",
      testName: "",
      subject: "",
      topic: "",
      testNo: "",
      date: "",
      language: "",
      timing: "",
      action: "",
    });
    setQuestions([]);
  };

  return (
    <div className="tests-root">
      {/* Tabs */}
      <div className="tabs-row">
        {TABS.map((tab) => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="tabs-underline" />

      {/* ADD TAB */}
      {activeTab === "ADD" && (
        <>
          {/* Test Details Form */}
          <div className="outer-box">
            <form className="test-details-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <label className="form-label bold">Course</label>
                <input
                  name="course"
                  value={testDetails.course}
                  onChange={handleTestChange}
                  className="form-input"
                  type="text"
                  placeholder="Enter Course"
                  required
                />
              </div>
              <div className="form-row">
                <label className="form-label bold">Test Name</label>
                <input
                  name="testName"
                  value={testDetails.testName}
                  onChange={handleTestChange}
                  className="form-input"
                  type="text"
                  required
                />
              </div>
              <div className="form-row">
                <label className="form-label bold">Subject</label>
                <input
                  name="subject"
                  value={testDetails.subject}
                  onChange={handleTestChange}
                  className="form-input"
                  type="text"
                  required
                />
              </div>
              <div className="form-row">
                <label className="form-label bold">Topic</label>
                <input
                  name="topic"
                  value={testDetails.topic}
                  onChange={handleTestChange}
                  className="form-input"
                  type="text"
                  required
                />
              </div>
              <div className="form-row">
                <label className="form-label bold">Test No.</label>
                <input
                  name="testNo"
                  value={testDetails.testNo}
                  onChange={handleTestChange}
                  className="form-input"
                  type="text"
                  required
                />
              </div>
              <div className="form-row">
                <label className="form-label bold">Language</label>
                <select
                  name="language"
                  value={testDetails.language || ""}
                  onChange={handleTestChange}
                  className="form-select"
                  required
                >
                  <option value="">Select</option>
                  <option value="Tamil" style={{ fontFamily: "'Noto Sans Tamil', Latha, Arial" }}>
                    தமிழ் (Tamil)
                  </option>
                  <option value="English" style={{ fontFamily: "Arial, sans-serif" }}>
                    English
                  </option>
                  <option value="Hindi" style={{ fontFamily: "'Noto Sans Devanagari', Mangal, Arial" }}>
                    हिंदी (Hindi)
                  </option>
                  <option value="Maths" style={{ fontFamily: "'Cambria Math', 'Times New Roman', serif" }}>
                    𝑀𝑎𝑡ℎ𝑠 (Maths)
                  </option>
                </select>
              </div>
              <div className="form-row">
                <label className="form-label bold">Date</label>
                <input
                  name="date"
                  value={testDetails.date}
                  onChange={handleTestChange}
                  className="form-input"
                  type="date"
                  required
                />
              </div>
              <div className="form-row">
                <label className="form-label bold">Duration (minutes)</label>
                <input
                  name="timing"
                  value={testDetails.timing}
                  onChange={handleTestChange}
                  className="form-input"
                  type="number"
                  min="1"
                  placeholder="Enter duration"
                  required
                />
              </div>
            </form>
          </div>

          {/* Question Form */}
          <div className="outer-box">
            <form className="question-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <label className="form-label bold">Question No.</label>
                <input
                  name="questionNo"
                  value={question.questionNo || ""}
                  onChange={handleQChange}
                  className="form-input"
                  type="text"
                  style={{ width: "120px", marginLeft: 12 }}
                  placeholder="Enter No."
                  required
                />
              </div>
              <div className="form-row">
                <label className="form-label bold">Question</label>
                <input
                  name="text"
                  value={question.text}
                  onChange={handleQChange}
                  className="form-input wide"
                  type="text"
                  style={{ fontFamily: getFontFamily(testDetails.language) }}
                  required
                />
              </div>
              <div className="form-row checkboxes-row">
                <label>
                  <input
                    type="checkbox"
                    name="vertical"
                    checked={question.vertical}
                    onChange={handleQChange}
                  />
                  Vertical
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="horizontal"
                    checked={question.horizontal}
                    onChange={handleQChange}
                  />
                  Horizontal
                </label>
              </div>
              {["A", "B", "C", "D"].map((opt) => (
                <div className="form-row" key={opt}>
                  <label className="form-label bold">{`Option ${opt}`}</label>
                  <input
                    name={opt}
                    value={question.options[opt]}
                    onChange={handleQChange}
                    className="form-input wide"
                    type="text"
                    style={{ fontFamily: getFontFamily(testDetails.language) }}
                    required
                  />
                </div>
              ))}
              <div className="form-row">
                <label className="form-label bold">Answer</label>
                <select
                  name="answer"
                  value={question.answer}
                  onChange={handleQChange}
                  className="form-select"
                  required
                >
                  {ANSWERS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div className="center">
                <button
                  type="button"
                  className="btn green"
                  onClick={addQuestion}
                  style={{ marginRight: 16 }}
                >
                  ADD MORE
                </button>
                <button
                  type="button"
                  className="btn red"
                  onClick={clearQuestion}
                >
                  CLEAR
                </button>
              </div>
            </form>
          </div>

          {/* Question Table */}
          <div className="outer-box">
            <table className="question-table">
              <thead>
                <tr>
                  <th>Question No.</th>
                  <th>Question</th>
                  <th>Type</th>
                  <th>Option A</th>
                  <th>Option B</th>
                  <th>Option C</th>
                  <th>Option D</th>
                  <th>Answer</th>
                  <th>Action</th>
                  {/* If you want per-question timing, add: <th>Timing</th> */}
                </tr>
              </thead>
              <tbody>
                {questions.map((q, idx) => (
                  <tr key={idx}>
                    <td>{q.questionNo || idx + 1}</td>
                    <td style={{ fontFamily: getFontFamily(testDetails.language) }}>{q.text}</td>
                    <td>
                      {q.vertical && q.horizontal
                        ? "Both"
                        : q.vertical
                        ? "Vertical"
                        : q.horizontal
                        ? "Horizontal"
                        : "None"}
                    </td>
                    <td style={{ fontFamily: getFontFamily(testDetails.language) }}>{q.options.A}</td>
                    <td style={{ fontFamily: getFontFamily(testDetails.language) }}>{q.options.B}</td>
                    <td style={{ fontFamily: getFontFamily(testDetails.language) }}>{q.options.C}</td>
                    <td style={{ fontFamily: getFontFamily(testDetails.language) }}>{q.options.D}</td>
                    <td>{q.answer}</td>
                    <td>
                      <button
                        type="button"
                        className="btn"
                        style={{
                          background: "transparent",
                          color: "#d32f2f",
                          border: "none",
                          fontSize: "18px",
                          cursor: "pointer",
                          padding: 0,
                        }}
                        onClick={() => {
                          setQuestions(questions.filter((_, i) => i !== idx));
                        }}
                        title="Remove"
                      >
                        &#10006;
                      </button>
                    </td>
                    {/* If you want per-question timing, add: <td>{q.timing}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="center" style={{ marginTop: 16 }}>
              <button className="btn blue" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </>
      )}

      {/* EDIT TAB */}
      {activeTab === "EDIT" && (
        <>
          <div className="outer-box">
            <form
              className="test-details-form"
              onSubmit={async (e) => {
                e.preventDefault();
                // Fetch the record for selected combo
                const res = await fetch("/api/admin/tests/edit/get", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    course: filters.course,
                    testName: filters.testName,
                    subject: filters.subject,
                    topic: filters.topic,
                    language: filters.language,
                  }),
                });
                if (res.ok) {
                  const data = await res.json();
                  setEditQuestions([data]);
                  setEditableRows({ 0: false }); // All fields locked by default
                } else {
                  setEditQuestions([]);
                  setEditableRows({});
                  alert("No record found for selection.");
                }
              }}
            >
              <div className="form-row">
                <label className="form-label bold">Course</label>
                <select name="course" value={filters.course} onChange={handleFilterChange} className="form-select" required>
                  <option value="">Select</option>
                  {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label className="form-label bold">Test Name</label>
                <select name="testName" value={filters.testName} onChange={handleFilterChange} className="form-select" required>
                  <option value="">Select</option>
                  {testNames.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label className="form-label bold">Subject</label>
                <select name="subject" value={filters.subject} onChange={handleFilterChange} className="form-select" required>
                  <option value="">Select</option>
                  {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label className="form-label bold">Topic</label>
                <select name="topic" value={filters.topic} onChange={handleFilterChange} className="form-select" required>
                  <option value="">Select</option>
                  {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label className="form-label bold">Test No.</label>
                <select name="testNo" value={filters.testNo} onChange={handleFilterChange} className="form-select" required>
                  <option value="">Select</option>
                  {testNos.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label className="form-label bold">Language</label>
                <select name="language" value={filters.language} onChange={handleFilterChange} className="form-select" required>
                  <option value="">Select</option>
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            
            </form>
          </div>
          <div className="outer-box">
            <table className="question-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Question No.</th>
                  <th>Question</th>
                  <th>Option A</th>
                  <th>Option B</th>
                  <th>Option C</th>
                  <th>Option D</th>
                  <th>Answer</th>
                  <th>Timing</th> {/* <-- Added */}
                  <th>Save</th>
                </tr>
              </thead>
              <tbody>
                {editQuestions.map((q, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        type="checkbox"
                        checked={!!editableRows[idx]}
                        onChange={() =>
                          setEditableRows((prev) => ({
                            ...prev,
                            [idx]: !prev[idx],
                          }))
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={q.questionNo}
                        disabled={!editableRows[idx]}
                        onChange={(e) => handleRowChange(idx, "questionNo", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={q.question}
                        disabled={!editableRows[idx]}
                        onChange={(e) => handleRowChange(idx, "question", e.target.value)}
                        style={{ fontFamily: getFontFamily(filters.language) }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={q.optionA}
                        disabled={!editableRows[idx]}
                        onChange={(e) => handleRowChange(idx, "optionA", e.target.value)}
                        style={{ fontFamily: getFontFamily(filters.language) }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={q.optionB}
                        disabled={!editableRows[idx]}
                        onChange={(e) => handleRowChange(idx, "optionB", e.target.value)}
                        style={{ fontFamily: getFontFamily(filters.language) }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={q.optionC}
                        disabled={!editableRows[idx]}
                        onChange={(e) => handleRowChange(idx, "optionC", e.target.value)}
                        style={{ fontFamily: getFontFamily(filters.language) }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={q.optionD}
                        disabled={!editableRows[idx]}
                        onChange={(e) => handleRowChange(idx, "optionD", e.target.value)}
                        style={{ fontFamily: getFontFamily(filters.language) }}
                      />
                    </td>
                    <td>
                      <select
                        value={q.answer}
                        disabled={!editableRows[idx]}
                        onChange={(e) => handleRowChange(idx, "answer", e.target.value)}
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={q.timing || ""}
                        disabled={!editableRows[idx]}
                        onChange={(e) => handleRowChange(idx, "timing", e.target.value)}
                        style={{ width: 60 }}
                      />
                    </td>
                    <td>
                      {editableRows[idx] && (
                        <button
                          className="btn blue"
                          style={{ padding: "2px 8px", fontSize: 13 }}
                        onClick={async () => {
  const Editable = {
    TestNo: true,
    Date: true,
    QuestionNo: true,
    Question: true,
    Type: true,
    OptionA: true,
    OptionB: true,
    OptionC: true,
    OptionD: true,
    Answer: true,
  };

  const payload = {
    Selection: {
      Course: filters.course,
      TestName: filters.testName,
      Subject: filters.subject,
      Topic: filters.topic,
      TestNo: filters.testNo,
      Language: filters.language,
    },
    TestNo: q.testNo || filters.testNo,
    Date: q.date || new Date().toISOString(),
    QuestionNo: q.questionNo,
    Question: q.question,
    Type: q.type || "Vertical",
    OptionA: q.optionA,
    OptionB: q.optionB,
    OptionC: q.optionC,
    OptionD: q.optionD,
    Answer: q.answer,
    Timing: q.timing,
    Editable,
  };

  // Step 1: Update on server
  await fetch("https://localhost:7248/api/admin/tests/edit/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Step 2: Re-fetch all records with same filter
  const res = await fetch("https://localhost:7248/api/admin/tests/edit/get", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      course: filters.course,
      testName: filters.testName,
      subject: filters.subject,
      topic: filters.topic,
      testNo: filters.testNo,
      language: filters.language,
    }),
  });

  if (res.ok) {
    const updatedData = await res.json();
    setEditQuestions(Array.isArray(updatedData) ? updatedData : [updatedData]);
    setEditableRows((prev) => ({ ...prev, [idx]: false }));
    alert("✅ Updated and reloaded successfully!");
  } else {
    alert("✅ Updated, but failed to reload. Please refresh manually.");
  }
}}

                          title="Save"
                        >
                          💾
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* VIEW TAB */}
      {activeTab === "VIEW" && (
        <>
          <div className="outer-box">
            <form className="test-details-form" onSubmit={e => e.preventDefault()}>
              <div className="form-row">
                <label className="form-label bold">Course</label>
                <select name="course" value={filters.course} onChange={handleFilterChange} className="form-select" required>
                  <option value="">Select</option>
                  {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label className="form-label bold">Test Name</label>
                <select name="testName" value={filters.testName} onChange={handleFilterChange} className="form-select" required>
                  <option value="">Select</option>
                  {testNames.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label className="form-label bold">Subject</label>
                <select name="subject" value={filters.subject} onChange={handleFilterChange} className="form-select" required>
                  <option value="">Select</option>
                  {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label className="form-label bold">Topic</label>
                <select name="topic" value={filters.topic} onChange={handleFilterChange} className="form-select" required>
                  <option value="">Select</option>
                  {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label className="form-label bold">Test No.</label>
                <select name="testNo" value={filters.testNo} onChange={handleFilterChange} className="form-select" required>
                  <option value="">Select</option>
                  {testNos.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label className="form-label bold">Language</label>
                <select name="language" value={filters.language} onChange={handleFilterChange} className="form-select" required>
                  <option value="">Select</option>
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </form>
          </div>
          <div className="outer-box">
            <table className="question-table">
              <thead>
                <tr>
                  <th>Question No.</th>
                  <th>Question</th>
                  <th>Type</th>
                  <th>Option A</th>
                  <th>Option B</th>
                  <th>Option C</th>
                  <th>Option D</th>
                  <th>Answer</th>
                  <th>Timing</th> {/* <-- Added */}
                </tr>
              </thead>
              <tbody>
                {editQuestions.map((q, idx) => (
                  <tr key={idx}>
                    <td>{q.questionNo}</td>
                    <td style={{ fontFamily: getFontFamily(filters.language) }}>{q.question}</td>
                    <td>{q.type}</td>
                    <td style={{ fontFamily: getFontFamily(filters.language) }}>{q.optionA}</td>
                    <td style={{ fontFamily: getFontFamily(filters.language) }}>{q.optionB}</td>
                    <td style={{ fontFamily: getFontFamily(filters.language) }}>{q.optionC}</td>
                    <td style={{ fontFamily: getFontFamily(filters.language) }}>{q.optionD}</td>
                    <td>{q.answer}</td>
                    <td>{q.timing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* DELETE TAB */}
      {activeTab === "DELETE" && (
        <>
          <div className="outer-box">
            <form className="test-details-form" onSubmit={e => e.preventDefault()}>
              <div className="form-row">
                <label className="form-label bold">Course</label>
                <select name="course" value={filters.course} onChange={handleFilterChange} className="form-select" required>
                  <option value="">Select</option>
                  {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label className="form-label bold">Test Name</label>
                <select name="testName" value={filters.testName} onChange={handleFilterChange} className="form-select" required>
                  <option value="">Select</option>
                  {testNames.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label className="form-label bold">Subject</label>
                <select name="subject" value={filters.subject} onChange={handleFilterChange} className="form-select" required>
                  <option value="">Select</option>
                  {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label className="form-label bold">Topic</label>
                <select name="topic" value={filters.topic} onChange={handleFilterChange} className="form-select" required>
                  <option value="">Select</option>
                  {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label className="form-label bold">Test No.</label>
                <select name="testNo" value={filters.testNo} onChange={handleFilterChange} className="form-select" required>
                  <option value="">Select</option>
                  {testNos.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label className="form-label bold">Language</label>
                <select name="language" value={filters.language} onChange={handleFilterChange} className="form-select" required>
                  <option value="">Select</option>
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </form>
          </div>

          <div className="outer-box">
            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <button
                className="btn red"
                onClick={async () => {
                  const confirm = window.confirm("Are you sure you want to delete all matching questions?");
                  if (!confirm) return;

                  const res = await fetch("https://localhost:7248/api/admin/tests/delete/bulk", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      course: filters.course,
                      testName: filters.testName,
                      subject: filters.subject,
                      topic: filters.topic,
                      testNo: filters.testNo,
                      language: filters.language,
                    }),
                  });

                  const data = await res.json();
                  if (res.ok) {
                    alert(data.message || "Deleted successfully!");
                    setEditQuestions([]); // Clear from UI
                  } else {
                    alert(data.message || "Delete failed.");
                  }
                }}
              >
                🗑️ Delete All Questions
              </button>
            </div>

            <table className="question-table">
              <thead>
                <tr>
          
            <th>Question No.</th>
            <th>Question</th>
            <th>Type</th>
            <th>Option A</th>
            <th>Option B</th>
            <th>Option C</th>
            <th>Option D</th>
            <th>Answer</th>
            <th>Timing</th> {/* <-- Added */}
                </tr>
              </thead>
              <tbody>
                {editQuestions.map((q, idx) => (
                  <tr key={idx}>
             
              <td>{q.questionNo}</td>
              <td style={{ fontFamily: getFontFamily(filters.language) }}>{q.question}</td>
              <td>{q.type}</td>
              <td style={{ fontFamily: getFontFamily(filters.language) }}>{q.optionA}</td>
              <td style={{ fontFamily: getFontFamily(filters.language) }}>{q.optionB}</td>
              <td style={{ fontFamily: getFontFamily(filters.language) }}>{q.optionC}</td>
              <td style={{ fontFamily: getFontFamily(filters.language) }}>{q.optionD}</td>
              <td>{q.answer}</td>
              <td>{q.timing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
