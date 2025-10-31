import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "../components/Home"
import Login from "../components/Login"
import Register from "../components/Registro"
import Dashboard from "../components/Principal"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
