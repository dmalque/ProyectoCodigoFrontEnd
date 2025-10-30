import { useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useNavigate, Link } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMsg("")

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setErrorMsg(error.message)
    } else {
      navigate("/dashboard")
    }
  }

  return (

    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
      <h2 className="text-3xl font-bold text-blue-600">Iniciar Sesión</h2>
      <form
        onSubmit={handleLogin}
        className="mt-6 bg-white p-6 rounded-xl shadow-md w-80"
      >
        <input
          type="email"
          placeholder="Correo electrónico"
          className="border p-2 w-full rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="border p-2 w-full rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Ingresar
        </button>
        <p className="mt-4 text-center text-sm">
          <Link to="/" className="text-blue-600 hover:underline">Volver al inicio</Link>
        </p>
      </form>
      {errorMsg && <p className="mt-4 text-red-600">{errorMsg}</p>}
    </div>
  )
}
