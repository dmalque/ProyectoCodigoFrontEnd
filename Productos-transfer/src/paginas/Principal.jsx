import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Dashboard() {
  const [view, setView] = useState("ofertar");
  const [ofertas, setOfertas] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [tipoOferta, setTipoOferta] = useState("INTERCAMBIO");

  // Cargar datos de Supabase según vista seleccionada
  useEffect(() => {
    const fetchData = async () => {
      if (view === "explorar") {
        const { data, error } = await supabase.from("vw_ofertas_activas").select("*");
        if (!error) setOfertas(data);
      }
      if (view === "solicitudes") {
        const { data, error } = await supabase.from("vw_mis_solicitudes").select("*");
        if (!error) setSolicitudes(data);
      }
    };
    fetchData();
  }, [view]);

  // Publicar nueva oferta
  const handlePublicar = async (e) => {
    e.preventDefault();
    const user = (await supabase.auth.getUser()).data.user;
    const { error } = await supabase.from("ofertas").insert([
      {
        id_establecimiento: user.id,
        codmed: producto,
        descripcion: producto,
        cantidad: parseInt(cantidad),
        tipo_oferta: tipoOferta
      }
    ]);
    if (!error) {
      alert("✅ Oferta publicada con éxito");
      setProducto("");
      setCantidad("");
    } else {
      alert("❌ Error al publicar oferta: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Panel Principal</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView("ofertar")}
          className={`px-4 py-2 rounded ${view === "ofertar" ? "bg-blue-600 text-white" : "bg-white border"}`}
        >
          Ofertar
        </button>
        <button
          onClick={() => setView("explorar")}
          className={`px-4 py-2 rounded ${view === "explorar" ? "bg-blue-600 text-white" : "bg-white border"}`}
        >
          Explorar Ofertas
        </button>
        <button
          onClick={() => setView("solicitudes")}
          className={`px-4 py-2 rounded ${view === "solicitudes" ? "bg-blue-600 text-white" : "bg-white border"}`}
        >
          Mis Solicitudes
        </button>
      </div>

      {view === "ofertar" && (
        <form onSubmit={handlePublicar} className="bg-white p-6 rounded-xl shadow w-96">
          <h2 className="text-xl font-semibold mb-4">Publicar nueva oferta</h2>
          <input
            type="text"
            placeholder="Código o nombre del producto"
            className="border p-2 w-full mb-3 rounded"
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Cantidad"
            className="border p-2 w-full mb-3 rounded"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
          />
          <select
            className="border p-2 w-full mb-3 rounded"
            value={tipoOferta}
            onChange={(e) => setTipoOferta(e.target.value)}
          >
            <option value="INTERCAMBIO">Intercambio</option>
            <option value="DONACION">Donación</option>
          </select>
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            Publicar
          </button>
        </form>
      )}

      {view === "explorar" && (
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-3">Ofertas activas</h2>
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Producto</th>
                <th className="p-2">Cantidad</th>
                <th className="p-2">Tipo</th>
                <th className="p-2">Establecimiento</th>
              </tr>
            </thead>
            <tbody>
              {ofertas.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-2">{o.descripcion}</td>
                  <td className="p-2">{o.cantidad}</td>
                  <td className="p-2">{o.tipo_oferta}</td>
                  <td className="p-2">{o.establecimiento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === "solicitudes" && (
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-3">Mis solicitudes</h2>
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Producto</th>
                <th className="p-2">Cantidad</th>
                <th className="p-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-2">{s.descripcion}</td>
                  <td className="p-2">{s.cantidad_solicitada}</td>
                  <td className="p-2">{s.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
