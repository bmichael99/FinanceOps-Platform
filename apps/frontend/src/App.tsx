import { useState } from 'react'
import { Button } from './components/ui/button'
import DashboardLayout from './layouts/DashboardLayout'
import './App.css'
import { Link, Navigate } from 'react-router-dom'
function App() {


  return (
    <Navigate to="/dashboard" replace />
    // <>
    // <Link to="/dashboard">Dashboard</Link>
    // <p>Home page</p>
    //   </>
  )
}

export default App
