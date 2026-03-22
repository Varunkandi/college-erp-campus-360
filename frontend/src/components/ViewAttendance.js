import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

function ViewAttendance(){

  const [records,setRecords]=useState([]);
  const [summary,setSummary]=useState({present:0,total:0});

  const user_id = localStorage.getItem("user_id");

  useEffect(()=>{
    fetch("http://192.168.1.13:5000/attendance/"+user_id)
      .then(res=>res.json())
      .then(data=>setRecords(data));

    fetch("http://192.168.1.13:5000/attendance_summary/"+user_id)
      .then(res=>res.json())
      .then(data=>setSummary(data));
  },[])

  const percent = summary.total
    ? Math.round((summary.present/summary.total)*100)
    : 0;

  return(
    <div style={{display:"flex"}}>
      <Sidebar/>

      <div style={{padding:30}}>
        <h2>My Attendance</h2>

        <h3>Attendance Percentage: {percent}%</h3>

        <table border="1">
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>

          {records.map((r,i)=>(
            <tr key={i}>
              <td>{r.date}</td>
              <td style={{
                color: r.status==="Present" ? "lightgreen" : "red"
              }}>
                {r.status}
              </td>
            </tr>
          ))}

        </table>
      </div>
    </div>
  )
}

export default ViewAttendance;
