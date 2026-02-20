import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";

function ViewFee() {
  const userId = localStorage.getItem("user_id");
  const [fee, setFee] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/fee/" + userId)
      .then(res => res.json())
      .then(data => setFee(data))
      .catch(() => alert("Failed to load fee details"));
  }, [userId]);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: 30, width: "100%" }}>
        <h2>My Fee Details</h2>

        {fee === null ? (
          <p>Loading...</p>
        ) : (
          <div
            style={{
              marginTop: 20,
              padding: 20,
              border: "1px solid #cccccc",
              borderRadius: 8,
              width: 300,
              background: "#0f172a"
            }}
          >
            <h3>Fee Due</h3>
            <p style={{ fontSize: 22, fontWeight: "bold" }}>
              ₹ {fee.fee_due}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewFee;
