import { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "../auth/AuthContext";

function Payroll() {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [history, setHistory] = useState([]);
  const [filterMonth, setFilterMonth] = useState("");
  
  const [formData, setFormData] = useState({
    employeeName: "",
    basicSalary: 0,
    additions: 0,
    deductions: 0,
    period: new Date().toISOString().split('T')[0] 
  });

  // 🔹 Auto-calculate Net Salary live
  const currentNetSalary = useMemo(() => {
    return (Number(formData.basicSalary) + Number(formData.additions)) - Number(formData.deductions);
  }, [formData]);

useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await fetch(`https://clinic-erp-beta.vercel.app/database/${user.id}`);
        const dbData = await empRes.json();

        // 🔹 Extract Employees AND Doctors
        const allStaff = dbData.map(row => {
          if (row.employeeName) return row.employeeName;
          if (row.doctorName) return row.doctorName;
          return null;
        }).filter(name => name !== null); // Remove empty rows

        // Remove duplicates (in case someone is listed as both)
        const uniqueStaff = [...new Set(allStaff)];
        
        setEmployees(uniqueStaff);

        const historyRes = await fetch(`https://clinic-erp-beta.vercel.app/payroll/${user.id}`);
        setHistory(await historyRes.json());
      } catch (e) { console.error("Fetch error", e); }
    };
    if (user?.id) fetchData();
  }, [user]);

  const filteredHistory = history.filter(rec => 
    filterMonth ? rec.period.startsWith(filterMonth) : true
  );

  const totalPayout = filteredHistory.reduce((sum, rec) => sum + rec.netSalary, 0);

  const handleSave = async () => {
    if (!formData.employeeName) return alert("Select an employee");
    
    const response = await fetch(`https://clinic-erp-beta.vercel.app/payroll/${user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, netSalary: currentNetSalary })
    });

    if (response.ok) {
      alert("Payroll Saved!");
      const updated = await fetch(`https://clinic-erp-beta.vercel.app/payroll/${user.id}`);
      setHistory(await updated.json());
    }
  };

  return (
    <div className="payroll-container">
      {/* 🔹 THE PRINT SHIELD 🔹 */}
      <style>
        {`
          @media print {
            /* 1. Hide the Sidebar (searching for common class names and tags) */
            nav, aside, .sidebar, [class*="sidebar"], [class*="Sidebar"] {
              display: none !important;
            }

            /* 2. Hide all UI elements inside Payroll that shouldn't be on paper */
            .no-print, .payroll-form, button, input, select, hr {
              display: none !important;
            }

            /* 3. Force the main area to be full width and visible */
            body, html, #root, .main-content, main {
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              display: block !important;
            }

            .payroll-container {
              width: 100% !important;
              position: absolute;
              left: 0;
              top: 0;
            }

            /* 4. Table styling for paper */
            table { 
              width: 100% !important; 
              border: 1px solid black !important;
            }
            th, td { 
              border: 1px solid black !important; 
              padding: 8px !important; 
            }
          }
        `}
      </style>

      <h2 className="no-print">Payroll Management</h2>
      
      {/* Input Section - Added 'payroll-form' and 'no-print' classes */}
      <div className="payroll-form no-print" style={{ display: 'grid', gap: '10px', background: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
<select 
  value={formData.employeeName} 
  onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
>
  <option value="">Select Staff Member</option>
  {/* Update this line below */}
  {employees.map((name, index) => (
    <option key={index} value={name}>{name}</option>
  ))}
</select>
        
        <input type="number" placeholder="Basic Salary" onChange={(e) => setFormData({...formData, basicSalary: e.target.value})} />
        <input type="number" placeholder="Additions" onChange={(e) => setFormData({...formData, additions: e.target.value})} />
        <input type="number" placeholder="Deductions" onChange={(e) => setFormData({...formData, deductions: e.target.value})} />
        <input type="date" value={formData.period} onChange={(e) => setFormData({...formData, period: e.target.value})} />
        
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
          Live Net Salary: {currentNetSalary.toLocaleString()}
        </div>
        <button onClick={handleSave} style={{ background: '#28a745', color: 'white', padding: '10px' }}>Save Record</button>
      </div>

      <hr className="no-print" />

      {/* History & Filters */}
      <div style={{ marginTop: '20px' }}>
        <div className="no-print">
          <input type="month" onChange={(e) => setFilterMonth(e.target.value)} placeholder="Filter by month" />
          <button onClick={() => window.print()} style={{ marginLeft: '10px' }}>Print Report</button>
        </div>
        
        <div style={{ margin: '15px 0', fontSize: '1.1rem' }}>
          <strong>Total Payout for Period: {totalPayout.toLocaleString()}</strong>
        </div>

        <table width="100%" border="1" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#eee' }}>
              <th>Employee</th>
              <th>Basic</th>
              <th>Add (+)</th>
              <th>Ded (-)</th>
              <th>Net Salary</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map(rec => (
              <tr key={rec.id}>
                <td>{rec.employeeName}</td>
                <td>{rec.basicSalary}</td>
                <td>{rec.additions}</td>
                <td>{rec.deductions}</td>
                <td style={{ fontWeight: 'bold' }}>{rec.netSalary}</td>
                <td>{new Date(rec.period).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Payroll;