import React, { useEffect, useState } from "react";
import axios from "axios";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const rawUser = localStorage.getItem("user");
  const storedUser = rawUser ? JSON.parse(rawUser) : null;
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

  // 1. NATIVE PRINT HANDLER
  const handlePrint = (inv) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${inv.patientName || "Patient"}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .details-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .details-table td { padding: 10px; border-bottom: 1px solid #ddd; }
            .details-table td.label { font-weight: bold; width: 30%; }
            .total-box { text-align: right; font-size: 1.2rem; margin-top: 20px; font-weight: bold; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>INVOICE RECIEPT</h2>
            <p><strong>Date:</strong> ${new Date(inv.date).toLocaleDateString()} | <strong>Time:</strong> ${inv.time || ""}</p>
          </div>
          <table class="details-table">
            <tr><td class="label">Patient Name:</td><td>${inv.patientName || "N/A"}</td></tr>
            <tr><td class="label">Patient ID / Age:</td><td>${inv.patientId || "N/A"} / ${inv.age || "N/A"} Yrs</td></tr>
            <tr><td class="label">Doctor Assigned:</td><td>${inv.doctor || "N/A"}</td></tr>
            <tr><td class="label">Service Rendered:</td><td>${inv.service || "N/A"} (${inv.sessions || 1} Sessions)</td></tr>
            <tr><td class="label">Original Price:</td><td>${inv.price || "0"}</td></tr>
            <tr><td class="label">Discount Applied:</td><td>${inv.discountAmount || "0"}</td></tr>
            <tr><td class="label">Price After Discount:</td><td>${inv.priceAfterDiscount || "0"}</td></tr>
            <tr><td class="label">Payment Status:</td><td>Paid: ${inv.paid || "0"} | Remaining: ${inv.remaining || "0"} (${inv.payMethod || "N/A"})</td></tr>
          </table>
          <div class="total-box">
            Net Paid: ${inv.paid || "0"}
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // 2. WHATSAPP LINK GENERATOR
  const getWhatsAppLink = (inv) => {
    if (!inv.phone) return "#";
    // Clean phone number format
    const cleanPhone = inv.phone.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Dear ${inv.patientName},\n\nHere is your receipt summary for your visit on ${new Date(inv.date).toLocaleDateString()}:\n• Service: ${inv.service}\n• Doctor: ${inv.doctor}\n• Total Amount: ${inv.priceAfterDiscount}\n• Amount Paid: ${inv.paid}\n• Remaining Balance: ${inv.remaining}\n\nThank you for choosing our clinic!`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  // 3. EMAIL LINK GENERATOR
  const getEmailLink = (inv) => {
    if (!inv.email) return "#";
    const subject = encodeURIComponent(`Medical Invoice - ${inv.patientName}`);
    const body = encodeURIComponent(
      `Dear ${inv.patientName},\n\nPlease find your payment summary below:\n\nDate: ${new Date(inv.date).toLocaleDateString()}\nService: ${inv.service}\nDoctor: ${inv.doctor}\nTotal Due: ${inv.priceAfterDiscount}\nAmount Paid: ${inv.paid}\nRemaining Balance: ${inv.remaining}\n\nBest regards,\nClinic Management Team`
    );
    return `mailto:${inv.email}?subject=${subject}&body=${body}`;
  };

  if (loading) return <p>Loading invoices...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Invoices</h2>
      <div style={{ overflowX: "auto" }}>
        <table
          border="1"
          cellPadding="5"
          style={{ minWidth: "1500px", borderCollapse: "collapse" }} // Increased minWidth for new columns
        >
          <thead>
            <tr style={{ backgroundColor: "#f1f5f9" }}>
              <th>#</th>
              {/* --- ACTION COLUMNS START --- */}
              <th>Print</th>
              <th>WhatsApp</th>
              <th>Email</th>
              {/* --- ACTION COLUMNS END --- */}
              <th>Date</th>
              <th>Time</th>
              <th>Patient Name</th>
              <th>Age</th>
              <th>ID</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Email Address</th>
              <th>Service</th>
              <th>Doctor</th>
              <th>Price</th>
              <th>Pay Method</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Discount Amount</th>
              <th>Sessions</th>
              <th>Price After Discount</th>
              <th>Company Name</th>
              <th>Company Address</th>
              <th>Registration Number</th>
              <th>Tax Number</th>
            </tr>
          </thead>
          <tbody>
            {!Array.isArray(invoices) || invoices.length === 0 ? (
              <tr>
                <td colSpan="25" style={{ textAlign: "center" }}>No invoices yet</td>
              </tr>
            ) : (
              invoices.map((inv, index) => (
                <tr key={inv.id || index}>
                  <td>{index + 1}</td>
                  
                  {/* PRINT ROW ACTION */}
                  <td style={{ textAlign: "center" }}>
                    <button 
                      onClick={() => handlePrint(inv)}
                      style={{ cursor: "pointer", padding: "4px 8px", backgroundColor: "#0284c7", color: "white", border: "none", borderRadius: "4px" }}
                    >
                      🖨️ Print
                    </button>
                  </td>

                  {/* WHATSAPP ROW ACTION */}
                  <td style={{ textAlign: "center" }}>
                    {inv.phone ? (
                      <a 
                        href={getWhatsAppLink(inv)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none", padding: "4px 8px", backgroundColor: "#22c55e", color: "white", borderRadius: "4px", fontSize: "0.85rem", display: "inline-block" }}
                      >
                        💬 Send
                      </a>
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: '0.85rem' }}>No Phone</span>
                    )}
                  </td>

                  {/* EMAIL ROW ACTION */}
                  <td style={{ textAlign: "center" }}>
                    {inv.email ? (
                      <a 
                        href={getEmailLink(inv)}
                        style={{ textDecoration: "none", padding: "4px 8px", backgroundColor: "#ea580c", color: "white", borderRadius: "4px", fontSize: "0.85rem", display: "inline-block" }}
                      >
                        ✉️ Email
                      </a>
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: '0.85rem' }}>No Email</span>
                    )}
                  </td>

                  <td>{inv.date ? new Date(inv.date).toLocaleDateString() : ""}</td>
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