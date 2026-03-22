import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

function NotificationsViewer() {
  const role = localStorage.getItem("role");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch(`https://college-erp-backend-360.onrender.com/notifications/${role}`)
      .then(res => res.json())
      .then(data => setNotes(data));
  }, [role]);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: 30, width: "100%" }}>
        <h2>Notifications</h2>

        {notes.map(n => (
          <div key={n.id} className="card-box" style={{ marginBottom: 15 }}>
            {n.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsViewer;