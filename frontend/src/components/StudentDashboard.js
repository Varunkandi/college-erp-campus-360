import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NotificationPopup from "./NotificationPopup";

function StudentDashboard() {

  const userId = localStorage.getItem("user_id");
  const [profile, setProfile] = useState({});

  useEffect(() => {
    fetch("http://192.168.1.13:5000/student_profile/" + userId)
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(() => {});
  }, [userId]);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div className="fade-in" style={{ padding: 30, width: "100%" }}>

        {/* 🔔 NOTIFICATION BELL */}
        <NotificationPopup />

        {/* ❌ REMOVED: College Events heading */}
        {/* ONLY PROFILE SHOULD SHOW */}

        <h2>Student Profile</h2>

        <div className="form-card">
          <p><b>Name:</b> {profile.name}</p>
          <p><b>Register No:</b> {profile.register_no}</p>
          <p><b>Course:</b> {profile.course}</p>
          <p><b>Academic Info:</b> {profile.academic_info}</p>
          <p><b>Institution:</b> {profile.institution}</p>
          <p><b>DOB:</b> {profile.dob}</p>
          <p><b>Gender:</b> {profile.gender}</p>
          <p><b>Father:</b> {profile.father_name}</p>
          <p><b>Mother:</b> {profile.mother_name}</p>
          <p><b>Address:</b> {profile.address}</p>
          <p><b>Nationality:</b> {profile.nationality}</p>
          <p><b>Religion:</b> {profile.religion}</p>
          <p><b>District:</b> {profile.district}</p>
          <p><b>State:</b> {profile.state}</p>
        </div>

        <div style={{ marginTop: 25, display: "flex", gap: 15 }}>
          <Link to="/student/attendance">
            <button>My Attendance</button>
          </Link>

          <Link to="/student/marks">
            <button>My Marks</button>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;


