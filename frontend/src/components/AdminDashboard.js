import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import AnnouncementBar from "./AnnouncementBar";

function AdminDashboard() {

  const [counts, setCounts] = useState({
    students: 0,
    faculty: 0
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/counts")
      .then(res => res.json())
      .then(data => setCounts(data))
      .catch(()=>{});
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: 30, width: "100%" }}>

        {/* 🔵 ANNOUNCEMENTS */}
        <AnnouncementBar/>

        <h2>Admin Dashboard</h2>

        <div className="dashboard-cards">

          <div className="card-box">
            <div className="card-title">Total Students</div>
            <div className="card-value">{counts.students}</div>
          </div>

          <div className="card-box">
            <div className="card-title">Total Faculty</div>
            <div className="card-value">{counts.faculty}</div>
          </div>

          <div className="card-box">
            <div className="card-title">System Status</div>
            <div className="card-value">OK</div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;