import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

function ViewExams(){

  const [exams,setExams]=useState([]);

  useEffect(()=>{
    fetch("http://192.168.1.13:5000/exams")
      .then(res=>res.json())
      .then(data=>setExams(data));
  },[]);

  return(
    <div style={{display:"flex"}}>
      <Sidebar/>

      <div style={{padding:30,width:"100%"}}>
        <h2>Online Exams</h2>

        <table border="1" cellPadding="10" style={{width:"100%"}}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Exam</th>
            </tr>
          </thead>

          <tbody>
            {exams.map(e=>(
              <tr key={e.id}>
                <td>{e.subject}</td>
                <td>
                  <a href={e.exam_link} target="_blank" rel="noreferrer">
                    Start Exam
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  )
}

export default ViewExams;