
import { useEffect, useState } from "react";
import Topbar from "./Topbar";

function EventsPage(){

  const [events,setEvents] = useState([]);

  useEffect(()=>{
    fetch("http://127.0.0.1:5000/events")
      .then(res=>res.json())
      .then(data=>setEvents(data))
      .catch(()=>alert("Failed to load events"));
  },[]);

  return(
    
      <div style={{width:"100%"}}>
        <Topbar/>

        <div style={{padding:30}}>
          

          {events.length===0 && <p>No events available</p>}

          {events.map(e=>(
            <div key={e.id} style={{
              background:"#fff",
              padding:20,
              marginBottom:15,
              borderRadius:8,
              boxShadow:"0 0 8px rgba(0,0,0,0.1)"
            }}>
              <h3>{e.title}</h3>
              <p>{e.description}</p>
              <b>Date:</b> {e.event_date}

              {e.file && (
                <div style={{marginTop:10}}>
                  <a
                    href={`http://127.0.0.1:5000/uploads/${e.file}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📎 View Attachment
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    
  )
}

export default EventsPage;
