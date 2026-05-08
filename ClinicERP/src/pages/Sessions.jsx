import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import axios from "axios";

function Sessions() {
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:5000/sessions/${user.id}/${selectedDate}`)
        .then(res => setSessions(res.data))
        .catch(err => console.error(err));
    }
  }, [user, selectedDate]);

  const sendWhatsApp = (s) => {
    const message = `Hello ${s.patientName}, this is a reminder for your appointment with Dr. ${s.doctorName} on ${s.date} at ${s.time}.`;
    window.open(`https://wa.me/${s.patientPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Daily Sessions</h2>
      {/* 1. Calendar Button/Input */}
      <input 
        type="date" 
        value={selectedDate} 
        onChange={(e) => setSelectedDate(e.target.value)} 
        style={{ padding: "10px", marginBottom: "20px" }}
      />

      {/* 2. Sessions Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }} border="1">
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th>Time</th><th>Patient</th><th>Phone</th><th>Doctor</th><th>Remind</th>
          </tr>
        </thead>
        <tbody>
          {sessions.length > 0 ? sessions.map(s => (
            <tr key={s.id}>
              <td>{s.time}</td><td>{s.patientName}</td><td>{s.patientPhone}</td><td>{s.doctorName}</td>
              <td>
                <button onClick={() => sendWhatsApp(s)} style={{ background: "#25D366", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}>
                  WhatsApp
                </button>
              </td>
            </tr>
          )) : <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No sessions for this day.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export default Sessions;