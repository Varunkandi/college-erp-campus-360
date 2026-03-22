import { useEffect, useState } from "react";


function AdminEvents() {

  const userId = localStorage.getItem("user_id");

  const [title,setTitle]=useState("");
  const [desc,setDesc]=useState("");
  const [date,setDate]=useState("");
  const [file,setFile]=useState(null);
  const [role,setRole]=useState("everyone");
  const [events,setEvents]=useState([]);

  // load all events
  useEffect(()=>{
    fetch("http://192.168.1.13:5000/events/everyone")
      .then(res=>res.json())
      .then(data=>setEvents(data));
  },[]);

  const upload=()=>{
    if(!title || !date){
      alert("Fill required fields");
      return;
    }

    const formData=new FormData();
    formData.append("title",title);
    formData.append("description",desc);
    formData.append("event_date",date);
    formData.append("uploaded_by",userId);
    formData.append("role",role);
    if(file) formData.append("file",file);

    fetch("http://192.168.1.13:5000/add_event",{
      method:"POST",
      body:formData
    })
    .then(res=>res.json())
    .then(()=>{
      alert("Event Added");
      window.location.reload();
    });
  };

  const remove=(id)=>{
    if(!window.confirm("Delete event?")) return;

    fetch(`http://192.168.1.13:5000/delete_event/${id}`,{
      method:"DELETE"
    })
    .then(res=>res.json())
    .then(()=>{
      setEvents(prev=>prev.filter(e=>e.id!==id));
    });
  };

  return(
    

      <div style={{padding:30,width:"100%"}}>
        <h2>Manage Events</h2>

        {/* FORM */}
        <input placeholder="Title"
          onChange={e=>setTitle(e.target.value)} /><br/><br/>

        <textarea placeholder="Description"
          onChange={e=>setDesc(e.target.value)} /><br/><br/>

        <input type="date"
          onChange={e=>setDate(e.target.value)} /><br/><br/>

        <select onChange={e=>setRole(e.target.value)}>
          <option value="everyone">Everyone</option>
          <option value="student">Students</option>
          <option value="faculty">Faculty</option>
        </select><br/><br/>

        <input type="file"
          onChange={e=>setFile(e.target.files[0])}/><br/><br/>

        <button onClick={upload}>Add Event</button>

        <hr/>

        {/* LIST */}
        <h3>All Events</h3>

        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Target</th>
              <th>File</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {events.map(e=>(
              <tr key={e.id}>
                <td>{e.title}</td>
                <td>{e.event_date}</td>
                <td>{e.role}</td>
                <td>
                  {e.file &&
                    <a href={`http://192.168.1.13:5000/uploads/${e.file}`}
                       target="_blank" rel="noreferrer">
                      View
                    </a>}
                </td>
                <td>
                  <button onClick={()=>remove(e.id)}
                    style={{background:"red",color:"white"}}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    
  );
}

export default AdminEvents;