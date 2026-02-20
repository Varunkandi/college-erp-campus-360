import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";

/* STUDENT */
import StudentDashboard from "./components/StudentDashboard";
import MyAttendance from "./components/MyAttendance";
import ViewMarks from "./components/ViewMarks";
import ViewNotes from "./components/ViewNotes";
import ViewFee from "./components/ViewFee";

/* ADMIN */
import AdminDashboard from "./components/AdminDashboard";
import AdminStudentList from "./components/AdminStudentList";
import AdminFacultyList from "./components/AdminFacultyList";
import AdminAttendance from "./components/AdminAttendance";
import AddStudent from "./components/AddStudent";
import AddFaculty from "./components/AddFaculty";
import UpdateFee from "./components/UpdateFee";
import AdminEditStudentProfile from "./components/AdminEditStudentProfile";

/* FACULTY */
import FacultyDashboard from "./components/FacultyDashboard";
import AddMarks from "./components/AddMarks";
import FacultyAttendance from "./components/FacultyAttendance";
import UploadNotes from "./components/UploadNotes";

/* EVENTS */
import EventsManager from "./components/EventsManager";
import EventsViewer from "./components/EventsViewer";

/* NOTIFICATIONS */
import NotificationSender from "./components/NotificationSender";
import NotificationsViewer from "./components/NotificationsViewer";

/*exam*/
import ManageExams from "./components/ManageExams";
import ViewExams from "./components/ViewExams";

function App() {
  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* STUDENT */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/attendance" element={<MyAttendance />} />
        <Route path="/student/marks" element={<ViewMarks />} />
        <Route path="/student/notes" element={<ViewNotes />} />
        <Route path="/student/fee" element={<ViewFee />} />
        <Route path="/student/events" element={<EventsViewer />} />
        <Route path="/student/notifications" element={<NotificationsViewer />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudentList />} />
        <Route path="/admin/faculty" element={<AdminFacultyList />} />
        <Route path="/admin/attendance" element={<AdminAttendance />} />
        <Route path="/admin/add-student" element={<AddStudent />} />
        <Route path="/admin/add-faculty" element={<AddFaculty />} />
        <Route path="/admin/update-fee" element={<UpdateFee />} />
        <Route path="/admin/edit-student/:uid" element={<AdminEditStudentProfile />} />
        <Route path="/admin/events" element={<EventsManager />} />
        <Route path="/admin/notifications" element={<NotificationSender />} />

        {/* FACULTY */}
        <Route path="/faculty" element={<FacultyDashboard />} />
        <Route path="/faculty/attendance" element={<FacultyAttendance />} />
        <Route path="/faculty/marks" element={<AddMarks />} />
        <Route path="/faculty/upload-notes" element={<UploadNotes />} />
        <Route path="/faculty/events" element={<EventsManager />} />
        <Route path="/faculty/notifications" element={<NotificationSender />} />

          {/* exams */}
          
          <Route path="/admin/exams" element={<ManageExams />} />
          <Route path="/faculty/exams" element={<ManageExams />} />
          <Route path="/student/exams" element={<ViewExams />} />
          
          </Routes>
    </Router>
  );
}

export default App;