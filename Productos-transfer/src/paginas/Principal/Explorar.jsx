import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Explorar({ user }) {
  const [ofertas, setOfertas] = useState([]);
  const [seleccion, setSeleccion] = useState({});

  const cargarOfertas = async () => {
    const { data, error } = await supabase
      .from("ofertas")
      .select("*")
      .eq("estado", "ACTIVA")
      .neq("usuario_id", user.id);

    if (!error) setOfertas(data);
  };

  useEffect(() => {
    if (user) cargarOfertas();
  }, [user]);

  const registrarSolicitud = async (oferta) => {
    const cantidad = seleccion[oferta.id];
    if (!cantidad || cantidad <= 0)
      return alert("Debe indicar una cantidad válida");

    await supabase.from("ofertas_solicitudes").insert([
      {
        id_oferta: oferta.id,
        id_usuario_solicitante: user.id,
        cantidad_solicitada: parseInt(cantidad),
      },
    ]);

    alert("Solicitud registrada correctamente");
    setSeleccion({});
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-blue-700 mb-4">Explorar Ofertas Disponibles</h2>
      <table className="w-full bg-white rounded-xl shadow-md">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2 text-left">Código</th>
            <th className="p-2 text-left">Descripción</th>
            <th className="p-2 text-left">Cantidad</th>
            <th className="p-2 text-left">Vence</th>
            <th className="p-2 text-left">Solicitar</th>
          </tr>
        </thead>
        <tbody>
          {ofertas.map((o) => (
            <tr key={o.id} className="border-t">
              <td className="p-2">{o.codmed}</td>
              <td className="p-2">{o.Nombre_Medicamento}</td>
              <td className="p-2">{o.cantidad}</td>
              <td className="p-2">{o.fecha_venc}</td>
              <td className="p-2 flex gap-2">
                <input
                  type="number"
                  min="1"
                  placeholder="Cant."
                  className="border p-1 rounded w-20"
                  value={seleccion[o.id] || ""}
                  onChange={(e) =>
                    setSeleccion({ ...seleccion, [o.id]: e.target.value })
                  }
                />
                <button
                  onClick={() => registrarSolicitud(o)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Enviar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
