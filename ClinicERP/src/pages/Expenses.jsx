import React, { useState, useEffect } from "react";
import axios from "axios";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [newRow, setNewRow] = useState({ date: new Date().toISOString().split('T')[0], description: "", amount: "" });
  const user = JSON.parse(localStorage.getItem("user")); // Assuming user is stored here after login

  // 1. Load existing expenses
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/expenses/${user.id}`);
      setExpenses(res.data);
    } catch (err) {
      console.error("Error loading expenses", err);
    }
  };

  // 2. Handle Saving
  const handleSave = async () => {
    if (!newRow.description || !newRow.amount) return alert("Please fill all fields");

    try {
      const res = await axios.post(`http://localhost:5000/expenses/${user.id}`, newRow);
      setExpenses([...expenses, res.data]); // Add saved row to list
      setNewRow({ date: new Date().toISOString().split('T')[0], description: "", amount: "" }); // Reset input row
    } catch (err) {
      alert("Failed to save expense");
    }
  };

  return (
    <div>
      <h2>Expense Registry</h2>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ background: "#f4f4f4" }}>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Render Saved Rows (Uneditable) */}
          {expenses.map((exp) => (
<tr key={exp.id}> 
    {/* This is the key change: Display the personal sequence, not the DB PK */}
    <td>{exp.transactionId || "Old Entry"}</td> 
    <td>{new Date(exp.date).toLocaleDateString()}</td>
    <td>{exp.description}</td>
    <td>${exp.amount.toFixed(2)}</td>
    <td><span style={{ color: "green" }}>✔ Saved</span></td>
  </tr>
          ))}

          {/* Render Input Row for New Entry */}
          <tr>
            <td>(Auto)</td>
            <td>
              <input 
                type="date" 
                value={newRow.date} 
                onChange={(e) => setNewRow({ ...newRow, date: e.target.value })} 
              />
            </td>
            <td>
              <input 
                type="text" 
                placeholder="Description" 
                value={newRow.description} 
                onChange={(e) => setNewRow({ ...newRow, description: e.target.value })} 
              />
            </td>
            <td>
              <input 
                type="number" 
                placeholder="Amount" 
                value={newRow.amount} 
                onChange={(e) => setNewRow({ ...newRow, amount: e.target.value })} 
              />
            </td>
            <td>
              <button onClick={handleSave} style={{ cursor: "pointer", padding: "5px 15px" }}>Save Row</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Expenses;