import { useEffect, useState } from "react";


function Events(){

  const role = localStorage.getItem("role");
  const [events,setEvents]=useState([]);

  useEffect(()=>{
    fetch(`http://192.168.1.13:5000/events/${role}`)
      .then(res=>res.json())
      .then(data=>setEvents(data));
  },[role]);

  return(
    
      <div style={{padding:30,width:"100%"}}>
        

        {events.map(e=>(
          <div key={e.id}
               style={{
                 border:"1px solid #ddd",
                 padding:15,
                 marginBottom:15,
                 borderRadius:8
               }}>
            <h3>{e.title}</h3>
            <p>{e.description}</p>
            <p><b>Date:</b> {e.event_date}</p>

            {e.file &&
              <a href={`http://192.168.1.13:5000/uploads/${e.file}`}
                 target="_blank" rel="noreferrer">
                View Attachment
              </a>}
          </div>
        ))}

      </div>
    
  )
}

export default Events;