import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

function ViewNotes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/notes")
      .then(res => res.json())
      .then(data => setNotes(data));
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: 30, width: "100%" }}>
        <h2>Notes</h2>

        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Subject</th>
              <th>File</th>
            </tr>
          </thead>

          <tbody>
            {notes.map(n => (
              <tr key={n.id}>
                <td>{n.subject}</td>
                <td>
                  <a
                    href={`http://127.0.0.1:5000/uploads/${n.filename}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default ViewNotes;
