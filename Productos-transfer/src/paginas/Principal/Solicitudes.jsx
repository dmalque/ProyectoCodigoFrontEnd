import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Solicitudes({ user }) {
  const [solicitudes, setSolicitudes] = useState([]);

  const cargarSolicitudes = async () => {
    const { data, error } = await supabase
      .from("vw_mis_solicitudes")
      .select("*")
      .eq("id_solicitante", user.id)
      .order("fecha_solicitud", { ascending: false });

    if (!error) setSolicitudes(data);
  };

  useEffect(() => {
    if (user) cargarSolicitudes();
  }, [user]);

  return (
    <div>
      <h2 className="text-xl font-bold text-blue-700 mb-4">Mis Solicitudes</h2>
      <table className="w-full bg-white rounded-xl shadow-md">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2 text-left">Código</th>
            <th className="p-2 text-left">Descripción</th>
            <th className="p-2 text-left">Cantidad</th>
            <th className="p-2 text-left">Estado</th>
            <th className="p-2 text-left">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((s) => (
            <tr key={s.id_solicitud} className="border-t">
              <td className="p-2">{s.codmed}</td>
              <td className="p-2">{s.descripcion}</td>
              <td className="p-2">{s.cantidad_solicitada}</td>
              <td className="p-2">{s.estado_solicitud}</td>
              <td className="p-2">{new Date(s.fecha_solicitud).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
