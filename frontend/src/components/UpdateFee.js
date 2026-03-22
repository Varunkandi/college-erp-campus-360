import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

function UpdateFee() {
  const [students, setStudents] = useState([]);
  const [fee, setFee] = useState("");

  useEffect(() => {
    fetch("http://192.168.1.13:5000/all_students")
      .then(res => res.json())
      .then(setStudents);
  }, []);

  const updateFee = async (uid) => {
    if (!fee) return alert("Enter fee");

    const res = await fetch("http://192.168.1.13:5000/update_fee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id: uid, fee_due: fee })
    });

    const data = await res.json();
    alert(data.message);
    setFee("");
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: 30, width: "100%" }}>
        <h2>Update Fee</h2>

        <input
          type="number"
          placeholder="Enter new fee"
          value={fee}
          onChange={e => setFee(e.target.value)}
        />

        <table border="1" cellPadding="10" width="100%" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>UID</th>
              <th>Name</th>
              <th>Fee</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.uid}>
                <td>{s.uid}</td>
                <td>{s.name}</td>
                <td>{s.fee_due}</td>
                <td>
                  <button onClick={() => updateFee(s.uid)}>Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default UpdateFee;
