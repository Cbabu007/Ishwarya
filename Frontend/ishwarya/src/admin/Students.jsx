import React, { useState } from "react";
import { FaFilter } from "react-icons/fa";
import "./Students.css";

const initialEducation = { degreeType: "", degreeName: "", instituteName: "", yearPassed: "" };

// Helper function to map education array to backend fields
const mapEducationToBackend = (educationArr) => {
  const eduFields = {};
  let count = 1;
  for (let i = 0; i < educationArr.length; i++) {
    const ed = educationArr[i];
    // Only add if at least one field is filled
    if (ed.degreeType || ed.degreeName || ed.instituteName || ed.yearPassed) {
      eduFields[`DegreeType${count}`] = ed.degreeType || "";
      eduFields[`DegreeName${count}`] = ed.degreeName || "";
      eduFields[`InstituteName${count}`] = ed.instituteName || "";
      eduFields[`YearPassedOut${count}`] = ed.yearPassed || "";
      count++;
    }
  }
  return eduFields;
};

const Students = () => {
  const [activeTab, setActiveTab] = useState("ADD");
  const [form, setForm] = useState({
    role: "Student",
    course: "",
    otherCourse: "",
    id: "",
    photo: null,
    photoPreview: null,
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    bloodGroup: "",
    PhoneNumber: "",
    AlternativePhoneNumber: "",
    email: "",
    admissionDate: "",
    fatherName: "",
    fatherOccupation: "",
    FatherPhoneNumber: "",
    motherName: "",
    motherOccupation: "",
    MotherPhoneNumber: "",
    parentEmail: "",
    AadharNumber: "",
    aadharFile: null,
    aadharPreview: null,
    religion: "",
    otherReligion: "",
    caste: "",
    otherCaste: "",
    casteName: "",
    nationality: "",
    addressType: "Permanent Address",
    doorNo: "",
    street: "",
    area: "",
    city: "",
    district: "",
    state: "",
    Pincode: "",
    education: [ { ...initialEducation } ],
    username: "",
    password: "",
  });
  const [editId, setEditId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [viewId, setViewId] = useState("");
  const [viewCourse, setViewCourse] = useState("");
  const [viewResult, setViewResult] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");
  const [filterYear, setFilterYear] = useState(""); // <-- Add this line

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files && files[0];
      if (name === "aadharFile") {
        setForm((prev) => ({
          ...prev,
          aadharFile: file,
          aadharPreview: file ? URL.createObjectURL(file) : null,
        }));
      } else if (name === "photo") {
        setForm((prev) => ({
          ...prev,
          photo: file,
          photoPreview: file ? URL.createObjectURL(file) : null,
        }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleEducationChange = (idx, e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const education = prev.education.map((ed, i) =>
        i === idx ? { ...ed, [name]: value } : ed
      );
      return { ...prev, education };
    });
  };
  const addEducation = () => {
    setForm((prev) => ({ ...prev, education: [ ...prev.education, { ...initialEducation } ] }));
  };
  const removeEducation = (idx) => {
    setForm((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }));
  };
  const handleClear = () => {
    setForm({
      ...Object.fromEntries(Object.keys(form).map(k => [k, Array.isArray(form[k]) ? [{ ...initialEducation }] : ""])),
      role: "Student",
      addressType: "Permanent Address",
      education: [{ ...initialEducation }],
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const educationFields = mapEducationToBackend(form.education);

    const formData = new FormData();
    for (const key in form) {
      if (key === "education") continue;
      // Only append photo/aadharFile if user selected a new file
      if ((key === "photo" || key === "aadharFile") && form[key]) {
        formData.append(key === "aadharFile" ? "UploadAadhar" : key, form[key]);
      } else if (key !== "photo" && key !== "aadharFile") {
        formData.append(key, form[key]);
      }
    }
    for (const key in educationFields) {
      formData.append(key, educationFields[key]);
    }

    try {
      const response = await fetch(
        isEditing
          ? `https://localhost:7248/api/admin/registration/edit/${editId}`
          : "https://localhost:7248/api/admin/registration/add",
        {
          method: isEditing ? "POST" : "POST", // Use the method your backend expects!
          body: formData,
        }
      );

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        alert(`Success! ID: ${data.id || editId}`);
      } else {
        alert("Error: " + JSON.stringify(data));
      }
    } catch (err) {
      console.error("Submit error", err);
      alert("Submission failed.");
    }
  };

  // Helper: Convert backend flat education fields to array
  const mapBackendToEducation = (data) => {
    const arr = [];
    for (let i = 1; i <= 10; i++) {
      if (
        data[`DegreeType${i}`] ||
        data[`DegreeName${i}`] ||
        data[`InstituteName${i}`] ||
        data[`YearPassedOut${i}`]
      ) {
        arr.push({
          degreeType: data[`DegreeType${i}`] || "",
          degreeName: data[`DegreeName${i}`] || "",
          instituteName: data[`InstituteName${i}`] || "",
          yearPassed: data[`YearPassedOut${i}`] || "",
        });
      }
    }
    return arr.length ? arr : [{ ...initialEducation }];
  };

  // EDIT fetch handler
  const handleEditFetch = async () => {
    if (!editId) {
      alert("Enter ID to edit");
      return;
    }
    try {
      const res = await fetch(`https://localhost:7248/api/admin/registration/edit/${editId}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();

      // Map backend fields to frontend keys
      const mapped = {
        ...data,
        PhoneNumber: data.phoneNumber || "",
        AlternativePhoneNumber: data.alternativePhoneNumber || "",
        FatherPhoneNumber: data.fatherPhoneNumber || "",
        MotherPhoneNumber: data.motherPhoneNumber || "",
        AadharNumber: data.aadharNumber || "",
        Pincode: data.pincode || "",
        username: data.userName || "",
        password: data.password || "",
        photoPreview: data.photoPath ? `${data.photoPath}` : null,
        aadharPreview: data.aadharPath ? `${data.aadharPath}` : null,
        dob: data.dateOfBirth ? data.dateOfBirth.substring(0, 10) : "",
        admissionDate: data.admissionDate ? data.admissionDate.substring(0, 10) : "",
        education: mapBackendToEducation(data),
      };

      setForm(prev => ({
        ...prev,
        ...mapped,
      }));
      setIsEditing(true);
    } catch {
      alert("Record not found!");
      setIsEditing(false);
    }
  };

  // VIEW handlers
  const handleViewById = async () => {
    if (!viewId) return setViewError("Enter ID");
    setViewLoading(true); setViewError(""); setViewResult(null);
    try {
      const res = await fetch(`https://localhost:7248/api/admin/registration/view/by-id/${viewId}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setViewResult(data);
    } catch {
      setViewError("No record found.");
    }
    setViewLoading(false);
  };

  const handleViewByCourse = async () => {
    if (!viewCourse) return setViewError("Select course");
    setViewLoading(true); setViewError(""); setViewResult(null);
    try {
      const res = await fetch(`https://localhost:7248/api/admin/registration/view/by-course/${viewCourse}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setViewResult(data);
    } catch {
      setViewError("No records found.");
    }
    setViewLoading(false);
  };

  // UI
  return (
    <div className="students-container">
      {/* Tab Bar */}
      <div className="tab-bar">
        {['ADD', 'EDIT', 'VIEW', 'DELETE'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''} ${tab.toLowerCase()}`}
            onClick={() => {
              setActiveTab(tab);
              setIsEditing(false);
              setEditId("");
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="tab-content">
        {activeTab === "ADD" && (
          <form className="add-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Role</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option>Student</option>
                <option>Admin</option>
                <option>Teacher</option>
              </select>
            </div>
            <div className="form-row">
              <label>Course</label>
              <select name="course" value={form.course} onChange={handleChange}>
                <option value="">Select</option>
                <option>UPSC</option>
                <option>TNPSC</option>
                <option>SSC</option>
                <option>RRB</option>
                <option>BANK</option>
                <option>Others</option>
              </select>
              {form.course === "Others" && (
                <input type="text" name="otherCourse" placeholder="Enter course" value={form.otherCourse} onChange={handleChange} />
              )}
            </div>
            <div className="form-row">
              <label>ID</label>
              <input type="text" name="id" value={form.id} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Photo</label>
              <input type="file" name="photo" accept="image/*" onChange={handleChange} />
              {form.photoPreview && <img src={form.photoPreview} alt="Preview" className="photo-preview" />}
            </div>
            <div className="form-row">
              <label>First Name</label>
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange} />
              <label>Middle Name</label>
              <input type="text" name="middleName" value={form.middleName} onChange={handleChange} />
              <label>Last Name</label>
              <input type="text" name="lastName" value={form.lastName} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={form.dob} onChange={handleChange} />
              <label>Blood Group</label>
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
                <option value="">Select</option>
                <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
              </select>
            </div>
            <div className="form-row">
              <label>Phone Number</label>
              <input type="text" name="PhoneNumber" value={form.PhoneNumber} onChange={handleChange} />
              <label>Alternative Phone Number</label>
              <input type="text" name="AlternativePhoneNumber" value={form.AlternativePhoneNumber} onChange={handleChange} />
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Admission Date</label>
              <input type="date" name="admissionDate" value={form.admissionDate} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Father Name</label>
              <input type="text" name="fatherName" value={form.fatherName} onChange={handleChange} />
              <label>Father Occupation</label>
              <input type="text" name="fatherOccupation" value={form.fatherOccupation} onChange={handleChange} />
              <label>Father Phone Number</label>
              <input type="text" name="FatherPhoneNumber" value={form.FatherPhoneNumber} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Mother Name</label>
              <input type="text" name="motherName" value={form.motherName} onChange={handleChange} />
              <label>Mother Occupation</label>
              <input type="text" name="motherOccupation" value={form.motherOccupation} onChange={handleChange} />
              <label>Mother Phone Number</label>
              <input type="text" name="MotherPhoneNumber" value={form.MotherPhoneNumber} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Parent Email</label>
              <input type="email" name="parentEmail" value={form.parentEmail} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Aadhar Number</label>
              <input type="text" name="AadharNumber" value={form.AadharNumber} onChange={handleChange} />
              <label>Upload Aadhar</label>
              <input type="file" name="aadharFile" accept="image/*" onChange={handleChange} />
              {form.aadharPreview && (
                <img
                  src={form.aadharPreview}
                  alt="Aadhar Preview"
                  className="aadhar-preview"
                  style={{ width: '220px', height: '120px', objectFit: 'contain', border: '2px solid #1976d2', borderRadius: '8px', marginTop: '10px', display: 'block', boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)' }}
                />
              )}
            </div>
            <div className="form-row">
              <label>Religion</label>
              <select name="religion" value={form.religion} onChange={handleChange}>
                <option value="">Select</option>
                <option>Hindu</option><option>Muslim</option><option>Christian</option><option>Jain</option><option>Budhha</option><option>Others</option>
              </select>
              {form.religion === "Others" && (
                <input type="text" name="otherReligion" placeholder="Enter religion" value={form.otherReligion} onChange={handleChange} />
              )}
            </div>
            <div className="form-row">
              <label>Caste</label>
              <select name="caste" value={form.caste} onChange={handleChange}>
                <option value="">Select</option>
                <option>BC</option><option>MBC</option><option>OBC</option><option>SC</option><option>ST</option><option>SC(A)</option><option>EWS</option><option>Others</option>
              </select>
              {form.caste === "Others" && (
                <input type="text" name="otherCaste" placeholder="Enter caste" value={form.otherCaste} onChange={handleChange} />
              )}
              <label>Caste Name</label>
              <input type="text" name="casteName" value={form.casteName} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Nationality</label>
              <input type="text" name="nationality" value={form.nationality} onChange={handleChange} />
            </div>
            {/* Address Box */}
            <fieldset className="address-box">
              <legend>Type of Address</legend>
              <select name="addressType" value={form.addressType} onChange={handleChange}>
                <option>Permanent Address</option>
                <option>Temporary Address</option>
              </select>
              <input type="text" name="doorNo" placeholder="Door No" value={form.doorNo} onChange={handleChange} />
              <input type="text" name="street" placeholder="Street" value={form.street} onChange={handleChange} />
              <input type="text" name="area" placeholder="Area" value={form.area} onChange={handleChange} />
              <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} />
              <input type="text" name="district" placeholder="District" value={form.district} onChange={handleChange} />
              <input type="text" name="state" placeholder="State" value={form.state} onChange={handleChange} />
              <input type="text" name="Pincode" placeholder="Pincode" value={form.Pincode} onChange={handleChange} />
              </fieldset>
            {/* Education Box */}
            <fieldset className="education-box">
              <legend>Education Qualification</legend>
              {form.education.map((ed, idx) => (
                <div className="education-row" key={idx}>
                  <input type="text" name="degreeType" placeholder="Type of Degree" value={ed.degreeType} onChange={e => handleEducationChange(idx, e)} />
                  <input type="text" name="degreeName" placeholder="Degree Name" value={ed.degreeName} onChange={e => handleEducationChange(idx, e)} />
                  <input type="text" name="instituteName" placeholder="Institute Name" value={ed.instituteName} onChange={e => handleEducationChange(idx, e)} />
                  <input type="text" name="yearPassed" placeholder="Year of Passed Out" value={ed.yearPassed} onChange={e => handleEducationChange(idx, e)} />
                  {form.education.length > 1 && (
                    <button type="button" className="remove-edu" onClick={() => removeEducation(idx)}>-</button>
                  )}
                </div>
              ))}
              <button type="button" className="add-edu" onClick={addEducation}>Add More</button>
            </fieldset>
            {/* User Credentials */}
            <div className="form-row">
              <label>User Name</label>
              <input type="text" name="username" value={form.username} onChange={handleChange} />
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} />
            </div>
            {/* Buttons */}
            <div className="form-actions">
              <button type="submit" className="submit-btn">SUBMIT</button>
              <button type="button" className="clear-btn" onClick={handleClear}>CLEAR</button>
            </div>
          </form>
        )}

        {activeTab === "EDIT" && (
          <div className="edit-section">
            {!isEditing ? (
              <div className="edit-row">
                <input
                  type="text"
                  placeholder="Enter ID"
                  className="edit-input"
                  value={editId}
                  onChange={e => setEditId(e.target.value)}
                />
                <button className="edit-btn" type="button" onClick={handleEditFetch}>
                  EDIT
                </button>
              </div>
            ) : (
              <form className="add-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <label>Role</label>
                  <select name="role" value={form.role} onChange={handleChange}>
                    <option>Student</option>
                    <option>Admin</option>
                    <option>Teacher</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>Course</label>
                  <select name="course" value={form.course} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>UPSC</option>
                    <option>TNPSC</option>
                    <option>SSC</option>
                    <option>RRB</option>
                    <option>BANK</option>
                    <option>Others</option>
                  </select>
                  {form.course === "Others" && (
                    <input type="text" name="otherCourse" placeholder="Enter course" value={form.otherCourse} onChange={handleChange} />
                  )}
                </div>
                <div className="form-row">
                  <label>ID</label>
                  <input type="text" name="id" value={form.id} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <label>Photo</label>
                  <input type="file" name="photo" accept="image/*" onChange={handleChange} />
                  {form.photoPreview && <img src={form.photoPreview} alt="Preview" className="photo-preview" />}
                </div>
                <div className="form-row">
                  <label>First Name</label>
                  <input type="text" name="firstName" value={form.firstName} onChange={handleChange} />
                  <label>Middle Name</label>
                  <input type="text" name="middleName" value={form.middleName} onChange={handleChange} />
                  <label>Last Name</label>
                  <input type="text" name="lastName" value={form.lastName} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <label>Date of Birth</label>
                  <input type="date" name="dob" value={form.dob} onChange={handleChange} />
                  <label>Blood Group</label>
                  <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                    <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>Phone Number</label>
                  <input type="text" name="PhoneNumber" value={form.PhoneNumber} onChange={handleChange} />
                  <label>Alternative Phone Number</label>
                  <input type="text" name="AlternativePhoneNumber" value={form.AlternativePhoneNumber} onChange={handleChange} />
                  <label>Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <label>Admission Date</label>
                  <input type="date" name="admissionDate" value={form.admissionDate} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <label>Father Name</label>
                  <input type="text" name="fatherName" value={form.fatherName} onChange={handleChange} />
                  <label>Father Occupation</label>
                  <input type="text" name="fatherOccupation" value={form.fatherOccupation} onChange={handleChange} />
                  <label>Father Phone Number</label>
                  <input type="text" name="FatherPhoneNumber" value={form.FatherPhoneNumber} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <label>Mother Name</label>
                  <input type="text" name="motherName" value={form.motherName} onChange={handleChange} />
                  <label>Mother Occupation</label>
                  <input type="text" name="motherOccupation" value={form.motherOccupation} onChange={handleChange} />
                  <label>Mother Phone Number</label>
                  <input type="text" name="MotherPhoneNumber" value={form.MotherPhoneNumber} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <label>Parent Email</label>
                  <input type="email" name="parentEmail" value={form.parentEmail} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <label>Aadhar Number</label>
                  <input type="text" name="AadharNumber" value={form.AadharNumber} onChange={handleChange} />
                  <label>Upload Aadhar</label>
                  <input type="file" name="aadharFile" accept="image/*" onChange={handleChange} />
                  {form.aadharPreview && (
                    <img
                      src={form.aadharPreview}
                      alt="Aadhar Preview"
                      className="aadhar-preview"
                      style={{ width: '220px', height: '120px', objectFit: 'contain', border: '2px solid #1976d2', borderRadius: '8px', marginTop: '10px', display: 'block', boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)' }}
                    />
                  )}
                </div>
                <div className="form-row">
                  <label>Religion</label>
                  <select name="religion" value={form.religion} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>Hindu</option><option>Muslim</option><option>Christian</option><option>Jain</option><option>Budhha</option><option>Others</option>
                  </select>
                  {form.religion === "Others" && (
                    <input type="text" name="otherReligion" placeholder="Enter religion" value={form.otherReligion} onChange={handleChange} />
                  )}
                </div>
                <div className="form-row">
                  <label>Caste</label>
                  <select name="caste" value={form.caste} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>BC</option><option>MBC</option><option>OBC</option><option>SC</option><option>ST</option><option>SC(A)</option><option>EWS</option><option>Others</option>
                  </select>
                  {form.caste === "Others" && (
                    <input type="text" name="otherCaste" placeholder="Enter caste" value={form.otherCaste} onChange={handleChange} />
                  )}
                  <label>Caste Name</label>
                  <input type="text" name="casteName" value={form.casteName} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <label>Nationality</label>
                  <input type="text" name="nationality" value={form.nationality} onChange={handleChange} />
                </div>
                {/* Address Box */}
                <fieldset className="address-box">
                  <legend>Type of Address</legend>
                  <select name="addressType" value={form.addressType} onChange={handleChange}>
                    <option>Permanent Address</option>
                    <option>Temporary Address</option>
                  </select>
                  <input type="text" name="doorNo" placeholder="Door No" value={form.doorNo} onChange={handleChange} />
                  <input type="text" name="street" placeholder="Street" value={form.street} onChange={handleChange} />
                  <input type="text" name="area" placeholder="Area" value={form.area} onChange={handleChange} />
                  <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} />
                  <input type="text" name="district" placeholder="District" value={form.district} onChange={handleChange} />
                  <input type="text" name="state" placeholder="State" value={form.state} onChange={handleChange} />
                  <input type="text" name="Pincode" placeholder="Pincode" value={form.Pincode} onChange={handleChange} />
                </fieldset>
               
                {/* User Credentials */}
                <div className="form-row">
                  <label>User Name</label>
                  <input type="text" name="username" value={form.username} onChange={handleChange} />
                  <label>Password</label>
                  <input type="password" name="password" value={form.password} onChange={handleChange} />
                </div>
                
                {/* Buttons */}
                <div className="form-actions">
                  <button type="submit" className="submit-btn">SUBMIT</button>
                  <button type="button" className="clear-btn" onClick={() => setIsEditing(false)}>CANCEL</button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === "VIEW" && (
          <div className="view-section">
            <div className="view-option">
              <input
                type="text"
                placeholder="Enter ID"
                className="view-input"
                value={viewId}
                onChange={e => setViewId(e.target.value)}
              />
              <button className="view-btn" onClick={handleViewById}>VIEW</button>
            </div>
            <div className="or-text">OR</div>
            <div className="view-option">
              <label>Select Course</label>
              <select
                className="view-select"
                value={viewCourse}
                onChange={e => setViewCourse(e.target.value)}
              >
                <option value="">Select</option>
                <option>UPSC</option>
                <option>TNPSC</option>
                <option>SSC</option>
                <option>RRB</option>
                <option>BANK</option>
                <option>Others</option>
              </select>
              <button className="view-btn" onClick={handleViewByCourse}>VIEW</button>
            </div>

            {/* Filter by Year */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "16px 0" }}>
              <FaFilter style={{ color: "#1976d2" }} />
              <label htmlFor="yearFilter"><b>Filter by Admission Year:</b></label>
              <select
                id="yearFilter"
                value={filterYear}
                onChange={e => setFilterYear(e.target.value)}
              >
                <option value="">All</option>
                {Array.from({ length: new Date().getFullYear() - 2024 + 1 }, (_, i) => 2024 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {viewLoading && <div>Loading...</div>}
            {viewError && <div className="view-error">{viewError}</div>}

            {/* Single student view */}
            {viewResult && !Array.isArray(viewResult) && viewResult.student ? (
              <div className="student-card">
                <h3>Student Details</h3>
                <table className="view-table">
                  <tbody>
                    <tr><td><b>ID</b></td><td>{viewResult.student.id}</td></tr>
                    <tr><td><b>Role</b></td><td>{viewResult.student.role}</td></tr>
                    <tr><td><b>Course</b></td><td>{viewResult.student.course}</td></tr>
                    <tr>
                      <td><b>Photo</b></td>
                      <td>
                        {viewResult.student.photoPath ? (
                          <img
                            src={
                              viewResult.student.photoPath
                                ? viewResult.student.photoPath.startsWith("http")
                                  ? viewResult.student.photoPath
                                  : `https://localhost:7248${viewResult.student.photoPath}`
                                : ""
                            }
                            alt="Student"
                            style={{
                              maxWidth: "120px",
                              maxHeight: "120px",
                              border: "2px solid #1976d2",
                              borderRadius: "8px",
                              objectFit: "cover",
                              boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
                            }}
                          />
                        ) : "No Photo"}
                      </td>
                    </tr>
                    <tr><td><b>Name</b></td><td>{viewResult.student.firstName} {viewResult.student.middleName} {viewResult.student.lastName}</td></tr>
                    <tr><td><b>Date of Birth</b></td><td>{viewResult.student.dateOfBirth}</td></tr>
                    <tr><td><b>Blood Group</b></td><td>{viewResult.student.bloodGroup}</td></tr>
                    <tr><td><b>Phone Number</b></td><td>{viewResult.student.phoneNumber}</td></tr>
                    <tr><td><b>Alternative Phone Number</b></td><td>{viewResult.student.alternativePhoneNumber}</td></tr>
                    <tr><td><b>Email</b></td><td>{viewResult.student.email}</td></tr>
                    <tr><td><b>Admission Date</b></td><td>{viewResult.student.admissionDate}</td></tr>
                    <tr><td><b>Father Name</b></td><td>{viewResult.student.fatherName}</td></tr>
                    <tr><td><b>Father Occupation</b></td><td>{viewResult.student.fatherOccupation}</td></tr>
                    <tr><td><b>Father Phone Number</b></td><td>{viewResult.student.fatherPhoneNumber}</td></tr>
                    <tr><td><b>Mother Name</b></td><td>{viewResult.student.motherName}</td></tr>
                    <tr><td><b>Mother Occupation</b></td><td>{viewResult.student.motherOccupation}</td></tr>
                    <tr><td><b>Mother Phone Number</b></td><td>{viewResult.student.motherPhoneNumber}</td></tr>
                    <tr><td><b>Parent Email</b></td><td>{viewResult.student.parentEmail}</td></tr>
                    <tr><td><b>Aadhar Number</b></td><td>{viewResult.student.aadharNumber}</td></tr>
                    <tr>
                      <td><b>Aadhar</b></td>
                      <td>
                        {viewResult.student.aadharPath ? (
                          <img
                            src={
                              viewResult.student.aadharPath
                                ? viewResult.student.aadharPath.startsWith("http")
                                  ? viewResult.student.aadharPath
                                  : `https://localhost:7248${viewResult.student.aadharPath}`
                                : ""
                            }
                            alt="Aadhar"
                            style={{
                              maxWidth: "220px",
                              maxHeight: "120px",
                              border: "2px solid #1976d2",
                              borderRadius: "8px",
                              objectFit: "contain",
                              marginTop: "4px",
                              boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
                            }}
                          />
                        ) : "No Aadhar"}
                      </td>
                    </tr>
                    <tr><td><b>Religion</b></td><td>{viewResult.student.religion}</td></tr>
                    <tr><td><b>Caste</b></td><td>{viewResult.student.caste}</td></tr>
                    <tr><td><b>Caste Name</b></td><td>{viewResult.student.casteName}</td></tr>
                    <tr><td><b>Nationality</b></td><td>{viewResult.student.nationality}</td></tr>
                    <tr><td><b>Address Type</b></td><td>{viewResult.student.addressType}</td></tr>
                    <tr>
                      <td><b>Address</b></td>
                      <td>
                        {viewResult.student.doorNo}, {viewResult.student.street}, {viewResult.student.area},<br/>
                        {viewResult.student.city}, {viewResult.student.district}, {viewResult.student.state} - {viewResult.student.pincode}
                      </td>
                    </tr>
                    <tr><td><b>User Name</b></td><td>{viewResult.student.userName}</td></tr>
                    <tr><td><b>Password</b></td><td>{viewResult.student.password}</td></tr>
                  </tbody>
                </table>
                <h4>Qualifications</h4>
                {/* FIX: Show education qualifications from student object if qualifications array is missing */}
                {Array.isArray(viewResult.qualifications) && viewResult.qualifications.length > 0 ? (
                  <table className="view-table qualifications-table">
                    <thead>
                      <tr>
                        <th>Degree Type</th>
                        <th>Degree Name</th>
                        <th>Institute</th>
                        <th>Year Passed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewResult.qualifications.map((q, idx) => (
                        <tr key={idx}>
                          <td>{q.DegreeType}</td>
                          <td>{q.DegreeName}</td>
                          <td>{q.InstituteName}</td>
                          <td>{q.YearPassedOut}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  // Fallback: Try to show education from student object (DegreeType1, DegreeName1, ...)
                  (() => {
                    const eduRows = [];
                    for (let i = 1; i <= 10; i++) {
                      const dt = viewResult.student[`degreeType${i}`] || viewResult.student[`DegreeType${i}`];
                      const dn = viewResult.student[`degreeName${i}`] || viewResult.student[`DegreeName${i}`];
                      const inst = viewResult.student[`instituteName${i}`] || viewResult.student[`InstituteName${i}`];
                      const yr = viewResult.student[`yearPassed${i}`] || viewResult.student[`YearPassedOut${i}`];
                      if (dt || dn || inst || yr) {
                        eduRows.push(
                          <tr key={i}>
                            <td>{dt || ""}</td>
                            <td>{dn || ""}</td>
                            <td>{inst || ""}</td>
                            <td>{yr || ""}</td>
                          </tr>
                        );
                      }
                    }
                    return eduRows.length > 0 ? (
                      <table className="view-table qualifications-table">
                        <thead>
                          <tr>
                            <th>Degree Type</th>
                            <th>Degree Name</th>
                            <th>Institute</th>
                            <th>Year Passed</th>
                          </tr>
                        </thead>
                        <tbody>{eduRows}</tbody>
                      </table>
                    ) : (
                      <div>No qualifications found.</div>
                    );
                  })()
                )}
              </div>
            ) : null}

            {/* Multiple students view with year filter */}
            {Array.isArray(viewResult) && viewResult.length > 0 && (
              <div>
                <h3>Students in {viewCourse}</h3>
                {viewResult
                  .filter(item => {
                    const student = item.Student || item.student;
                    if (!student) return false;
                    if (!filterYear) return true;
                    // admissionDate format: "YYYY-MM-DD"
                    return student.admissionDate && student.admissionDate.startsWith(filterYear);
                  })
                  .map((item, idx) =>
                    (item.Student || item.student) ? (
                      <div key={idx} className="student-card">
                        <table className="view-table">
                          <tbody>
                            <tr>
                              <td><b>ID</b></td>
                              <td>{(item.Student || item.student).id}</td>
                            </tr>
                            <tr>
                              <td><b>Name</b></td>
                              <td>
                                {(item.Student || item.student).firstName} {(item.Student || item.student).middleName} {(item.Student || item.student).lastName}
                              </td>
                            </tr>
                            <tr>
                              <td><b>Admission Date</b></td>
                              <td>{(item.Student || item.student).admissionDate}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : null
                  )}
              </div>
            )}

            {/* No results */}
            {viewResult && (
              (Array.isArray(viewResult) && viewResult.length === 0) ||
              (!Array.isArray(viewResult) && !viewResult.student)
            ) && (
              <div>No records found.</div>
            )}
          </div>
        )}

        {activeTab === "DELETE" && (
          <div className="delete-section">
            <input
              type="text"
              placeholder="Enter ID"
              className="delete-input"
              value={editId}
              onChange={e => setEditId(e.target.value)}
            />
            <button
              className="delete-btn"
              onClick={async () => {
                if (!editId) return alert("Enter ID");
                setViewLoading(true);
                setViewError("");
                setViewResult(null);
                try {
                  const res = await fetch(`https://localhost:7248/api/admin/registration/view/by-id/${editId}`);
                  if (!res.ok) throw new Error("Not found");
                  const data = await res.json();
                  setViewResult(data);
                } catch {
                  setViewError("No record found.");
                }
                setViewLoading(false);
              }}
            >
              Get Details
            </button>
            {viewLoading && <div>Loading...</div>}
            {viewError && <div className="view-error">{viewError}</div>}
            {viewResult && viewResult.student && (
              <div className="student-card">
                <h3>Student Details</h3>
                <table className="view-table">
                  <tbody>
                    <tr>
                      <td><b>ID</b></td>
                      <td>{viewResult.student.id}</td>
                    </tr>
                    <tr>
                      <td><b>Name</b></td>
                      <td>
                        {viewResult.student.firstName} {viewResult.student.middleName} {viewResult.student.lastName}
                      </td>
                    </tr>
                    <tr>
                      <td><b>Admission Date</b></td>
                      <td>{viewResult.student.admissionDate}</td>
                    </tr>
                    {/* Add more fields if you want */}
                  </tbody>
                </table>
                <button
                  className="delete-btn"
                  style={{ background: "#d32f2f", color: "#fff", marginTop: "12px" }}
                  onClick={async () => {
                    if (!window.confirm("Are you sure you want to delete this student?")) return;
                    setViewLoading(true);
                    try {
                      const res = await fetch(`https://localhost:7248/api/admin/registration/delete/${viewResult.student.id}`, {
                        method: "DELETE",
                      });
                      if (!res.ok) throw new Error("Delete failed");
                      alert("Deleted successfully!");
                      setViewResult(null);
                      setEditId("");
                    } catch {
                      alert("Delete failed.");
                    }
                    setViewLoading(false);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
