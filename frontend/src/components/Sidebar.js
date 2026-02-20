import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h3>Campus 360</h3>

      {/* ADMIN */}
      {role === "admin" && (
        <>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/add-student">Add Student</Link>
          <Link to="/admin/students">All Students</Link>
          <Link to="/admin/add-faculty">Add Faculty</Link>
          <Link to="/admin/faculty">All Faculty</Link>
          <Link to="/admin/update-fee">Update Fee</Link>
          <Link to="/admin/attendance">Attendance</Link>
          <Link to="/admin/events">Events</Link>
          <Link to="/admin/notifications">Notifications</Link>
          <Link to="/admin/exams">Online Exams</Link>
        </>
      )}

      {/* FACULTY */}
      {role === "faculty" && (
        <>
          <Link to="/faculty">Dashboard</Link>
          <Link to="/faculty/attendance">Attendance</Link>
          <Link to="/faculty/marks">Marks</Link>
          <Link to="/faculty/upload-notes">Upload Notes</Link>
          <Link to="/faculty/events">Events</Link>
          <Link to="/faculty/notifications">Notifications</Link>
          <Link to="/faculty/exams">Online Exams</Link>
        </>
      )}

      {/* STUDENT */}
      {role === "student" && (
        <>
          <Link to="/student">Dashboard</Link>
          <Link to="/student/attendance">My Attendance</Link>
          <Link to="/student/marks">My Marks</Link>
          <Link to="/student/fee">My Fee</Link>
          <Link to="/student/notes">Notes</Link>
          <Link to="/student/events">College Events</Link>
          <Link to="/student/notifications">Notifications</Link>
          <Link to="/student/exams">Online Exams</Link>
        </>
      )}

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Sidebar;