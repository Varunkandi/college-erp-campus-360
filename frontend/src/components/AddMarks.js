import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

function AddMarks() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/student_list")
      .then(res => res.json())
      .then(setStudents);
  }, []);

  const addMarks = async () => {
    if (!selectedStudent || !subject || !marks) {
      alert("Fill all fields");
      return;
    }

    await fetch("http://127.0.0.1:5000/add_marks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: selectedStudent.student_id,
        subject,
        marks
      })
    });

    alert("Marks added");
    setSubject("");
    setMarks("");
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: 30, width: "100%" }}>
        <h2>Add Marks</h2>

        <p>
          <b>Selected Student:</b>{" "}
          {selectedStudent ? `${selectedStudent.uid} - ${selectedStudent.name}` : "None"}
        </p>

        <input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
        <br /><br />
        <input type="number" placeholder="Marks" value={marks} onChange={e => setMarks(e.target.value)} />
        <br /><br />

        <button onClick={addMarks}>Add Marks</button>

        <hr />

        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>UID</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.student_id} style={{
                background: selectedStudent?.student_id === s.student_id ? "#e0f2fe" : "white"
              }}>
                <td>{s.uid}</td>
                <td>{s.name}</td>
                <td>
                  <button onClick={() => setSelectedStudent(s)}>Select</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default AddMarks;
