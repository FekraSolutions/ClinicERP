import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import axios from "axios";

function Reception() {
  const { user } = useContext(AuthContext);
  const [dbData, setDbData] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    patientName: "",
    age: "",
    patientId: "",
    phone: "",
    address: "",
    email: "",
    service: "",
    doctor: "",
    price: 0,
    discountAmount: 0,
    priceAfterDiscount: 0,
    sessions: 0,
    payMethod: "Cash",
    paid: 0,
    remaining: 0,
    companyName: "",
    companyAddress: "",
    registrationNumber: "",
    taxNumber: ""
  });
  const [saving, setSaving] = useState(false);
  const [pendingSessions, setPendingSessions] = useState([]); 
const [sessionInput, setSessionInput] = useState({ date: "", time: "", doctor: "" });

  if (!user?.id) {
    return <p style={{ padding: "20px" }}>Please log in to access the Reception page.</p>;
  }

  // Load database options
  useEffect(() => {
    axios.get(`http://localhost:5000/database/${user.id}`)
      .then(res => setDbData(res.data))
      .catch(err => console.error("Failed to fetch database:", err));
  }, [user]);

  // Auto calculate priceAfterDiscount and remaining
  useEffect(() => {
    const selectedService = dbData.find(d => d.serviceName === form.service);
    const price = selectedService ? parseFloat(selectedService.servicePrice || 0) : 0;
    const discount = parseFloat(form.discountAmount || 0);
    const priceAfterDiscount = Math.max(price - discount, 0);
    const paid = parseFloat(form.paid || 0);
    const remaining = Math.max(priceAfterDiscount - paid, 0);

    setForm(f => ({
      ...f,
      price,
      priceAfterDiscount,
      remaining
    }));
  }, [form.service, form.paid, form.discountAmount, dbData]);

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const addSessionToQueue = () => {
  if (!sessionInput.date || !sessionInput.time || !sessionInput.doctor) {
    return alert("Please select date, time, and doctor for the session.");
  }
  setPendingSessions([...pendingSessions, sessionInput]);
  setSessionInput({ date: "", time: "", doctor: "" });
};

const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Save Original Invoice
      await axios.post(`http://localhost:5000/reception/${user.id}`, form);

      // 2. NEW: Save all pending sessions from the queue
      for (const s of pendingSessions) {
        await axios.post(`http://localhost:5000/sessions/${user.id}`, {
          date: s.date,
          time: s.time,
          doctorName: s.doctor,
          patientName: form.patientName,
          patientPhone: form.phone,
          patientEmail: form.email
        });
      }

      alert("Invoice and sessions saved!");

      // 3. Reset form (Exactly as your original)
      setForm({
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        patientName: "",
        age: "",
        patientId: "",
        phone: "",
        address: "",
        email: "",
        service: "",
        doctor: "",
        price: 0,
        discountAmount: 0,
        priceAfterDiscount: 0,
        sessions: 0,
        payMethod: "Cash",
        paid: 0,
        remaining: 0,
        companyName: "",
        companyAddress: "",
        registrationNumber: "",
        taxNumber: ""
      });

      // 4. NEW: Clear the sessions queue after successful save
      setPendingSessions([]);
      
    } catch (err) {
      console.error(err);
      // Enhanced alert to show the specific error (like the overlap conflict from server)
      alert(err.response?.data?.error || "Failed to save data");
    } finally {
      setSaving(false);
    }
  };

  const fieldStyle = { display: "flex", flexDirection: "column", marginBottom: "10px" };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px" }}>
      <h2>Reception Page</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>

        <div style={fieldStyle}>
          <label>Date</label>
          <input type="date" value={form.date} readOnly />
        </div>

        <div style={fieldStyle}>
          <label>Time</label>
          <input type="text" value={form.time} readOnly />
        </div>

        <div style={fieldStyle}>
          <label>Patient Name</label>
          <input type="text" value={form.patientName} onChange={e => handleChange("patientName", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Age</label>
          <input type="number" value={form.age} onChange={e => handleChange("age", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>ID</label>
          <input type="text" value={form.patientId} onChange={e => handleChange("patientId", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Phone</label>
          <input type="text" value={form.phone} onChange={e => handleChange("phone", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Address</label>
          <input type="text" value={form.address} onChange={e => handleChange("address", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Email</label>
          <input type="text" value={form.email} onChange={e => handleChange("email", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Service</label>
          <select value={form.service} onChange={e => handleChange("service", e.target.value)}>
            <option value="">Select Service</option>
            {dbData.map(d => <option key={d.id} value={d.serviceName}>{d.serviceName}</option>)}
          </select>
        </div>

        <div style={fieldStyle}>
          <label>Doctor</label>
          <select value={form.doctor} onChange={e => handleChange("doctor", e.target.value)}>
            <option value="">Select Doctor</option>
            {dbData.map(d => <option key={d.id} value={d.doctorName}>{d.doctorName}</option>)}
          </select>
        </div>

        <div style={fieldStyle}>
          <label>Price</label>
          <input type="number" value={form.price} readOnly />
        </div>

        <div style={fieldStyle}>
          <label>Discount Amount</label>
          <input type="number" value={form.discountAmount} onChange={e => handleChange("discountAmount", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Price after Discount</label>
          <input type="number" value={form.priceAfterDiscount} readOnly />
        </div>

        <div style={fieldStyle}>
          <label>Sessions</label>
          <input type="number" value={form.sessions} onChange={e => handleChange("sessions", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Pay Method</label>
          <select value={form.payMethod} onChange={e => handleChange("payMethod", e.target.value)}>
            <option value="Cash">Cash</option>
            <option value="Visa">Visa</option>
            <option value="Transfer">Transfer</option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label>Paid</label>
          <input type="number" value={form.paid} onChange={e => handleChange("paid", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Remaining</label>
          <input type="number" value={form.remaining} readOnly />
        </div>

        <div style={fieldStyle}>
          <label>Company Name</label>
          <input type="text" value={form.companyName} onChange={e => handleChange("companyName", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Company Address</label>
          <input type="text" value={form.companyAddress} onChange={e => handleChange("companyAddress", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Registration Number</label>
          <input type="text" value={form.registrationNumber} onChange={e => handleChange("registrationNumber", e.target.value)} />
        </div>

        <div style={fieldStyle}>
          <label>Tax Number</label>
          <input type="text" value={form.taxNumber} onChange={e => handleChange("taxNumber", e.target.value)} />
        </div>

      </div>
<hr style={{ margin: "30px 0" }} />
<h3>Schedule Sessions</h3>
<div style={{ display: "flex", gap: "10px", alignItems: "flex-end", background: "#f9f9f9", padding: "15px", borderRadius: "8px" }}>
  <div style={fieldStyle}>
    <label>Session Date</label>
    <input type="date" value={sessionInput.date} onChange={e => setSessionInput({...sessionInput, date: e.target.value})} />
  </div>
  <div style={fieldStyle}>
    <label>Session Time</label>
    <input type="time" value={sessionInput.time} onChange={e => setSessionInput({...sessionInput, time: e.target.value})} />
  </div>
  <div style={fieldStyle}>
    <label>Doctor</label>
    <select value={sessionInput.doctor} onChange={e => setSessionInput({...sessionInput, doctor: e.target.value})}>
      <option value="">Select Doctor</option>
      {dbData.map(d => <option key={d.id} value={d.doctorName}>{d.doctorName}</option>)}
    </select>
  </div>
  <button type="button" onClick={addSessionToQueue} style={{ height: "40px", marginBottom: "10px" }}>+ Add Session</button>
</div>

<div style={{ marginTop: "10px" }}>
  {pendingSessions.map((s, idx) => (
    <div key={idx} style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>
      ✅ {s.date} at {s.time} with Dr. {s.doctor}
    </div>
  ))}
</div>
      <button style={{ marginTop: "20px", padding: "10px 20px" }} onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Invoice"}
      </button>
    </div>
  );
}

export default Reception;