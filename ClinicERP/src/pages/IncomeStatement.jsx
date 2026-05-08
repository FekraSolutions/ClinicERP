import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

function IncomeStatement() {
  const { user } = useContext(AuthContext);
  const [dates, setDates] = useState({ start: "", end: "" });
  const [data, setData] = useState({ revenue: 0, expenses: 0, payroll: 0 });

  const fetchReport = async () => {
    if (!dates.start || !dates.end) return alert("Please select a date range.");
    try {
      const res = await fetch(
        `http://localhost:5000/income-statement/${user.id}?startDate=${dates.start}&endDate=${dates.end}`
      );
      const result = await res.json();
      setData(result);
    } catch (error) {
      alert("Error fetching data.");
    }
  };

  const rev = Number(data?.revenue || 0);
  const exp = Number(data?.expenses || 0);
  const pay = Number(data?.payroll || 0);
  const netProfit = rev - (exp + pay);

  return (
    <div className="report-container" style={{ padding: "30px" }}>
      <style>
        {`
          /* SCREEN STYLES */
          .report-card { 
            background: #fff; padding: 30px; border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 600px; margin: 20px auto;
          }
          .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }

          /* PRINT STYLES - THE ISOLATION FIX */
          @media print {
            /* 1. Hide the entire root app structure */
            body * {
              visibility: hidden;
            }
            
            /* 2. Only show the report card and its children */
            .printable-report, .printable-report * {
              visibility: visible;
            }

            /* 3. Position the report at the absolute top-left of the paper */
            .printable-report {
              position: absolute;
              left: 0;
              top: 0;
              width: 100% !important;
              margin: 0 !important;
              padding: 20px !important;
              border: 2px solid #000 !important;
              box-shadow: none !important;
            }

            /* 4. Remove all gaps/margins from the page itself */
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #fff !important;
            }
          }
        `}
      </style>

      <div className="no-print" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2>Financial Report Generator</h2>
        <input type="date" onChange={(e) => setDates({ ...dates, start: e.target.value })} />
        <input type="date" style={{ margin: '0 10px' }} onChange={(e) => setDates({ ...dates, end: e.target.value })} />
        <button onClick={fetchReport} style={{ padding: '8px 16px', cursor: 'pointer' }}>Generate Report</button>
        <button onClick={() => window.print()} style={{ marginLeft: '10px', padding: '8px 16px' }}>Print PDF</button>
      </div>

      {/* Added the "printable-report" class here */}
      <div className="report-card printable-report">
        <h3 style={{ textAlign: 'center' }}>Income Statement</h3>
        <p style={{ textAlign: 'center' }}>{dates.start} to {dates.end}</p>
        <hr />
        
        <div className="row">
          <span>Gross Revenue:</span>
          <span style={{ color: 'green', fontWeight: 'bold' }}>+ ${rev.toLocaleString()}</span>
        </div>

        <div className="row">
          <span>Operating Expenses:</span>
          <span style={{ color: 'red' }}>- ${exp.toLocaleString()}</span>
        </div>

        <div className="row">
          <span>Payroll Costs:</span>
          <span style={{ color: 'red' }}>- ${pay.toLocaleString()}</span>
        </div>

        <div className="row" style={{ border: 'none', marginTop: '20px', background: '#f9f9f9', padding: '15px' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>NET PROFIT:</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: netProfit >= 0 ? 'green' : 'red' }}>
            ${netProfit.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default IncomeStatement;