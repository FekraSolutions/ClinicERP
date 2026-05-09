import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios' // This is the missing "introduction"
import AuthProvider from './auth/AuthContext'
import App from './App'

// This tells your frontend where to send the data
axios.defaults.baseURL = "https://clinic-erp-beta.vercel.app";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)