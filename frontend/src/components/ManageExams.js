import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

function ManageExams(){

  const userId = localStorage.getItem("user_id");

  const [subject,setSubject]=useState("");
  const [link,setLink]=useState("");
  const [exams,setExams]=useState([]);

  // load exams
  useEffect(()=>{
    fetch("http://192.168.1.13:5000/exams")
      .then(res=>res.json())
      .then(data=>setExams(data));
  },[]);

  // add exam
  const addExam=()=>{
    fetch("http://192.168.1.13:5000/add_exam",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify({
        subject:subject,
        exam_link:link,
        created_by:userId
      })
    })
    .then(res=>res.json())
    .then(()=>{
      alert("Exam added");
      window.location.reload();
    });
  };

  // delete exam
  const remove=(id)=>{
    fetch("http://192.168.1.13:5000/delete_exam/"+id,{
      method:"DELETE"
    })
    .then(res=>res.json())
    .then(()=>{
      setExams(prev=>prev.filter(e=>e.id!==id));
    });
  };

  return(
    <div style={{display:"flex"}}>
      <Sidebar/>

      <div style={{padding:30,width:"100%"}}>
        <h2>Manage Online Exams</h2>

        {/* ADD EXAM */}
        <div className="form-card">
          <input
            placeholder="Subject name"
            onChange={e=>setSubject(e.target.value)}
          /><br/><br/>

          <input
            placeholder="Paste exam link (Google Form etc)"
            onChange={e=>setLink(e.target.value)}
          /><br/><br/>

          <button onClick={addExam}>Add Exam</button>
        </div>

        <hr/>

        {/* LIST */}
        <table border="1" cellPadding="10" style={{width:"100%"}}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Link</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {exams.map(e=>(
              <tr key={e.id}>
                <td>{e.subject}</td>
                <td>
                  <a href={e.exam_link} target="_blank" rel="noreferrer">
                    Open Exam
                  </a>
                </td>
                <td>
                  <button onClick={()=>remove(e.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  )
}

export default ManageExams;