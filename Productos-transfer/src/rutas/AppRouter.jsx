import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../paginas/Home"
import Login from "../paginas/Login"
import Register from "../paginas/Registro"
import Dashboard from "../paginas/Principal"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
