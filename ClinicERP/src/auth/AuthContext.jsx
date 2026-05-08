import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

function AuthProvider({ children }) {
  // Read user from localStorage on app load
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user")
    return savedUser ? JSON.parse(savedUser) : null
  })

const login = async (username, password) => {
  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return false;
    }

    const userObj = { username: data.user.username };
    setUser(userObj);
    localStorage.setItem("user", JSON.stringify(userObj));

    return true;

  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};


  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  // Keep localStorage synced
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
