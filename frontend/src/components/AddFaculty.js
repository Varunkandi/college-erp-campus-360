import { useState } from "react";
import Sidebar from "./Sidebar";

function AddFaculty() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    subject: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addFaculty = async () => {
    if (!form.name || !form.username || !form.password || !form.subject) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/add_faculty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      alert(data.message);

      setForm({ name: "", username: "", password: "", subject: "" });
    } catch {
      alert("Server error");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: 40, width: "100%" }}>
        <div className="form-card fade-in" style={{ maxWidth: 500 }}>
          <h2>Add Faculty</h2>

          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} />

          <label>Username</label>
          <input name="username" value={form.username} onChange={handleChange} />

          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} />

          <label>Subject</label>
          <input name="subject" value={form.subject} onChange={handleChange} />

          <button onClick={addFaculty}>Add Faculty</button>
        </div>
      </div>
    </div>
  );
}

export default AddFaculty;
