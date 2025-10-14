import React from 'react'
import {  Route, Routes } from 'react-router-dom'
import Form from './pages/Form'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import PageNotFound from './pages/PageNotFound'
import './App.css'
function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Form/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/admin" element={<AdminDashboard/>} />
      <Route path="*" element={<PageNotFound/>} />
    </Routes>
  )
}

export default App