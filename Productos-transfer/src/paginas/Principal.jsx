import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Ofertar from "./Principal/Ofertar";
import Explorar from "./Principal/Explorar";
import Solicitudes from "./Principal/Solicitudes";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [seccion, setSeccion] = useState("ofertar");

  // ✅ Obtener usuario autenticado
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  // 🚧 Si aún no carga el usuario
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Cargando usuario...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 🔵 Encabezado fijo con info de usuario */}
      <header className="bg-white p-4 rounded-xl shadow-md mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-700">Panel Principal</h1>

        <div className="text-right">
          <p className="text-sm text-gray-700 font-semibold">
            {user.user_metadata?.nombre || "Usuario"}
          </p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/";
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </header>

      {/* 🔘 Menú de navegación */}
      <nav className="flex gap-4 mb-6">
        <button
          onClick={() => setSeccion("ofertar")}
          className={`px-4 py-2 rounded ${
            seccion === "ofertar"
              ? "bg-blue-600 text-white"
              : "bg-white border"
          }`}
        >
          Mis Ofertas
        </button>
        <button
          onClick={() => setSeccion("explorar")}
          className={`px-4 py-2 rounded ${
            seccion === "explorar"
              ? "bg-blue-600 text-white"
              : "bg-white border"
          }`}
        >
          Explorar Ofertas
        </button>
        <button
          onClick={() => setSeccion("solicitudes")}
          className={`px-4 py-2 rounded ${
            seccion === "solicitudes"
              ? "bg-blue-600 text-white"
              : "bg-white border"
          }`}
        >
          Mis Solicitudes
        </button>
      </nav>

      {/* 🧱 Render dinámico según sección */}
      <main>
        {seccion === "ofertar" && <Ofertar user={user} />}
        {seccion === "explorar" && <Explorar user={user} />}
        {seccion === "solicitudes" && <Solicitudes user={user} />}
      </main>
    </div>
  );
}
