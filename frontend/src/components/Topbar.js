import { useEffect, useState } from "react";

function Topbar() {
  const role = localStorage.getItem("role");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/notifications/${role}`)
      .then(res => res.json())
      .then(data => setNotes(data));
  }, [role]);

  return (
    <div style={bar}>
      <h3 style={{ margin: 0 }}>Campus 360 ERP</h3>

      <div style={{ position: "relative" }}>
        🔔

        {notes.length > 0 && (
          <span style={badge}>
            {notes.length}
          </span>
        )}
      </div>
    </div>
  );
}

const bar = {
  height: 60,
  background: "#0f172a",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 25px",
  borderBottom: "1px solid #1e293b"
};

const badge = {
  position: "absolute",
  top: -8,
  right: -12,
  background: "#ef4444",
  color: "white",
  fontSize: 12,
  padding: "2px 6px",
  borderRadius: 10
};

export default Topbar;
