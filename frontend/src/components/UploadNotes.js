import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

function UploadNotes() {
  const facultyId = localStorage.getItem("user_id");
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/faculty_notes/${facultyId}`)
      .then(res => res.json())
      .then(setNotes);
  }, [facultyId]);

  const upload = async () => {
    if (!file || !subject) return alert("Fill all fields");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);
    formData.append("uploaded_by", facultyId);

    await fetch("http://127.0.0.1:5000/upload_notes", {
      method: "POST",
      body: formData
    });

    alert("Uploaded");
    window.location.reload();
  };

  const removeNote = async (id) => {
    if (!window.confirm("Delete note?")) return;

    await fetch(`http://127.0.0.1:5000/delete_note/${id}`, { method: "DELETE" });
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: 30, width: "100%" }}>
        <h2>Upload Notes</h2>

        <input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
        <br /><br />
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <br /><br />

        <button onClick={upload}>Upload</button>

        <hr />

        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Subject</th>
              <th>File</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {notes.map(n => (
              <tr key={n.id}>
                <td>{n.subject}</td>
                <td>
                  <a href={`http://127.0.0.1:5000/uploads/${n.filename}`} target="_blank" rel="noreferrer">
                    {n.filename}
                  </a>
                </td>
                <td>
                  <button style={{ background: "red", color: "white" }} onClick={() => removeNote(n.id)}>
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

export default UploadNotes;
