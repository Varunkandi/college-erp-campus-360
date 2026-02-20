import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

function MyMarks() {
  const userId = localStorage.getItem("user_id");
  const [marks, setMarks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/marks/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load marks");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setMarks(data);
        } else {
          setMarks([]);
        }
      })
      .catch(err => {
        console.error(err);
        setError("Unable to load marks");
      });
  }, [userId]);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: 30, width: "100%" }}>
        <h2>My Marks</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {marks.length === 0 ? (
          <p>No marks available</p>
        ) : (
          <table
            border="1"
            cellPadding="10"
            style={{ borderCollapse: "collapse", width: "60%" }}
          >
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((m, index) => (
                <tr key={index}>
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

export default MyMarks;
