import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";

function ViewMarks() {
  const userId = localStorage.getItem("user_id");
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    fetch("http://192.168.1.13:5000/marks/" + userId)
      .then(res => res.json())
      .then(data => setMarks(data))
      .catch(() => alert("Failed to load marks"));
  }, [userId]);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: 20, width: "100%" }}>
        <h2>My Marks</h2>

        {marks.length === 0 ? (
          <p>No marks available</p>
        ) : (
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((m, i) => (
                <tr key={i}>
                  <td>{m.subject}</td>
                  <td>{m.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ViewMarks;
