import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        navigate("/login")
      } else {
        setUser(data.user)
      }
    }

    fetchUser()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-600">Cargando datos del usuario...</p>
      </div>
    )
  }

  const { email, user_metadata } = user

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center">
      <div className="bg-white shadow-md rounded-xl p-8 w-96 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Panel Principal</h1>

        <div className="text-left mb-6">
          <p><strong>Nombre:</strong> {user_metadata?.nombre || "No especificado"}</p>
          <p><strong>Teléfono:</strong> {user_metadata?.telefono || "No especificado"}</p>
          <p><strong>Correo:</strong> {email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
