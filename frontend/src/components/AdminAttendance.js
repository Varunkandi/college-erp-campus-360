import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

const HOURS = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM"];

function AdminAttendance() {
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState("");
  const [records, setRecords] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:5000/student_list")
      .then(res => res.json())
      .then(data => setStudents(data));
  }, []);

  const toggleStatus = (studentId, hour) => {
    setRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [hour]:
          prev?.[studentId]?.[hour] === "Absent"
            ? "Present"
            : "Absent"
      }
    }));
  };

  const saveAttendance = () => {
    if (!date) {
      alert("Select date");
      return;
    }

    const payload = [];

    students.forEach(s => {
      HOURS.forEach(h => {
        payload.push({
          student_id: s.student_id,
          hour: h,
          status: records?.[s.student_id]?.[h] || "Present"
        });
      });
    });

    fetch("http://127.0.0.1:5000/admin_add_attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, records: payload })
    })
      .then(res => res.json())
      .then(() => alert("Admin attendance saved"));
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: 30, width: "100%" }}>
        <h2>Admin Attendance</h2>

        <input
          type="date"
          onChange={e => setDate(e.target.value)}
          style={{ padding: 8, marginBottom: 15 }}
        />

        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>UID</th>
              <th>Name</th>
              {HOURS.map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>

          <tbody>
            {students.map(s => (
              <tr key={s.student_id}>
                <td>{s.uid}</td>
                <td>{s.name}</td>

                {HOURS.map(h => {
                  const status =
                    records?.[s.student_id]?.[h] || "Present";

                  return (
                    <td
                      key={h}
                      onClick={() => toggleStatus(s.student_id, h)}
                      className={
                        status === "Present"
                          ? "present"
                          : "absent"
                      }
                    >
                      {status === "Present" ? "P" : "A"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <br />
        <button onClick={saveAttendance}>Save Attendance</button>
      </div>
    </div>
  );
}

export default AdminAttendance;
