import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-blue-200 text-gray-800">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">Gestión de Productos Farmacéuticos</h1>
      <p className="text-center max-w-md mb-8">
        Plataforma colaborativa para optimizar el uso de medicamentos entre establecimientos de salud.
        Regístrate o inicia sesión para gestionar tus productos en sobrestock o próximos a vencer.
      </p>

      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Iniciar Sesión
        </Link>
        <Link
          to="/register"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Registrarse
        </Link>
      </div>
    </div>
  )
}
