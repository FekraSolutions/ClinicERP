import React, { useEffect, useState } from "react";
import axios from "axios";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser ? storedUser.id : null;

  useEffect(() => {
    if (!userId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`/invoices/${userId}`)
      .then((res) => {
        setInvoices(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch invoices");
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p>Loading invoices...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Invoices</h2>
      <div style={{ overflowX: "auto" }}>
        <table
          border="1"
          cellPadding="5"
          style={{ minWidth: "1200px", borderCollapse: "collapse" }}
        >
<thead>
  <tr>
    <th>#</th> {/* NEW COLUMN */}
    <th>Date</th>
    <th>Time</th>
    <th>Patient Name</th>
    <th>Age</th>
    <th>ID</th>
    <th>Phone</th>
    <th>Address</th>
    <th>Email</th>
    <th>Service</th>
    <th>Doctor</th>
    <th>Price</th>
    <th>Pay Method</th>
    <th>Paid</th>
    <th>Remaining</th>
    <th>Discount Amount</th> {/* updated column */}
    <th>Sessions</th>       {/* updated column */}
    <th>Price After Discount</th>
    <th>Company Name</th>
    <th>Company Address</th>
    <th>Registration Number</th>
    <th>Tax Number</th>
  </tr>
</thead>
<tbody>
  {invoices.length === 0 ? (
    <tr>
      <td colSpan="22" style={{ textAlign: "center" }}>No invoices yet</td>
    </tr>
  ) : (
    invoices.map((inv, index) => (
      <tr key={inv.id}>
        <td>{index + 1}</td> {/* ROW NUMBER */}
        <td>{new Date(inv.date).toLocaleDateString()}</td>
        <td>{inv.time || ""}</td>
        <td>{inv.patientName || ""}</td>
        <td>{inv.age || ""}</td>
        <td>{inv.patientId || ""}</td>
        <td>{inv.phone || ""}</td>
        <td>{inv.address || ""}</td>
        <td>{inv.email || ""}</td>
        <td>{inv.service || ""}</td>
        <td>{inv.doctor || ""}</td>
        <td>{inv.price || ""}</td>
        <td>{inv.payMethod || ""}</td>
        <td>{inv.paid || ""}</td>
        <td>{inv.remaining || ""}</td>
        <td>{inv.discountAmount || ""}</td>
        <td>{inv.sessions || ""}</td>
        <td>{inv.priceAfterDiscount || ""}</td>
        <td>{inv.companyName || ""}</td>
        <td>{inv.companyAddress || ""}</td>
        <td>{inv.registrationNumber || ""}</td>
        <td>{inv.taxNumber || ""}</td>
      </tr>
    ))
  )}
</tbody>
        </table>
      </div>
    </div>
  );
}

export default Invoices;