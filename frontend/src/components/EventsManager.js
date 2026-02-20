import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

function EventsManager() {

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");

  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState(null);

  // ✅ LOAD EVENTS
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    fetch("http://127.0.0.1:5000/events")
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(() => alert("Failed to load events"));
  };

  // ✅ ADD EVENT
  const addEvent = () => {

    if (!title || !date) {
      alert("Enter title and date");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("event_date", date);
    formData.append("uploaded_by", userId);
    formData.append("role", role);

    if (file) formData.append("file", file);

    fetch("http://127.0.0.1:5000/add_event", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(() => {
        alert("Event added");
        setTitle("");
        setDesc("");
        setDate("");
        setFile(null);
        loadEvents();
      })
      .catch(() => alert("Failed to add event"));
  };

  // ✅ DELETE EVENT
  const deleteEvent = (id) => {
    if (!window.confirm("Delete this event?")) return;

    fetch(`http://127.0.0.1:5000/delete_event/${id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => {
        setEvents(prev => prev.filter(e => e.id !== id));
      })
      .catch(() => alert("Failed to delete event"));
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: 30, width: "100%" }}>
        <h2>Manage Events</h2>

        {/* ✅ ADD EVENT FORM */}
        {(role === "admin" || role === "faculty") && (
          <div className="form-card" style={{ marginBottom: 30 }}>
            <h3>Add Event</h3>

            <input
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            /><br/><br/>

            <textarea
              placeholder="Description"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            /><br/><br/>

            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            /><br/><br/>

            <input
              type="file"
              onChange={e => setFile(e.target.files[0])}
            /><br/><br/>

            <button onClick={addEvent}>Add Event</button>
          </div>
        )}

        {/* ✅ EVENTS TABLE */}
        <table border="1" cellPadding="10" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>File</th>
              {(role === "admin" || role === "faculty") && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {events.map(e => (
              <tr key={e.id}>
                <td>{e.title}</td>
                <td>{e.event_date}</td>

                <td>
                  {e.file && (
                    <a
                      href={`http://127.0.0.1:5000/uploads/${e.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  )}
                </td>

                {(role === "admin" || role === "faculty") && (
                  <td>
                    <button
                      style={{ background: "red", color: "white" }}
                      onClick={() => deleteEvent(e.id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default EventsManager;