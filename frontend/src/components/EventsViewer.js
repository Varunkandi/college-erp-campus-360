import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

function EventsViewer() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/events")
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: 30, width: "100%" }}>
        

        {events.map(e => (
          <div key={e.id} className="card-box" style={{ marginBottom: 15 }}>
            <h3>{e.title}</h3>
            <p>{e.description}</p>
            <p><b>Date:</b> {e.event_date}</p>

            {e.file && (
              <a
                href={`http://127.0.0.1:5000/uploads/${e.file}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View File
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventsViewer;