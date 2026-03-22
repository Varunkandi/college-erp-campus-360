import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function AdminStudentList() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  // Load all students
  useEffect(() => {
    fetch("http://192.168.1.13:5000/all_students")
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(() => alert("Failed to load students"));
  }, []);

  // Remove student
 const removeStudent = async (userId) => {
  if (!window.confirm("Remove this student?")) return;

  try {
    const res = await fetch(
      `http://192.168.1.13:5000/delete_student/${userId}`,
      { method: "DELETE" }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Delete failed");
      return;
    }

    alert(data.message);

    setStudents(prev =>
      prev.filter(s => s.uid !== userId)
    );

  } catch (err) {
    alert("Server error");
    console.error(err);
  }
};


  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: 30, width: "100%" }}>
        <h2>All Students</h2>

        <table border="1" cellPadding="10" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>UID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Fee Due</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map(s => (
              <tr key={s.uid}>
                <td>{s.uid}</td>
                <td>{s.name}</td>
                <td>{s.username}</td>
                <td>{s.fee_due}</td>
                <td>
                  <button
                    style={{ marginRight: 10 }}
                    onClick={() => navigate(`/admin/edit-student/${s.uid}`)}
                  >
                    Edit Profile
                  </button>

                  <button
                    style={{ background: "red", color: "white" }}
                    onClick={() => removeStudent(s.uid)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default AdminStudentList;
