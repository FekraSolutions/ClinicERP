import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "./AuthContext"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { setUser } = useContext(AuthContext) // we’ll store user on success
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setUser(data.user)               // store logged-in user
        localStorage.setItem("user", JSON.stringify(data.user))
        navigate("/")                     // redirect to home
      } else {
        alert(data.message)              // show backend error
      }
    } catch (err) {
      console.error(err)
      alert("Server error, try again")
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "300px" }}>
        <h2>Login to ClinicERP</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: "10px", padding: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: "10px", padding: "10px" }}
        />
        <button type="submit" style={{ padding: "10px", backgroundColor: "#1e293b", color: "white", cursor: "pointer" }}>
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
