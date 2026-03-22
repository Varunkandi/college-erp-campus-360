import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";

function AdminFacultyList() {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    fetch("https://college-erp-backend-360.onrender.com/all_faculty")
      .then(res => res.json())
      .then(data => setFaculty(data));
  }, []);

  const removeFaculty = async (userId) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await fetch(
        `https://college-erp-backend-360.onrender.com/delete_faculty/${userId}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok) {
        alert("Delete failed");
        return;
      }

      alert(data.message);

      setFaculty(prev =>
        prev.filter(f => f.user_id !== userId)
      );

    } catch (err) {
      alert("Server error");
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: 20, width: "100%" }}>
        <h2>All Faculty</h2>

        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>UID</th>
              <th>Name</th>
              <th>Subject</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {faculty.map(f => (
              <tr key={f.user_id}>
                <td>{f.user_id}</td>
                <td>{f.name}</td>
                <td>{f.subject}</td>
                <td>
                  <button
                    style={{ background: "red", color: "white" }}
                    onClick={() => removeFaculty(f.user_id)}
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

export default AdminFacultyList;
