import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../auth/AuthContext"
import "./Database.css"

function Database() {
  const { user } = useContext(AuthContext)

  const [tableData, setTableData] = useState([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // 🔹 Load data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/database/${user.id}`)
        const data = await response.json()

        if (data.length === 0) {
          // If no data, show one empty row
          setTableData([
            {
              id: 1,
              employeeName: "",
              doctorName: "",
              serviceName: "",
              servicePrice: "",
              inventoryItemName: "",
              purchasePrice: "",
              salePrice: ""
            }
          ])
        } else {
          setTableData(data)
        }

      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }

    if (user?.id) {
      fetchData()
    }
  }, [user])

  // 🔹 Handle cell change
  const handleCellChange = (rowIndex, field, value) => {
    const newData = [...tableData]
    newData[rowIndex][field] = value
    setTableData(newData)
    setHasUnsavedChanges(true)
  }

  // 🔹 Add new row
  const handleAddRow = () => {
    const newRow = {
      id: tableData.length > 0 ? tableData[tableData.length - 1].id + 1 : 1,
      employeeName: "",
      doctorName: "",
      serviceName: "",
      servicePrice: "",
      inventoryItemName: "",
      purchasePrice: "",
      salePrice: ""
    }
    setTableData([...tableData, newRow])
    setHasUnsavedChanges(true)
  }

  // 🔹 Save changes to backend
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/database/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tableData)
      })

      const result = await response.json()
      alert(result.message)
      setHasUnsavedChanges(false)

    } catch (error) {
      console.error("Save failed:", error)
      alert("Failed to save data")
    }
  }

  // 🔹 Warn before leaving page
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [hasUnsavedChanges])

  return (
    <div className="database-container">
      <h1>{user?.username} Database Page</h1>

      <div className="buttons-container">
        <button className="save-button" onClick={handleSave}>
          Save Changes
        </button>

        <button className="add-row-button" onClick={handleAddRow}>
          Add Row
        </button>
      </div>

      <div className="table-wrapper">
        <table className="database-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Doctor Name</th>
              <th>Service Name</th>
              <th>Service Price</th>
              <th>Inventory Item Name</th>
              <th>Inventory Item Purchase Price</th>
              <th>Inventory Item Sale Price</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={row.id}>
                <td>
                  <input
                    type="text"
                    value={row.employeeName || ""}
                    onChange={(e) => handleCellChange(rowIndex, "employeeName", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.doctorName || ""}
                    onChange={(e) => handleCellChange(rowIndex, "doctorName", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.serviceName || ""}
                    onChange={(e) => handleCellChange(rowIndex, "serviceName", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.servicePrice || ""}
                    onChange={(e) => handleCellChange(rowIndex, "servicePrice", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.inventoryItemName || ""}
                    onChange={(e) => handleCellChange(rowIndex, "inventoryItemName", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.purchasePrice || ""}
                    onChange={(e) => handleCellChange(rowIndex, "purchasePrice", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.salePrice || ""}
                    onChange={(e) => handleCellChange(rowIndex, "salePrice", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Database