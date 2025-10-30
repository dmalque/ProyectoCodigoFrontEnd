export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
      <h2 className="text-3xl font-bold text-blue-600">Iniciar Sesión</h2>
      <form className="mt-6 bg-white p-6 rounded-xl shadow-md w-80">
        <input type="email" placeholder="Correo electrónico" className="border p-2 w-full rounded mb-3" />
        <input type="password" placeholder="Contraseña" className="border p-2 w-full rounded mb-3" />
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">Ingresar</button>
      </form>
    </div>
  )
}
