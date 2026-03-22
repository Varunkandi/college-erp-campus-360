import { useEffect, useState } from "react";

function AnnouncementBar() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://192.168.1.13:5000/announcements")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(()=>{});
  }, []);

  if(items.length === 0) return null;

  return (
    <div style={bar}>
      {items.map((a,i)=>(
        <div key={i} style={msg}>
          📢 {a.message}
        </div>
      ))}
    </div>
  );
}

const bar={
  background:"#1e293b",
  padding:15,
  borderRadius:10,
  marginBottom:20
}

const msg={
  color:"#38bdf8",
  marginBottom:6,
  fontWeight:"bold"
}

export default AnnouncementBar;