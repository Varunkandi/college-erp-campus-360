import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";

function NotificationSender(){

  const [message,setMessage]=useState("");
  const [role,setRole]=useState("everyone");
  const [list,setList]=useState([]);

  // LOAD EXISTING NOTIFICATIONS
  const loadNotifications=()=>{
    fetch("https://college-erp-backend-360.onrender.com/all_notifications")
      .then(res=>res.json())
      .then(data=>setList(data))
      .catch(()=>alert("Failed to load notifications"));
  }

  useEffect(()=>{ loadNotifications(); },[]);

  // SEND NEW
  const send=()=>{
    fetch("https://college-erp-backend-360.onrender.com/send_notification",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        message,
        target_role:role
      })
    })
    .then(res=>res.json())
    .then(()=>{
      setMessage("");
      loadNotifications();
    })
    .catch(()=>alert("Failed to send"));
  }

  // DELETE
  const remove=(id)=>{
    if(!window.confirm("Delete this notification?")) return;

    fetch(`https://college-erp-backend-360.onrender.com/delete_notification/${id}`,{
      method:"DELETE"
    })
    .then(res=>res.json())
    .then(()=> loadNotifications())
    .catch(()=>alert("Delete failed"));
  }

  return(
    <div style={{display:"flex"}}>
      <Sidebar/>

      <div style={{padding:30, width:"100%"}}>
        <h2>Send Notification</h2>

        <div className="form-card">

          <textarea
            placeholder="Notification message"
            value={message}
            onChange={e=>setMessage(e.target.value)}
          />

          <select onChange={e=>setRole(e.target.value)}>
            <option value="everyone">Everyone</option>
            <option value="student">Students</option>
            <option value="faculty">Faculty</option>
          </select>

          <button onClick={send}>Send Notification</button>
        </div>

        <h3 style={{marginTop:40}}>Existing Notifications</h3>

        <table border="1" cellPadding="10" style={{width:"100%"}}>
          <thead>
            <tr>
              <th>Message</th>
              <th>Target</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {list.map(n=>(
              <tr key={n.id}>
                <td>{n.message}</td>
                <td>{n.target_role}</td>
                <td>
                  <button
                    style={{background:"red",color:"white"}}
                    onClick={()=>remove(n.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  )
}

export default NotificationSender;