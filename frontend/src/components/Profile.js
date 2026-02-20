import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

function Profile(){

  const userId = localStorage.getItem("user_id");
  const [user,setUser]=useState({});

  useEffect(()=>{
    fetch("http://127.0.0.1:5000/profile/"+userId)
      .then(res=>res.json())
      .then(data=>setUser(data));
  },[])

  return(
    <div style={{display:"flex"}}>
      <Sidebar/>

      <div className="fade-in" style={{padding:30}}>
        <h2>My Profile</h2>

        <p><b>User ID:</b> {user.id}</p>
        <p><b>Username:</b> {user.username}</p>
        <p><b>Role:</b> {user.role}</p>

      </div>
    </div>
  )
}

export default Profile;
