import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";

function AdminEditStudentProfile() {

  const { uid } = useParams();   // ✅ now matches route
  const [form, setForm] = useState({});

  // Load student profile
  useEffect(() => {
    if (!uid) return;

    fetch(`http://192.168.1.13:5000/student_profile/${uid}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setForm(data))
      .catch(() => alert("Failed to load profile"));
  }, [uid]);

  // Input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Save profile
  const saveProfile = () => {
    if (!uid) {
      alert("UID missing");
      return;
    }

    fetch(`http://192.168.1.13:5000/update_student_profile/${uid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => alert(data.message))
      .catch(() => alert("Failed to update profile"));
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: 30, width: "100%" }}>
        <h2>Edit Student Profile</h2>

        {[
          ["name", "Name"],
          ["register_no", "Register No"],
          ["course", "Course"],
          ["academic_info", "Academic Info"],
          ["institution", "Institution"],
          ["dob", "DOB"],
          ["gender", "Gender"],
          ["father_name", "Father Name"],
          ["mother_name", "Mother Name"],
          ["address", "Address"],
          ["nationality", "Nationality"],
          ["religion", "Religion"],
          ["district", "District"],
          ["state", "State"]
        ].map(([key, label]) => (
          <div key={key} style={{ marginBottom: 10 }}>
            <input
              name={key}
              value={form[key] || ""}
              onChange={handleChange}
              placeholder={label}
              style={{ padding: 8, width: 300 }}
            />
          </div>
        ))}

        <button onClick={saveProfile} style={{ padding: 10 }}>
          Save Profile
        </button>
      </div>
    </div>
  );
}

export default AdminEditStudentProfile;
