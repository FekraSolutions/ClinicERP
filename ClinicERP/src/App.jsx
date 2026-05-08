import { Routes, Route } from "react-router-dom"

import Sidebar from "./components/Sidebar"
import ProtectedRoute from "./auth/ProtectedRoute"
import Login from "./auth/Login"

import Home from "./pages/Home"
import Database from "./pages/Database"
import Reception from "./pages/Reception"
import Expenses from "./pages/Expenses"
import Sessions from "./pages/Sessions"
import IncomeStatement from "./pages/IncomeStatement"
import Invoices from "./pages/Invoices"
import PatientsFiles from "./pages/PatientsFiles"
import Payroll from "./pages/Payroll"
import AccountsReceivables from "./pages/AccountsReceivables"


function App() {
  return (
    <Routes>

      {/* Login Page */}
      <Route path="/login" element={<Login />} />

      {/* Protected ERP Area */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div style={{ display: "flex", height: "100vh" }}>
              <Sidebar />

              <div style={{ flex: 1, padding: "40px" }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/database" element={<Database />} />
                  <Route path="/reception" element={<Reception />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/sessions" element={<Sessions />} />
                  <Route path="/income-statement" element={<IncomeStatement />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/patients-files" element={<PatientsFiles />} />
                  <Route path="/payroll" element={<Payroll />} />
                  <Route path="/accounts-receivables" element={<AccountsReceivables />} />
                </Routes>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

    </Routes>
  )
}

export default App
