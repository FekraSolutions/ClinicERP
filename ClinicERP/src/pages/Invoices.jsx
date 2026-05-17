import React, { useEffect, useState } from "react";
import axios from "axios";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeInvoice, setActiveInvoice] = useState(null);

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

  // 1. CLEAN PRINT METHOD
  const handlePrint = (inv) => {
    setActiveInvoice(inv);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // 2. FIXED WHATSAPP WEB METHOD
  const sendWhatsApp = (inv) => {
    if (!inv.phone) return alert("No phone number recorded for this patient.");
    
    let cleanPhone = inv.phone.replace(/\D/g, "");
    if (cleanPhone.startsWith("00")) {
      cleanPhone = cleanPhone.substring(2);
    }

    const textMessage = `*INVOICE RECEIPT*\n\n` +
      `*Patient:* ${inv.patientName}\n` +
      `*Date:* ${new Date(inv.date).toLocaleDateString()}\n` +
      `*Service:* ${inv.service}\n` +
      `*Total Price:* ${inv.priceAfterDiscount}\n` +
      `*Paid:* ${inv.paid}\n` +
      `*Remaining:* ${inv.remaining}\n\n` +
      `Thank you for choosing our clinic!`;

    const encodedText = encodeURIComponent(textMessage);
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
    
    window.open(whatsappUrl, "_blank");
  };

  // 3. ROBUST EMAIL CONSTRUCTOR
  const sendEmail = (inv) => {
    if (!inv.email) return alert("No email address recorded for this patient.");
    
    const subject = `Invoice from Clinic - ${inv.patientName}`;
    const body = `Dear ${inv.patientName},\n\n` +
      `Please find the summary of your recent medical invoice below:\n\n` +
      `Invoice ID: INV-${inv.id || 'N/A'}\n` +
      `Date: ${new Date(inv.date).toLocaleDateString()}\n` +
      `Service: ${inv.service}\n` +
      `Doctor: ${inv.doctor}\n` +
      `----------------------------------------\n` +
      `Total Charges: ${inv.price || '0'}\n` +
      `Discount: ${inv.discountAmount || '0'}\n` +
      `Net Price: ${inv.priceAfterDiscount || '0'}\n` +
      `Amount Paid: ${inv.paid || '0'}\n` +
      `Balance Due: ${inv.remaining || '0'}\n` +
      `----------------------------------------\n\n` +
      `Thank you for your trust.\nBest regards,\nClinic Management`;

    window.location.href = `mailto:${inv.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (loading) return <p>Loading invoices...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      {/* CSS STYLING ENGINE FOR THE PRINT LAYER */}
{/* CSS STYLING ENGINE FOR THE PRINT LAYER */}
      <style>
        {`
          .invoice-print-preview { display: none; }
          
          @media print {
            /* Force the browser to restrict pages to exactly 1 sheet if content fits */
            html, body {
              height: 100%;
              max-height: 100vh;
              overflow: hidden !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            body * { visibility: hidden; }
            .invoice-print-preview, .invoice-print-preview * { visibility: visible; }
            
            .invoice-print-preview {
              display: block !important;
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              max-width: 750px;
              padding: 20px;
              color: #000 !important;
              box-sizing: border-box;
            }
            .no-print-area { display: none !important; }
          }
        `}
      </style>

      {/* RETAIL STYLE DESIGNED INVOICE COMPONENT CONTAINER */}
{/* RETAIL STYLE DESIGNED INVOICE COMPONENT CONTAINER */}
      {activeInvoice && (
        <div className="invoice-print-preview" style={{ 
          fontFamily: "'Courier New', Courier, monospace", 
          width: "100%",
          maxWidth: "750px", /* Fits perfectly on standard A4 paper width */
          margin: "0 auto", 
          border: "1px solid #000", 
          padding: "20px", 
          backgroundColor: "#fff",
          boxSizing: "border-box" /* Ensures padding doesn't push width out */
        }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h1 style={{ margin: "0 0 5px 0", fontSize: "24px", letterSpacing: "2px" }}>OFFICIAL INVOICE</h1>
            <p style={{ margin: "2px 0" }}>{activeInvoice.companyName || "MEDICAL CLINIC CENTER"}</p>
            <p style={{ margin: "2px 0" }}>{activeInvoice.companyAddress || "Clinic Corporate Address Line"}</p>
            <p style={{ margin: "2px 0", fontSize: "12px" }}>Tax Reg: {activeInvoice.taxNumber || "N/A"} | CR: {activeInvoice.registrationNumber || "N/A"}</p>
          </div>
          
          <hr style={{ borderTop: "2px dashed #000", margin: "15px 0" }} />
          
          <table width="100%" style={{ fontSize: "14px", marginBottom: "20px", lineHeight: "1.6", tableLayout: "fixed" }}>
            <tbody>
              <tr>
                <td style={{ wordBreak: "break-word" }}><strong>Invoice No:</strong> #INV-{activeInvoice.id || "100"}</td>
                <td style={{ textAlign: "right", wordBreak: "break-word" }}><strong>Date:</strong> {new Date(activeInvoice.date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style={{ wordBreak: "break-word" }}><strong>Patient Name:</strong> {activeInvoice.patientName}</td>
                <td style={{ textAlign: "right", wordBreak: "break-word" }}><strong>Time:</strong> {activeInvoice.time || ""}</td>
              </tr>
              <tr>
                <td style={{ wordBreak: "break-word" }}><strong>Patient ID:</strong> {activeInvoice.patientId || "N/A"}</td>
                <td style={{ textAlign: "right", wordBreak: "break-word" }}><strong>Doctor:</strong> {activeInvoice.doctor || "N/A"}</td>
              </tr>
            </tbody>
          </table>

          <table width="100%" border="1" cellPadding="8" style={{ borderCollapse: "collapse", borderColor: "#000", fontSize: "14px", tableLayout: "fixed" }}>
            <thead>
              <tr style={{ background: "#f2f2f2" }}>
                <th style={{ textAlign: "left" }}>Description Summary / Services</th>
                <th style={{ width: "90px", textAlign: "center" }}>Sessions</th>
                <th style={{ width: "110px", textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ wordBreak: "break-word" }}>{activeInvoice.service || "General Medical Examination consultation"}</td>
                <td style={{ textAlign: "center" }}>{activeInvoice.sessions || "1"}</td>
                <td style={{ textAlign: "right" }}>{activeInvoice.price || "0.00"}</td>
              </tr>
              {Number(activeInvoice.discountAmount) > 0 && (
                <tr>
                  <td colSpan="2" style={{ textAlign: "right", fontStyle: "italic" }}>Special Discount Deducted:</td>
                  <td style={{ textAlign: "right", color: "red" }}>-${activeInvoice.discountAmount}</td>
                </tr>
              )}
              <tr style={{ fontWeight: "bold" }}>
                <td colSpan="2" style={{ textAlign: "right" }}>Grand Total Balance Due:</td>
                <td style={{ textAlign: "right" }}>{activeInvoice.priceAfterDiscount || "0.00"}</td>
              </tr>
              <tr style={{ color: "green" }}>
                <td colSpan="2" style={{ textAlign: "right" }}>Amount Received Payment ({activeInvoice.payMethod || "Cash"}):</td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>{activeInvoice.paid || "0.00"}</td>
              </tr>
              <tr style={{ fontWeight: "bold", borderTop: "2px double #000" }}>
                <td colSpan="2" style={{ textAlign: "right" }}>Net Remaining Balance Owed:</td>
                <td style={{ textAlign: "right" }}>{activeInvoice.remaining || "0.00"}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: "40px", textAlign: "center", fontSize: "12px", fontStyle: "italic" }}>
            <p>Thank you for choosing our medical services system facility.</p>
            <p>Generated via Fekra Business ERP Platform System</p>
          </div>
        </div>
      )}

      {/* THE MAIN INTERFACE VIEW LAYER */}
      <div className="no-print-area">
        <h2>Invoices</h2>
        <div style={{ overflowX: "auto" }}>
          <table
            border="1"
            cellPadding="5"
            style={{ minWidth: "1600px", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>#</th>
                {/* 3 MAGNIFICENT COLUMNS INTEGRATED CLEANLY */}
                <th>Print</th>
                <th>WhatsApp</th>
                <th>Email Action</th>
                
                {/* ALL YOUR 21 ORIGINAL HEADERS UNTOUCHED */}
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
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="25" style={{ textAlign: "center" }}>No invoices yet</td>
                </tr>
              ) : (
                invoices.map((inv, index) => (
                  <tr key={inv.id || index}>
                    <td>{index + 1}</td>
                    
                    {/* PRINT ACTION ROW CELL */}
                    <td style={{ textAlign: "center" }}>
                      <button 
                        onClick={() => handlePrint(inv)} 
                        style={{ padding: "4px 8px", backgroundColor: "#0284c7", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        🖨️ Print
                      </button>
                    </td>

                    {/* WHATSAPP ACTION ROW CELL */}
                    <td style={{ textAlign: "center" }}>
                      <button 
                        onClick={() => sendWhatsApp(inv)} 
                        style={{ padding: "4px 8px", backgroundColor: "#22c55e", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        💬 Send
                      </button>
                    </td>

                    {/* MAIL CLIENT ACTION ROW CELL */}
                    <td style={{ textAlign: "center" }}>
                      <button 
                        onClick={() => sendEmail(inv)} 
                        style={{ padding: "4px 8px", backgroundColor: "#ea580c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        ✉️ Mail
                      </button>
                    </td>

                    {/* ALL YOUR ORIGINAL ROW DATA DATA BLOCKS EXCEL CELLS */}
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
    </div>
  );
}

export default Invoices;