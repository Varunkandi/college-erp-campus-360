import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import NotificationPopup from "./NotificationPopup";

function FacultyDashboard(){

  const [count,setCount]=useState(0);

  useEffect(()=>{
    fetch("http://192.168.1.13:5000/counts")
      .then(res=>res.json())
      .then(data=>setCount(data.students))
      .catch(()=>{});
  },[])

  return(
    <div style={{display:"flex"}}>
      <Sidebar/>

      <div className="fade-in" style={{padding:30, width:"100%"}}>

        {/* 🔔 NOTIFICATION BELL */}
        <NotificationPopup />

        {/* ❌ REMOVED: College Events heading */}

        <h2>Faculty Dashboard</h2>

        <div className="dashboard-cards">

          <div className="card-box">
            <div className="card-title">Total Students</div>
            <div className="card-value">{count}</div>
          </div>

          <div className="card-box">
            <div className="card-title">Attendance</div>
            <div className="card-value">Open</div>
          </div>

          <div className="card-box">
            <div className="card-title">Marks</div>
            <div className="card-value">Open</div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default FacultyDashboard;