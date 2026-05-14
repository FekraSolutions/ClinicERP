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
      const res = await fetch("https://clinic-erp-beta.vercel.app/login", {
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
        {/* --- MARKETING SECTION --- */}
<div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
  
  {/* 1. WATCH APP TEST BUTTON */}
  <a 
    href="https://youtu.be/pIg6ZAXfkQI" 
    target="_blank" 
    rel="noopener noreferrer"
    style={{
      display: 'block',
      textAlign: 'center',
      padding: '12px',
      backgroundColor: '#f0f0f0',
      color: '#333',
      textDecoration: 'none',
      borderRadius: '5px',
      fontWeight: '500',
      border: '1px solid #ccc'
    }}
  >
    🎬 Watch App Test
  </a>

  {/* 2. BOOK A DEMO NOW (PREMIUM BUTTON) */}
  <div style={{ 
    marginTop: '10px',
    padding: '20px', 
    border: '2px solid #FFD700', 
    borderRadius: '10px', 
    backgroundColor: '#fffcf0',
    textAlign: 'center'
  }}>
    <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>Ready to Scale?</h3>
    <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>Book a personal demo with our experts.</p>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* WhatsApp - THE "VIP" CONTACT */}
      <a 
        href="https://wa.me/201060469453" 
        target="_blank"
        style={{
          backgroundColor: '#25D366',
          color: 'white',
          padding: '12px',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        💬 WhatsApp Demo
      </a>

      {/* Call & Email - Simple Links */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
        <a href="tel:00201060469453" style={{ color: '#007bff' }}>📞 Call Now</a>
        <a href="mailto:fekrabusinesssolutions@gmail.com" style={{ color: '#007bff' }}>✉️ Email Us</a>
      </div>
    </div>
  </div>
</div>
      </form>
    </div>
  )
}

export default Login
