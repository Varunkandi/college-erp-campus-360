import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

function StudentList(){

  const [students,setStudents]=useState([]);
  const [search,setSearch]=useState("");

  useEffect(()=>{
    fetch("http://127.0.0.1:5000/all_students")
      .then(res=>res.json())
      .then(data=>setStudents(data));
  },[])

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.username.toLowerCase().includes(search.toLowerCase())
  );

  return(
    <div style={{display:"flex"}}>
      <Sidebar/>

      <div className="fade-in" style={{padding:30}}>
        <h2>Student List</h2>

        <input
          placeholder="Search student..."
          style={{width:300,padding:10}}
          onChange={e=>setSearch(e.target.value)}
        />

        <table border="1">
          <tr>
            <th>UID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Fee Due</th>
          </tr>

          {filtered.map((s,i)=>(
            <tr key={i}>
              <td>{s.uid}</td>
              <td>{s.name}</td>
              <td>{s.username}</td>
              <td>{s.fee_due}</td>
            </tr>
          ))}

        </table>

      </div>
    </div>
  )
}

export default StudentList;
