import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

const hours = ["H1","H2","H3","H4","H5","H6"];

function DailyAttendance(){

  const [students,setStudents]=useState([]);
  const [records,setRecords]=useState({});
  const [date,setDate]=useState("");

  const role = localStorage.getItem("role");

  useEffect(()=>{
    fetch("http://192.168.1.13:5000/student_list")
      .then(res=>res.json())
      .then(data=>setStudents(data));
  },[]);

  const toggle=(sid,hour)=>{
    const key = sid+"_"+hour;
    setRecords({
      ...records,
      [key]: records[key]==="Absent" ? "Present" : "Absent"
    })
  }

  const saveAttendance=()=>{
    let arr=[];

    Object.keys(records).forEach(k=>{
      const parts=k.split("_");
      arr.push({
        student_id:parts[0],
        hour:parts[1],
        status:records[k]
      })
    })

    fetch("http://192.168.1.13:5000/save_attendance",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        date,
        role,
        records:arr
      })
    })
    .then(res=>res.json())
    .then(data=>alert(data.message));
  }

  return(
    <div style={{display:"flex"}}>
      <Sidebar/>

      <div style={{padding:30}}>
        <h2>Daily Attendance</h2>

        <input type="date"
          onChange={e=>setDate(e.target.value)}
        />

        <table border="1">
          <tr>
            <th>UID</th>
            <th>Name</th>
            {hours.map(h=><th key={h}>{h}</th>)}
          </tr>

          {students.map(s=>(
            <tr key={s.student_id}>
              <td>{s.uid}</td>
              <td>{s.name}</td>

              {hours.map(h=>{
                const key=s.student_id+"_"+h;
                const val=records[key] || "Present";

                let color="green";

                if(val==="Absent" && role==="faculty")
                  color="red";
                if(val==="Absent" && role==="admin")
                  color="yellow";

                return(
                  <td key={h}
                    onClick={()=>toggle(s.student_id,h)}
                    style={{
                      background:color,
                      color:"black",
                      cursor:"pointer"
                    }}>
                    {val}
                  </td>
                )
              })}
            </tr>
          ))}
        </table>

        <br/>
        <button onClick={saveAttendance}>
          Save Attendance
        </button>

      </div>
    </div>
  )
}

export default DailyAttendance;
