import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

function AccountsReceivables() {
  const { user } = useContext(AuthContext);
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/accounts-receivables/${user.id}`)
      .then(res => res.json())
      .then(data => setDebts(data))
      .catch(err => console.error(err));
  }, [user.id]);

  const totalDebt = debts.reduce((sum, item) => sum + (item.remaining || 0), 0);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Accounts Receivables (Pending Payments)</h2>
      
      <div style={{ background: "#fff3cd", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3 style={{ margin: 0, color: "#856404" }}>
          Total Outstanding: ${totalDebt.toLocaleString()}
        </h3>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <thead style={{ background: "#007bff", color: "white" }}>
          <tr>
            <th style={{ padding: "12px", textAlign: "left" }}>Patient Name</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
            <th style={{ padding: "12px", textAlign: "right" }}>Total Bill</th>
            <th style={{ padding: "12px", textAlign: "right" }}>Paid</th>
            <th style={{ padding: "12px", textAlign: "right" }}>Balance Due</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Contact</th>
          </tr>
        </thead>
        <tbody>
          {debts.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "12px" }}>{item.patientName}</td>
              <td style={{ padding: "12px" }}>{new Date(item.date).toLocaleDateString()}</td>
              <td style={{ padding: "12px", textAlign: "right" }}>${item.priceAfterDiscount}</td>
              <td style={{ padding: "12px", textAlign: "right", color: "green" }}>${item.paid}</td>
              <td style={{ padding: "12px", textAlign: "right", color: "red", fontWeight: "bold" }}>${item.remaining}</td>
              <td style={{ padding: "12px", textAlign: "center" }}>{item.phone || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {debts.length === 0 && <p style={{ textAlign: "center", marginTop: "20px" }}>Perfect! No outstanding debts.</p>}
    </div>
  );
}

export default AccountsReceivables;