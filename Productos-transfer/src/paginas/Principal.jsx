import { supabase } from "../lib/supabaseClient"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-blue-700">Panel de Productos</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </div>
      <p className="text-gray-600">Aquí verás tus productos en sobrestock o próximos a vencer.</p>
    </div>
  )
}
