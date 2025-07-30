import React, { useState } from 'react';
import './Notes.css';

export default function Notes() {
  const [activeTab, setActiveTab] = useState("CLASS");

  return (
    <div className="center-box">
      {/* Tabs */}
      <div className="tab-bar">
        <span
          className={`tab ${activeTab === "CLASS" ? "active" : ""}`}
          onClick={() => setActiveTab("CLASS")}
        >
          CLASS
        </span>
        <span
          className={`tab ${activeTab === "TEST" ? "active" : ""}`}
          onClick={() => setActiveTab("TEST")}
        >
          TEST
        </span>
      </div>
      <div className="tab-underline"></div>

      {/* Inner Content Only */}
      <div className="form-content">
        <ModeForm activeTab={activeTab} />
      </div>
    </div>
  );
}

// Add this component at the bottom of the file:
function ModeForm({ activeTab }) {
  const [mode, setMode] = useState(""); // ADD, EDIT, VIEW, DELETE
  const [form, setForm] = useState({}); // Holds form data
  const [videoPreview, setVideoPreview] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [topicOptions, setTopicOptions] = useState([]);
  const [viewNote, setViewNote] = useState(null);
  const [deletePreview, setDeletePreview] = useState(null);
  const [testCourseOptions, setTestCourseOptions] = useState([]);
  const [testNameOptions, setTestNameOptions] = useState([]);
  const [testSubjectOptions, setTestSubjectOptions] = useState([]);
  const [testTopicOptions, setTestTopicOptions] = useState([]);
  const [testNoOptions, setTestNoOptions] = useState([]);
  const [viewExam, setViewExam] = useState(null);
  const [deleteTestPreview, setDeleteTestPreview] = useState(null);

  // Reset form when mode or tab changes
  React.useEffect(() => {
    setMode("");
    setForm({});
    setVideoPreview(null);
    setPdfPreview(null);
  }, [activeTab]);

  // Fetch courses when mode is EDIT and tab is CLASS
  React.useEffect(() => {
    if (activeTab === "CLASS" && mode === "EDIT") {
      fetch("https://localhost:7248/api/admin/notes/edit/courses")
        .then(res => res.json())
        .then(data => setCourseOptions(data || []));
    }
  }, [activeTab, mode]);

  // Fetch subjects when course changes
  React.useEffect(() => {
    if (activeTab === "CLASS" && mode === "EDIT" && form.course) {
      fetch(`https://localhost:7248/api/admin/notes/edit/subjects?course=${encodeURIComponent(form.course)}`)
        .then(res => res.json())
        .then(data => setSubjectOptions(data || []));
    } else {
      setSubjectOptions([]);
    }
  }, [form.course, activeTab, mode]);

  // Fetch topics when subject changes
  React.useEffect(() => {
    if (activeTab === "CLASS" && mode === "EDIT" && form.course && form.subject) {
      fetch(`https://localhost:7248/api/admin/notes/edit/topics?course=${encodeURIComponent(form.course)}&subject=${encodeURIComponent(form.subject)}`)
        .then(res => res.json())
        .then(data => setTopicOptions(data || []));
    } else {
      setTopicOptions([]);
    }
  }, [form.subject, form.course, activeTab, mode]);

  // Fetch courses for VIEW
  React.useEffect(() => {
    if (activeTab === "CLASS" && mode === "VIEW") {
      fetch("https://localhost:7248/api/admin/notes/view/courses")
        .then(res => res.json())
        .then(data => setCourseOptions(data || []));
    }
  }, [activeTab, mode]);

  // Fetch subjects for VIEW
  React.useEffect(() => {
    if (activeTab === "CLASS" && mode === "VIEW" && form.course) {
      fetch(`https://localhost:7248/api/admin/notes/view/subjects?course=${encodeURIComponent(form.course)}`)
        .then(res => res.json())
        .then(data => setSubjectOptions(data || []));
    } else if (mode === "VIEW") {
      setSubjectOptions([]);
    }
  }, [form.course, activeTab, mode]);

  // Fetch topics for VIEW
  React.useEffect(() => {
    if (activeTab === "CLASS" && mode === "VIEW" && form.course && form.subject) {
      fetch(`https://localhost:7248/api/admin/notes/view/topics?course=${encodeURIComponent(form.course)}&subject=${encodeURIComponent(form.subject)}`)
        .then(res => res.json())
        .then(data => setTopicOptions(data || []));
    } else if (mode === "VIEW") {
      setTopicOptions([]);
    }
  }, [form.subject, form.course, activeTab, mode]);

  // Fetch courses for DELETE
  React.useEffect(() => {
    if (activeTab === "CLASS" && mode === "DELETE") {
      fetch("https://localhost:7248/api/admin/notes/delete/courses")
        .then(res => res.json())
        .then(data => setCourseOptions(data || []));
    }
  }, [activeTab, mode]);

  // Fetch subjects for DELETE
  React.useEffect(() => {
    if (activeTab === "CLASS" && mode === "DELETE" && form.course) {
      fetch(`https://localhost:7248/api/admin/notes/delete/subjects?course=${encodeURIComponent(form.course)}`)
        .then(res => res.json())
        .then(data => setSubjectOptions(data || []));
    } else if (mode === "DELETE") {
      setSubjectOptions([]);
    }
  }, [form.course, activeTab, mode]);

  // Fetch topics for DELETE
  React.useEffect(() => {
    if (activeTab === "CLASS" && mode === "DELETE" && form.course && form.subject) {
      fetch(`https://localhost:7248/api/admin/notes/delete/topics?course=${encodeURIComponent(form.course)}&subject=${encodeURIComponent(form.subject)}`)
        .then(res => res.json())
        .then(data => setTopicOptions(data || []));
    } else if (mode === "DELETE") {
      setTopicOptions([]);
    }
  }, [form.subject, form.course, activeTab, mode]);

  // Fetch courses for TEST EDIT
  React.useEffect(() => {
    if (activeTab === "TEST" && mode === "EDIT") {
      fetch("https://localhost:7248/api/admin/exam/edit/courses")
        .then(res => res.json())
        .then(data => setTestCourseOptions(data || []));
    }
  }, [activeTab, mode]);

  // Fetch test names for TEST EDIT
  React.useEffect(() => {
    if (activeTab === "TEST" && mode === "EDIT" && form.course) {
      fetch(`https://localhost:7248/api/admin/exam/edit/testnames?course=${encodeURIComponent(form.course)}`)
        .then(res => res.json())
        .then(data => setTestNameOptions(data || []));
    } else if (mode === "EDIT") {
      setTestNameOptions([]);
    }
  }, [form.course, activeTab, mode]);

  // Fetch subjects for TEST EDIT
  React.useEffect(() => {
    if (activeTab === "TEST" && mode === "EDIT" && form.course && form.testName) {
      fetch(`https://localhost:7248/api/admin/exam/edit/subjects?course=${encodeURIComponent(form.course)}&testName=${encodeURIComponent(form.testName)}`)
        .then(res => res.json())
        .then(data => setTestSubjectOptions(data || []));
    } else if (mode === "EDIT") {
      setTestSubjectOptions([]);
    }
  }, [form.course, form.testName, activeTab, mode]);

  // Fetch topics for TEST EDIT
  React.useEffect(() => {
    if (activeTab === "TEST" && mode === "EDIT" && form.course && form.testName && form.subject) {
      fetch(`https://localhost:7248/api/admin/exam/edit/topics?course=${encodeURIComponent(form.course)}&testName=${encodeURIComponent(form.testName)}&subject=${encodeURIComponent(form.subject)}`)
        .then(res => res.json())
        .then(data => setTestTopicOptions(data || []));
    } else if (mode === "EDIT") {
      setTestTopicOptions([]);
    }
  }, [form.course, form.testName, form.subject, activeTab, mode]);

  // Fetch test nos for TEST EDIT
  React.useEffect(() => {
    if (activeTab === "TEST" && mode === "EDIT" && form.course && form.testName && form.subject && form.topic) {
      fetch(`https://localhost:7248/api/admin/exam/edit/testnos?course=${encodeURIComponent(form.course)}&testName=${encodeURIComponent(form.testName)}&subject=${encodeURIComponent(form.subject)}&topic=${encodeURIComponent(form.topic)}`)
        .then(res => res.json())
        .then(data => setTestNoOptions(data || []));
    } else if (mode === "EDIT") {
      setTestNoOptions([]);
    }
  }, [form.course, form.testName, form.subject, form.topic, activeTab, mode]);

  // Fetch courses for TEST VIEW
  React.useEffect(() => {
    if (activeTab === "TEST" && mode === "VIEW") {
      fetch("https://localhost:7248/api/admin/exam/view/courses")
        .then(res => res.json())
        .then(data => setTestCourseOptions(data || []));
    }
  }, [activeTab, mode]);

  // Fetch test names for TEST VIEW
  React.useEffect(() => {
    if (activeTab === "TEST" && mode === "VIEW" && form.course) {
      fetch(`https://localhost:7248/api/admin/exam/view/testnames?course=${encodeURIComponent(form.course)}`)
        .then(res => res.json())
        .then(data => setTestNameOptions(data || []));
    } else if (mode === "VIEW") {
      setTestNameOptions([]);
    }
  }, [form.course, activeTab, mode]);

  // Fetch subjects for TEST VIEW
  React.useEffect(() => {
    if (activeTab === "TEST" && mode === "VIEW" && form.course && form.testName) {
      fetch(`https://localhost:7248/api/admin/exam/view/subjects?course=${encodeURIComponent(form.course)}&testName=${encodeURIComponent(form.testName)}`)
        .then(res => res.json())
        .then(data => setTestSubjectOptions(data || []));
    } else if (mode === "VIEW") {
      setTestSubjectOptions([]);
    }
  }, [form.course, form.testName, activeTab, mode]);

  // Fetch topics for TEST VIEW
  React.useEffect(() => {
    if (activeTab === "TEST" && mode === "VIEW" && form.course && form.testName && form.subject) {
      fetch(`https://localhost:7248/api/admin/exam/view/topics?course=${encodeURIComponent(form.course)}&testName=${encodeURIComponent(form.testName)}&subject=${encodeURIComponent(form.subject)}`)
        .then(res => res.json())
        .then(data => setTestTopicOptions(data || []));
    } else if (mode === "VIEW") {
      setTestTopicOptions([]);
    }
  }, [form.course, form.testName, form.subject, activeTab, mode]);

  // Fetch test nos for TEST VIEW
  React.useEffect(() => {
    if (activeTab === "TEST" && mode === "VIEW" && form.course && form.testName && form.subject && form.topic) {
      fetch(`https://localhost:7248/api/admin/exam/view/testnos?course=${encodeURIComponent(form.course)}&testName=${encodeURIComponent(form.testName)}&subject=${encodeURIComponent(form.subject)}&topic=${encodeURIComponent(form.topic)}`)
        .then(res => res.json())
        .then(data => setTestNoOptions(data || []));
    } else if (mode === "VIEW") {
      setTestNoOptions([]);
    }
  }, [form.course, form.testName, form.subject, form.topic, activeTab, mode]);

  // Fetch courses for TEST DELETE
  React.useEffect(() => {
    if (activeTab === "TEST" && mode === "DELETE") {
      fetch("https://localhost:7248/api/admin/exam/delete/courses")
        .then(res => res.json())
        .then(data => setTestCourseOptions(data || []));
    }
  }, [activeTab, mode]);

  // Fetch test names for TEST DELETE
  React.useEffect(() => {
    if (activeTab === "TEST" && mode === "DELETE" && form.course) {
      fetch(`https://localhost:7248/api/admin/exam/delete/testnames?course=${encodeURIComponent(form.course)}`)
        .then(res => res.json())
        .then(data => setTestNameOptions(data || []));
    } else if (mode === "DELETE") {
      setTestNameOptions([]);
    }
  }, [form.course, activeTab, mode]);

  // Fetch subjects for TEST DELETE
  React.useEffect(() => {
    if (activeTab === "TEST" && mode === "DELETE" && form.course && form.testName) {
      fetch(`https://localhost:7248/api/admin/exam/delete/subjects?course=${encodeURIComponent(form.course)}&testName=${encodeURIComponent(form.testName)}`)
        .then(res => res.json())
        .then(data => setTestSubjectOptions(data || []));
    } else if (mode === "DELETE") {
      setTestSubjectOptions([]);
    }
  }, [form.course, form.testName, activeTab, mode]);

  // Fetch topics for TEST DELETE
  React.useEffect(() => {
    if (activeTab === "TEST" && mode === "DELETE" && form.course && form.testName && form.subject) {
      fetch(`https://localhost:7248/api/admin/exam/delete/topics?course=${encodeURIComponent(form.course)}&testName=${encodeURIComponent(form.testName)}&subject=${encodeURIComponent(form.subject)}`)
        .then(res => res.json())
        .then(data => setTestTopicOptions(data || []));
    } else if (mode === "DELETE") {
      setTestTopicOptions([]);
    }
  }, [form.course, form.testName, form.subject, activeTab, mode]);

  // Fetch test nos for TEST DELETE
  React.useEffect(() => {
    if (activeTab === "TEST" && mode === "DELETE" && form.course && form.testName && form.subject && form.topic) {
      fetch(`https://localhost:7248/api/admin/exam/delete/testnos?course=${encodeURIComponent(form.course)}&testName=${encodeURIComponent(form.testName)}&subject=${encodeURIComponent(form.subject)}&topic=${encodeURIComponent(form.topic)}`)
        .then(res => res.json())
        .then(data => setTestNoOptions(data || []));
    } else if (mode === "DELETE") {
      setTestNoOptions([]);
    }
  }, [form.course, form.testName, form.subject, form.topic, activeTab, mode]);

  // Helper for rendering input/select
  const renderInput = (label, name, type = "text", isSelect = false, options = []) => (
    <div className="form-row">
      <label>{label}:</label>
      {isSelect ? (
        <select
          value={form[name] || ""}
          onChange={e => {
            const value = e.target.value;
            setForm(f => {
              if (name === "course") {
                // Reset subject and topic when course changes
                return { ...f, course: value, subject: "", topic: "" };
              }
              if (name === "subject") {
                // Reset topic when subject changes
                return { ...f, subject: value, topic: "" };
              }
              return { ...f, [name]: value };
            });
          }}
        >
          <option value="">Select {label}</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={form[name] || ""}
          onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        />
      )}
    </div>
  );

  // File input with preview
  const renderFileInput = (label, name, accept, preview, setPreview) => (
    <div className="form-row">
      <label>{label}:</label>
      <input
        type="file"
        accept={accept}
        onChange={e => {
          const file = e.target.files[0];
          setForm(f => ({ ...f, [name]: file }));
          if (file) setPreview(URL.createObjectURL(file));
          else setPreview(null);
        }}
      />
      {preview && (
        <span
          className="preview-icon"
          style={{ cursor: "pointer", marginLeft: 8 }}
          onClick={() => window.open(preview, "_blank")}
          title={`Preview ${label}`}
        >👁️</span>
      )}
    </div>
  );

    // Handler for ADD in TEST tab
  const handleTestAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Course", form.course || "");
    formData.append("TestName", form.testName || "");
    formData.append("Subject", form.subject || "");
    formData.append("Topic", form.topic || "");
    formData.append("TestNo", form.testNo || "");
    if (form.video) formData.append("VideoFile", form.video);
    if (form.pdf) formData.append("PdfFile", form.pdf);

    try {
      const res = await fetch("https://localhost:7248/api/admin/exam/add", { // <-- FIXED URL
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Test note added successfully!");
        setForm({});
        setVideoPreview(null);
        setPdfPreview(null);
      } else {
        alert((data.message || "Add failed.") + (data.errors ? "\n" + JSON.stringify(data.errors) : ""));
      }
    } catch {
      alert("Error submitting test note form.");
    }
  };

  // Button styles
  const btnStyle = color => ({
    background: color,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    width: "100%",
    padding: "10px 0",
    margin: "8px 0",
    fontWeight: "bold",
    fontSize: 16,
    cursor: "pointer"
  });

  // ADD handler for CLASS
  const handleClassAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Mode", "ADD"); // <-- Add this line!
    formData.append("Course", form.course || "");
    formData.append("Subject", form.subject || "");
    formData.append("Topic", form.topic || "");
    if (form.video) formData.append("VideoFile", form.video);
    if (form.pdf) formData.append("PdfFile", form.pdf);

    try {
      const res = await fetch("https://localhost:7248/api/admin/notes/add", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Added successfully!");
        setForm({});
        setVideoPreview(null);
        setPdfPreview(null);
      } else {
        alert((data.message || "Add failed.") + (data.errors ? "\n" + JSON.stringify(data.errors) : ""));
      }
    } catch {
      alert("Error submitting form.");
    }
  };

  // EDIT handler for CLASS
  const handleClassEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Mode", "EDIT");
    formData.append("Course", form.course || "");
    formData.append("Subject", form.subject || "");
    formData.append("Topic", form.topic || "");
    if (form.video) formData.append("VideoFile", form.video);
    if (form.pdf) formData.append("PdfFile", form.pdf);

    try {
      const res = await fetch("https://localhost:7248/api/admin/notes/edit", {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Note updated successfully!");
        setForm({});
        setVideoPreview(null);
        setPdfPreview(null);
      } else {
        alert((data.message || "Update failed.") + (data.errors ? "\n" + JSON.stringify(data.errors) : ""));
      }
    } catch {
      alert("Error updating note.");
    }
  };

  // VIEW handler for CLASS
  const handleClassView = async (e) => {
    e.preventDefault();
    setViewNote(null);
    if (!form.course || !form.subject || !form.topic) {
      alert("Please select Course, Subject, and Topic.");
      return;
    }
    try {
      const res = await fetch(
        `https://localhost:7248/api/admin/notes/view/by-selection?course=${encodeURIComponent(form.course)}&subject=${encodeURIComponent(form.subject)}&topic=${encodeURIComponent(form.topic)}`
      );
      const data = await res.json();
      if (res.ok) {
        setViewNote(data);
      } else {
        alert(data.message || "Note not found.");
      }
    } catch {
      alert("Error fetching note.");
    }
  };

  // DELETE handler for CLASS
  const handleClassDelete = async (e) => {
    e.preventDefault();
    if (!form.course || !form.subject || !form.topic) {
      alert("Please select Course, Subject, and Topic.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const res = await fetch(
        `https://localhost:7248/api/admin/notes/delete?course=${encodeURIComponent(form.course)}&subject=${encodeURIComponent(form.subject)}&topic=${encodeURIComponent(form.topic)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Note deleted successfully!");
        setForm({});
        setVideoPreview(null);
        setPdfPreview(null);
      } else {
        alert(data.message || "Delete failed.");
      }
    } catch {
      alert("Error deleting note.");
    }
  };

  // Handler to fetch and show preview before delete
  const handleDeletePreview = async (e) => {
    e.preventDefault();
    setDeletePreview(null);
    if (!form.course || !form.subject || !form.topic) {
      alert("Please select Course, Subject, and Topic.");
      return;
    }
    try {
      const res = await fetch(
        `https://localhost:7248/api/admin/notes/view/by-selection?course=${encodeURIComponent(form.course)}&subject=${encodeURIComponent(form.subject)}&topic=${encodeURIComponent(form.topic)}`
      );
      const data = await res.json();
      if (res.ok) {
        setDeletePreview(data);
      } else {
        alert(data.message || "Note not found.");
      }
    } catch {
      alert("Error fetching note for delete preview.");
    }
  };

  // Handler for VIEW in TEST tab
  const handleTestView = async (e) => {
    e.preventDefault();
    setViewExam(null);
    if (!form.course || !form.testName || !form.subject || !form.topic || !form.testNo) {
      alert("Please select Course, Test Name, Subject, Topic, and Test No.");
      return;
    }
    try {
      const res = await fetch(
        `https://localhost:7248/api/admin/exam/view/fetch?course=${encodeURIComponent(form.course)}&testName=${encodeURIComponent(form.testName)}&subject=${encodeURIComponent(form.subject)}&topic=${encodeURIComponent(form.topic)}&testNo=${encodeURIComponent(form.testNo)}`
      );
      const data = await res.json();
      if (res.ok) {
        setViewExam(data);
      } else {
        alert(data.message || "Exam not found.");
      }
    } catch {
      alert("Error fetching exam.");
    }
  };

  // Form fields by mode/tab
  let fields = [];
  if (activeTab === "CLASS") {
    if (mode === "ADD") {
      fields = [
        renderInput("Course", "course"),
        renderInput("Subject", "subject"),
        renderInput("Topic", "topic"),
        renderFileInput("Video", "video", "video/*", videoPreview, setVideoPreview),
        renderFileInput("PDF", "pdf", "application/pdf", pdfPreview, setPdfPreview),
        <button style={btnStyle("green")} onClick={handleClassAdd} type="button">ADD</button>,
        <button style={btnStyle("red")} type="button" onClick={() => { setForm({}); setVideoPreview(null); setPdfPreview(null); }}>CLEAR</button>
      ];
    } else if (mode === "EDIT") {
      fields = [
        renderInput("Course", "course", "text", true, courseOptions),
        renderInput("Subject", "subject", "text", true, subjectOptions),
        renderInput("Topic", "topic", "text", true, topicOptions),
        renderFileInput("Video", "video", "video/*", videoPreview, setVideoPreview),
        renderFileInput("PDF", "pdf", "application/pdf", pdfPreview, setPdfPreview),
        <button style={btnStyle("brown")} onClick={handleClassEdit} type="button">EDIT</button>,
        <button style={btnStyle("red")} type="button" onClick={() => { setForm({}); setVideoPreview(null); setPdfPreview(null); }}>CLEAR</button>
      ];
    } else if (mode === "VIEW") {
      fields = [
        renderInput("Course", "course", "text", true, courseOptions),
        renderInput("Subject", "subject", "text", true, subjectOptions),
        renderInput("Topic", "topic", "text", true, topicOptions),
        <button style={btnStyle("green")} onClick={handleClassView} type="button">VIEW</button>,
        viewNote && (
          <div style={{ margin: "16px 0", background: "#f9f9f9", padding: 16, borderRadius: 8 }}>
            <div><b>Course:</b> {viewNote.course}</div>
            <div><b>Subject:</b> {viewNote.subject}</div>
            <div><b>Topic:</b> {viewNote.topic}</div>
            {viewNote.videoPath && (
              <div style={{ margin: "10px 0" }}>
                <span className="preview-icon" onClick={() => setShowVideoPreview(v => !v)} title="Preview Video">🎬</span>
                {showVideoPreview && (
                  <video
                    src={`https://localhost:7248${viewNote.videoPath}`}
                    controls
                    style={{ display: "block", width: "100%", maxHeight: 300, marginTop: 8, borderRadius: 8, background: "#000" }}
                  />
                )}
              </div>
            )}
            {viewNote.pdfPath && (
              <div style={{ margin: "10px 0" }}>
                <span className="preview-icon" onClick={() => setShowPdfPreview(p => !p)} title="Preview PDF">📄</span>
                {showPdfPreview && (
                  <iframe
                    src={`https://localhost:7248${viewNote.pdfPath}`}
                    style={{ display: "block", width: "100%", height: 400, marginTop: 8, borderRadius: 8, background: "#fff" }}
                    title="PDF Preview"
                  />
                )}
              </div>
            )}
          </div>
        )
      ];
    } else if (mode === "DELETE") {
      fields = [
        renderInput("Course", "course", "text", true, courseOptions),
        renderInput("Subject", "subject", "text", true, subjectOptions),
        renderInput("Topic", "topic", "text", true, topicOptions),
        <button style={btnStyle("blue")} onClick={handleDeletePreview} type="button">SUBMIT</button>,
        deletePreview && (
          <div style={{ margin: "16px 0", background: "#f9f9f9", padding: 16, borderRadius: 8 }}>
            <div><b>Course:</b> {deletePreview.course}</div>
            <div><b>Subject:</b> {deletePreview.subject}</div>
            <div><b>Topic:</b> {deletePreview.topic}</div>
            {deletePreview.videoPath && (
              <div style={{ margin: "10px 0" }}>
                <span className="preview-icon" onClick={() => setShowVideoPreview(v => !v)} title="Preview Video">🎬</span>
                {showVideoPreview && (
                  <video
                    src={`https://localhost:7248${deletePreview.videoPath}`}
                    controls
                    style={{ display: "block", width: "100%", maxHeight: 300, marginTop: 8, borderRadius: 8, background: "#000" }}
                  />
                )}
              </div>
            )}
            {deletePreview.pdfPath && (
              <div style={{ margin: "10px 0" }}>
                <span className="preview-icon" onClick={() => setShowPdfPreview(p => !p)} title="Preview PDF">📄</span>
                {showPdfPreview && (
                  <iframe
                    src={`https://localhost:7248${deletePreview.pdfPath}`}
                    style={{ display: "block", width: "100%", height: 400, marginTop: 8, borderRadius: 8, background: "#fff" }}
                    title="PDF Preview"
                  />
                )}
              </div>
            )}
            <button
              style={btnStyle("red")}
              onClick={async (e) => {
                await handleClassDelete(e);
                setDeletePreview(null);
              }}
              type="button"
            >DELETE</button>
            <button
              style={btnStyle("gray")}
              type="button"
              onClick={() => { setDeletePreview(null); }}
            >CANCEL</button>
          </div>
        ),
        <button style={btnStyle("red")} type="button" onClick={() => { setForm({}); setVideoPreview(null); setPdfPreview(null); setDeletePreview(null); }}>CLEAR</button>
      ];
    }
  } else if (activeTab === "TEST") {
    if (mode === "ADD") {
      fields = [
        renderInput("Course", "course"),
        renderInput("Test Name", "testName"),
        renderInput("Subject", "subject"),
        renderInput("Topic", "topic"),
        renderInput("Test No", "testNo"),
        renderFileInput("Video", "video", "video/*", videoPreview, setVideoPreview),
        renderFileInput("PDF", "pdf", "application/pdf", pdfPreview, setPdfPreview),
        <button style={btnStyle("green")} onClick={handleTestAdd} type="button">ADD</button>,
        <button style={btnStyle("red")} type="button" onClick={() => { setForm({}); setVideoPreview(null); setPdfPreview(null); }}>CLEAR</button>
      ];
    } else if (mode === "EDIT") {
      // Define handleTestEdit for TEST/EDIT mode
      const handleTestEdit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("Course", form.course || "");
        formData.append("TestName", form.testName || "");
        formData.append("Subject", form.subject || "");
        formData.append("Topic", form.topic || "");
        formData.append("TestNo", form.testNo || "");
        if (form.video) formData.append("VideoFile", form.video);
        if (form.pdf) formData.append("PdfFile", form.pdf);

        try {
          const res = await fetch("https://localhost:7248/api/admin/exam/edit", {
            method: "PUT",
            body: formData,
          });
          const data = await res.json();
          if (res.ok) {
            alert(data.message || "Test note updated successfully!");
            setForm({});
            setVideoPreview(null);
            setPdfPreview(null);
          } else {
            alert((data.message || "Update failed.") + (data.errors ? "\n" + JSON.stringify(data.errors) : ""));
          }
        } catch {
          alert("Error updating test note.");
        }
      };

      fields = [
        renderInput("Course", "course", "text", true, testCourseOptions),
        renderInput("Test Name", "testName", "text", true, testNameOptions),
        renderInput("Subject", "subject", "text", true, testSubjectOptions),
        renderInput("Topic", "topic", "text", true, testTopicOptions),
        renderInput("Test No", "testNo", "text", true, testNoOptions),
        renderFileInput("Video", "video", "video/*", videoPreview, setVideoPreview),
        renderFileInput("PDF", "pdf", "application/pdf", pdfPreview, setPdfPreview),
        <button style={btnStyle("brown")} onClick={handleTestEdit} type="button">UPDATE</button>,
        <button style={btnStyle("red")} type="button" onClick={() => { setForm({}); setVideoPreview(null); setPdfPreview(null); }}>CLEAR</button>
      ];
    } else if (mode === "VIEW") {
      fields = [
        renderInput("Course", "course", "text", true, testCourseOptions),
        renderInput("Test Name", "testName", "text", true, testNameOptions),
        renderInput("Subject", "subject", "text", true, testSubjectOptions),
        renderInput("Topic", "topic", "text", true, testTopicOptions),
        renderInput("Test No", "testNo", "text", true, testNoOptions),
        <button style={btnStyle("green")} onClick={handleTestView} type="button">VIEW</button>,
        viewExam && (
          <div style={{ margin: "16px 0", background: "#f9f9f9", padding: 16, borderRadius: 8 }}>
            <div><b>Course:</b> {viewExam.course}</div>
            <div><b>Test Name:</b> {viewExam.testName}</div>
            <div><b>Subject:</b> {viewExam.subject}</div>
            <div><b>Topic:</b> {viewExam.topic}</div>
            <div><b>Test No:</b> {viewExam.testNo}</div>
            {viewExam.video && (
              <div style={{ margin: "10px 0" }}>
                <span className="preview-icon" onClick={() => setShowVideoPreview(v => !v)} title="Preview Video">🎬</span>
                {showVideoPreview && (
                  <video
                    src={`https://localhost:7248${viewExam.video}`}
                    controls
                    style={{ display: "block", width: "100%", maxHeight: 300, marginTop: 8, borderRadius: 8, background: "#000" }}
                  />
                )}
              </div>
            )}
            {viewExam.pdf && (
              <div style={{ margin: "10px 0" }}>
                <span className="preview-icon" onClick={() => setShowPdfPreview(p => !p)} title="Preview PDF">📄</span>
                {showPdfPreview && (
                  <iframe
                    src={`https://localhost:7248${viewExam.pdf}`}
                    style={{ display: "block", width: "100%", height: 400, marginTop: 8, borderRadius: 8, background: "#fff" }}
                    title="PDF Preview"
                  />
                )}
              </div>
            )}
          </div>
        )
      ];
    } else if (mode === "DELETE") {
      // Define handleTestDeletePreview for TEST/DELETE mode
      const handleTestDeletePreview = async (e) => {
        e.preventDefault();
        setDeleteTestPreview(null);
        if (!form.course || !form.testName || !form.subject || !form.topic || !form.testNo) {
          alert("Please select Course, Test Name, Subject, Topic, and Test No.");
          return;
        }
        try {
          const res = await fetch(
            `https://localhost:7248/api/admin/exam/view/fetch?course=${encodeURIComponent(form.course)}&testName=${encodeURIComponent(form.testName)}&subject=${encodeURIComponent(form.subject)}&topic=${encodeURIComponent(form.topic)}&testNo=${encodeURIComponent(form.testNo)}`
          );
          const data = await res.json();
          if (res.ok) {
            setDeleteTestPreview(data);
          } else {
            alert(data.message || "Test note not found.");
          }
        } catch {
          alert("Error fetching test note for delete preview.");
        }
      };

      // Define handleTestDelete for TEST/DELETE mode
      const handleTestDelete = async (e) => {
        e.preventDefault();
        if (!form.course || !form.testName || !form.subject || !form.topic || !form.testNo) {
          alert("Please select Course, Test Name, Subject, Topic, and Test No.");
          return;
        }
        if (!window.confirm("Are you sure you want to delete this test note?")) return;
        try {
          const res = await fetch(
            `https://localhost:7248/api/admin/exam/delete?course=${encodeURIComponent(form.course)}&testName=${encodeURIComponent(form.testName)}&subject=${encodeURIComponent(form.subject)}&topic=${encodeURIComponent(form.topic)}&testNo=${encodeURIComponent(form.testNo)}`,
            { method: "DELETE" }
          );
          const data = await res.json();
          if (res.ok) {
            alert(data.message || "Test note deleted successfully!");
            setForm({});
            setVideoPreview(null);
            setPdfPreview(null);
          } else {
            alert(data.message || "Delete failed.");
          }
        } catch {
          alert("Error deleting test note.");
        }
      };

      fields = [
        renderInput("Course", "course", "text", true, testCourseOptions),
        renderInput("Test Name", "testName", "text", true, testNameOptions),
        renderInput("Subject", "subject", "text", true, testSubjectOptions),
        renderInput("Topic", "topic", "text", true, testTopicOptions),
        renderInput("Test No", "testNo", "text", true, testNoOptions),
        <button style={btnStyle("blue")} onClick={handleTestDeletePreview} type="button">SUBMIT</button>,
        deleteTestPreview && (
          <div style={{ margin: "16px 0", background: "#f9f9f9", padding: 16, borderRadius: 8 }}>
            <div><b>Course:</b> {deleteTestPreview.course}</div>
            <div><b>Test Name:</b> {deleteTestPreview.testName}</div>
            <div><b>Subject:</b> {deleteTestPreview.subject}</div>
            <div><b>Topic:</b> {deleteTestPreview.topic}</div>
            <div><b>Test No:</b> {deleteTestPreview.testNo}</div>
            {deleteTestPreview.video && (
              <div style={{ margin: "10px 0" }}>
                <span className="preview-icon" onClick={() => setShowVideoPreview(v => !v)} title="Preview Video">🎬</span>
                {showVideoPreview && (
                  <video
                    src={`https://localhost:7248${deleteTestPreview.video}`}
                    controls
                    style={{ display: "block", width: "100%", maxHeight: 300, marginTop: 8, borderRadius: 8, background: "#000" }}
                  />
                )}
              </div>
            )}
            {deleteTestPreview.pdf && (
              <div style={{ margin: "10px 0" }}>
                <span className="preview-icon" onClick={() => setShowPdfPreview(p => !p)} title="Preview PDF">📄</span>
                {showPdfPreview && (
                  <iframe
                    src={`https://localhost:7248${deleteTestPreview.pdf}`}
                    style={{ display: "block", width: "100%", height: 400, marginTop: 8, borderRadius: 8, background: "#fff" }}
                    title="PDF Preview"
                  />
                )}
              </div>
            )}
            <button
              style={btnStyle("red")}
              onClick={async (e) => {
                await handleTestDelete(e);
                setDeleteTestPreview(null);
              }}
              type="button"
            >DELETE</button>
            <button
              style={btnStyle("gray")}
              type="button"
              onClick={() => { setDeleteTestPreview(null); }}
            >CANCEL</button>
          </div>
        ),
        <button style={btnStyle("red")} type="button" onClick={() => { setForm({}); setVideoPreview(null); setPdfPreview(null); setDeleteTestPreview(null); }}>CLEAR</button>
      ];
    }
  }

  return (
    <div>
      <div className="form-row">
        <label>Mode:</label>
        <select value={mode} onChange={e => setMode(e.target.value)}>
          <option value="">Select Mode</option>
          <option value="ADD">ADD</option>
          <option value="EDIT">EDIT</option>
          <option value="VIEW">VIEW</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
      {mode && <div>{fields}</div>}
    </div>
  );
}
