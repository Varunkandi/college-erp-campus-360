import { useState } from "react";
import Sidebar from "./Sidebar";

function AddStudent() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    fee_due: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const addStudent = async () => {
    if (!form.name || !form.username || !form.password) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("https://college-erp-backend-360.onrender.com/add_student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      alert(data.message);

      // clear form after success
      setForm({
        name: "",
        username: "",
        password: "",
        fee_due: ""
      });

    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: 40, width: "100%" }}>
        <div className="form-card fade-in" style={{ maxWidth: 500 }}>
          <h2 className="form-title">Add Student</h2>

          <label>Student Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter student name"
          />

          <label>Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter username"
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
          />

          <label>Fee Due (₹)</label>
          <input
            type="number"
            name="fee_due"
            value={form.fee_due}
            onChange={handleChange}
            placeholder="Enter fee amount"
          />

          <button onClick={addStudent}>
            Add Student
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddStudent;
