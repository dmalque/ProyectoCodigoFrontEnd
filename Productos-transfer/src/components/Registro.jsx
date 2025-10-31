import { useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useNavigate, Link } from "react-router-dom"

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    password: ""
  })
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const validateForm = () => {
    if (!formData.nombre.trim()) return "El nombre es obligatorio."
    if (!/^[a-zA-Z\s]+$/.test(formData.nombre)) return "El nombre solo debe contener letras."
    if (!/^\d{9}$/.test(formData.telefono)) return "El teléfono debe tener 9 dígitos numéricos."
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Correo electrónico no válido."
    if (formData.password.length < 6) return "La contraseña debe tener al menos 6 caracteres."
    return null
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    const validationError = validateForm()
    if (validationError) {
      setErrorMsg(validationError)
      return
    }
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          nombre: formData.nombre,
          telefono: formData.telefono
        }
      }
    })

    if (error) {
      setErrorMsg(error.message)
    } else {
      setSuccessMsg("Usuario registrado correctamente. Verifica tu correo electrónico.")
      setTimeout(() => navigate("/login"), 2000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
      <h2 className="text-3xl font-bold text-blue-600">Crear Cuenta</h2>

      <form
        onSubmit={handleRegister}
        className="mt-6 bg-white p-6 rounded-xl shadow-md w-80"
      >
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          className="border p-2 w-full rounded mb-3"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono (9 dígitos)"
          className="border p-2 w-full rounded mb-3"
          value={formData.telefono}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "")
            setFormData({ ...formData, telefono: value })
          }}
          inputMode="numeric"
          pattern="\d{9}"
          maxLength={9}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          className="border p-2 w-full rounded mb-3"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          className="border p-2 w-full rounded mb-3"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          Registrarse
        </button>

        <p className="mt-4 text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </form>
      {errorMsg && <p className="mt-4 text-red-600">{errorMsg}</p>}
      {successMsg && <p className="mt-4 text-green-600">{successMsg}</p>}
    </div>

  )
}
