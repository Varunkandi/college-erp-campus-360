import { useEffect, useState } from "react";


function Notifications() {
  const role = localStorage.getItem("role");

  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all");

  // Load notifications
  useEffect(() => {
    fetch(`http://192.168.1.13:5000/notifications/${role}`)
      .then(res => res.json())
      .then(data => setNotes(data));
  }, [role]);

  // Send notification (Admin only)
  const send = () => {
    if (!message) {
      alert("Enter message");
      return;
    }

    fetch("http://192.168.1.13:5000/add_notification", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        message,
        target_role: target
      })
    })
      .then(res => res.json())
      .then(() => {
        alert("Notification sent");
        window.location.reload();
      });
  };

  return (
    
      <div style={{ padding: 30, width: "100%" }}>
        <h2>Notifications</h2>

        {/* ADMIN SEND BOX */}
        {role === "admin" && (
          <>
            <textarea
              placeholder="Write notification..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              style={{ width: 400, height: 80 }}
            /><br /><br />

            <select onChange={e => setTarget(e.target.value)}>
              <option value="all">Everyone</option>
              <option value="student">Students Only</option>
              <option value="faculty">Faculty Only</option>
            </select><br /><br />

            <button onClick={send}>Send Notification</button>

            <hr style={{ margin: "30px 0" }} />
          </>
        )}

        {/* LIST */}
        {notes.map(n => (
          <div
            key={n.id}
            style={{
              background: "#e0f2fe",
              padding: 12,
              marginBottom: 10,
              borderRadius: 6
            }}
          >
            {n.message}
          </div>
        ))}

      </div>
    
  );
}

export default Notifications;
