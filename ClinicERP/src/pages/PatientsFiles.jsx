import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Editor, EditorProvider } from 'react-simple-wysiwyg';

function PatientsFiles() {
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [notes, setNotes] = useState("");
  const [noteId, setNoteId] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetch(`https://clinic-erp-beta.vercel.app/patients-list/${user.id}`)
        .then(res => res.json())
        .then(data => setPatients(Array.isArray(data) ? data : []))
        .catch(err => console.error("API Error:", err));
    }
  }, [user?.id]);

  const handleSelect = async (name) => {
    const p = patients.find(item => item.patientName === name);
    if (!p) {
        setSelectedPatient(null);
        return;
    }
    
    setSelectedPatient(p);
    try {
      const res = await fetch(`https://clinic-erp-beta.vercel.app/patient-notes/${user.id}/${encodeURIComponent(p.patientName)}`);
      const data = await res.json();
      setNotes(data?.content || "");
      setNoteId(data?.id || null);
    } catch (e) { console.log(e); }
  };

  const saveFile = async () => {
    const res = await fetch("https://clinic-erp-beta.vercel.app/patient-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        id: noteId, 
        userId: user.id, 
        patientName: selectedPatient.patientName, 
        patientId: selectedPatient.patientId, 
        content: notes 
      })
    });
    if (res.ok) alert("✅ Saved Successfully!");
  };

  const filtered = patients.filter(p => 
    (p.patientName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.phone || "").includes(searchTerm) ||
    (p.patientId || "").includes(searchTerm)
  );

  return (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto" }}>
      <style>{`@media print {.no-print {display:none !important;} .editor-box {border:none !important;}}`}</style>

      <div className="no-print" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input 
          placeholder="Search Name, Phone, ID..." 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "10px", flex: 1, borderRadius: "5px", border: "1px solid #ccc" }}
        />
        
        <select onChange={(e) => handleSelect(e.target.value)} style={{ padding: "10px", borderRadius: "5px" }}>
          <option value="">-- Select Patient --</option>
          {filtered.map((p, i) => (
            <option key={i} value={p.patientName}>{p.patientName}</option>
          ))}
        </select>

        {selectedPatient && <button onClick={saveFile} style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Save</button>}
        {selectedPatient && <button onClick={() => window.print()} style={{ padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Print</button>}
      </div>

      {selectedPatient ? (
        <div className="editor-box" style={{ background: "white", padding: "40px", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <div style={{ borderBottom: "2px solid #333", marginBottom: "20px", paddingBottom: "10px" }}>
            <h1>Medical Report: {selectedPatient.patientName}</h1>
            <p><strong>ID:</strong> {selectedPatient.patientId || "N/A"} | <strong>Phone:</strong> {selectedPatient.phone || "N/A"}</p>
          </div>
          
          <EditorProvider>
            <Editor 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              style={{ minHeight: "400px" }}
            />
          </EditorProvider>
        </div>
      ) : (
        <div style={{ padding: "100px", textAlign: "center", background: "#f8f9fa", borderRadius: "10px", color: "#666" }}>
          <h2>Select a patient to open their medical file</h2>
        </div>
      )}
    </div>
  );
}

export default PatientsFiles;