import { useState } from "react";
import Sidebar from "./Sidebar";

function MarkAttendance(){

  const [studentId,setStudentId]=useState("");
  const [date,setDate]=useState("");
  const [status,setStatus]=useState("Present");

  const submitAttendance=()=>{
    fetch("http://127.0.0.1:5000/add_attendance",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify({
        student_id:studentId,
        date,
        status
      })
    })
    .then(res=>res.json())
    .then(data=>alert(data.message));
  }

  return(
    <div style={{display:"flex"}}>
      <Sidebar/>

      <div style={{padding:30}}>
        <h2>Mark Attendance</h2>

        <input placeholder="Student ID"
          onChange={e=>setStudentId(e.target.value)}/>

        <br/><br/>

        <input type="date"
          onChange={e=>setDate(e.target.value)}/>

        <br/><br/>

        <select onChange={e=>setStatus(e.target.value)}>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

        <br/><br/>

        <button onClick={submitAttendance}>
          Save Attendance
        </button>

      </div>
    </div>
  )
}

export default MarkAttendance;
