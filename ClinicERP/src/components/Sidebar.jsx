import { Link, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../auth/AuthContext"
import './Sidebar.css';

function Sidebar() {
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext) // get logout from AuthContext

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div style={{
      width: "250px",
      backgroundColor: "#1e293b",
      color: "white",
      padding: "20px"
    }}>
      <h2>ClinicERP</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/" className="sidebar-link">Home</Link></li>
  <li><Link to="/database" className="sidebar-link">Database</Link></li>
  <li><Link to="/reception" className="sidebar-link">Reception</Link></li>
  <li><Link to="/expenses" className="sidebar-link">Expenses</Link></li>
  <li><Link to="/sessions" className="sidebar-link">Sessions</Link></li>
  <li><Link to="/income-statement" className="sidebar-link">Income Statement</Link></li>
  <li><Link to="/invoices" className="sidebar-link">Invoices</Link></li>
  <li><Link to="/patients-files" className="sidebar-link">Patients Files</Link></li>
  <li><Link to="/payroll" className="sidebar-link">Payroll</Link></li>
  <li><Link to="/accounts-receivables" className="sidebar-link">Accounts Receivables</Link></li>

<a 
  href="https://fekrasolutions.github.io/Remote-Virtual-Assistance/" 
  target="_blank" 
  rel="noopener noreferrer"
  className="sidebar-link" // 👈 Add the exact same class your <Link> tags are using
>
  Learn
</a>

        <li
          onClick={handleLogout}
          style={{ cursor: "pointer", marginTop: "20px" }}
        >
          Log Out
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
