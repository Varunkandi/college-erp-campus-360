import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const HOURS = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM"];

function MyAttendance() {
  const userId = localStorage.getItem("user_id");

  const [grouped, setGrouped] = useState({});
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    fetch(`http://192.168.1.13:5000/student_attendance_report/${userId}`)
      .then(res => res.json())
      .then(data => {
        const map = {};
        let present = 0;
        let total = 0;

        data.records.forEach(r => {
          // clean date (YYYY-MM-DD)
          const date = r.date.split("T")[0];

          if (!map[date]) map[date] = {};
          map[date][r.hour] = r.status;

          if (r.status === "Present") present++;
          total++;
        });

        setGrouped(map);
        setPercentage(total ? Math.round((present / total) * 100) : 0);
      });
  }, [userId]);

  const presentCount = Object.values(grouped)
    .flatMap(d => Object.values(d))
    .filter(s => s === "Present").length;

  const absentCount = Object.values(grouped)
    .flatMap(d => Object.values(d))
    .filter(s => s === "Absent").length;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: 30, width: "100%" }}>
        <h2>My Attendance</h2>

        <h3>Attendance Percentage: {percentage}%</h3>

        {/* PIE CHART */}
        <div style={{ width: 300 }}>
          <Pie
            data={{
              labels: ["Present", "Absent"],
              datasets: [
                {
                  data: [presentCount, absentCount],
                  backgroundColor: ["#16a34a", "#dc2626"]
                }
              ]
            }}
          />
        </div>

        <br />

        {/* ATTENDANCE GRID */}
        <table
          border="1"
          cellPadding="10"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Date</th>
              {HOURS.map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Object.keys(grouped).map(date => (
              <tr key={date}>
                <td>{date}</td>

                {HOURS.map(h => {
                  const status = grouped[date][h];

                  return (
                    <td
                      key={h}
                      style={{
                        background:
                          status === "Present"
                            ? "#16a34a"
                            : status === "Absent"
                            ? "#dc2626"
                            : "#e5e7eb",
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center"
                      }}
                    >
                      {status === "Present"
                        ? "P"
                        : status === "Absent"
                        ? "A"
                        : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyAttendance;
