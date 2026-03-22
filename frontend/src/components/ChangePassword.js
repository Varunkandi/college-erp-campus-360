import { useState } from "react";
import Sidebar from "./Sidebar";

function ChangePassword(){

  const userId = localStorage.getItem("user_id");

  const [oldPass,setOldPass]=useState("");
  const [newPass,setNewPass]=useState("");

  const change=()=>{
    fetch("http://192.168.1.13:5000/change_password",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify({
        user_id:userId,
        old_password:oldPass,
        new_password:newPass
      })
    })
    .then(res=>res.json())
    .then(data=>alert(data.message));
  }

  return(
    <div style={{display:"flex"}}>
      <Sidebar/>

      <div className="fade-in" style={{padding:30}}>
        <h2>Change Password</h2>

        <input placeholder="Old Password" type="password"
          onChange={e=>setOldPass(e.target.value)}/><br/><br/>

        <input placeholder="New Password" type="password"
          onChange={e=>setNewPass(e.target.value)}/><br/><br/>

        <button onClick={change}>Update Password</button>
      </div>
    </div>
  )
}

export default ChangePassword;
