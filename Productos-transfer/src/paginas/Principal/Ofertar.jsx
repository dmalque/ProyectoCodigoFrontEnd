import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Ofertar({ user }) {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [ofertas, setOfertas] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [tiposOferta, setTiposOferta] = useState({});
  useEffect(() => {
    const fetchProductos = async () => {
      const termino = busqueda.trim();
      let query = supabase.from("diario_detalle_ll").select("*").limit(50);

      if (termino.length >= 2) {
        query = query.or(
          `codmed.ilike.%${termino}%,Nombre_Medicamento.ilike.%${termino}%`
        );
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error al buscar:", error);
        setProductos([]);
      } else {
        const unicos = [];
        const seen = new Set();
        for (const p of data) {
          const key = `${p.codpre_det}-${p.codmed}-${p.lote}-${p.regsan}-${p.fecha_venc}`;
          if (!seen.has(key)) {
            seen.add(key);
            unicos.push(p);
          }
        }
        setProductos(unicos);
      }
    };

    fetchProductos();
  }, [busqueda]);

   useEffect(() => {
    if (!user) return;
    const cargar = async () => {
      const { data, error } = await supabase
        .from("ofertas")
        .select("*")
        .eq("usuario_id", user.id);
      if (!error) setOfertas(data || []);
    };
    cargar();
  }, [user]);


  const handleCantidadChange = (key, value) => {
    setCantidades((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTipoOfertaChange = (key, value) => {
    setTiposOferta((prev) => ({
      ...prev,
      [key]: value,
    }));
  };


  const publicarOfertas = async () => {
    const seleccionadas = productos.filter((p) => {
      const key = `${p.codpre_det}-${p.codmed}-${p.lote}-${p.regsan}-${p.fecha_venc}`;
      const cantidad = parseFloat(cantidades[key]);
      return !isNaN(cantidad) && cantidad > 0;
    });

    if (seleccionadas.length === 0) {
      alert("Debe ingresar al menos una cantidad válida para ofertar.");
      return;
    }

    const registros = seleccionadas.map((p) => {
      const key = `${p.codpre_det}-${p.codmed}-${p.lote}-${p.regsan}-${p.fecha_venc}`;
      return {
        usuario_id: user.id,
        codmed: p.codmed,
        descripcion: p.Nombre_Medicamento,
        cantidad: parseInt(cantidades[key]),
        lote: p.lote,
        regsan: p.regsan,
        fecha_venc: p.fecha_venc,
        fecha_publicacion: new Date(),
        tipo_oferta: tiposOferta[key] || "sobrestock", 
      };
    });

    const { error } = await supabase.from("ofertas").insert(registros);

    if (error) {
      alert("Error al registrar ofertas: " + error.message);
      return;
    }

    alert("Ofertas publicadas correctamente.");

 
    setCantidades({});
    setTiposOferta({});
    setBusqueda("");
    //setProductos([]);

 
    const { data: nuevasOfertas, error: errorRecarga } = await supabase
      .from("ofertas")
      .select("*")
      .eq("usuario_id", user.id)
      .order("fecha_publicacion", { ascending: false });

    if (errorRecarga) {
      console.error("Error al recargar ofertas:", errorRecarga);
    } else {
      setOfertas(nuevasOfertas || []);
    }
  };

 
  const eliminarOferta = async (id) => {
    if (!confirm("¿Desea eliminar esta oferta?")) return;
    const { error } = await supabase.from("ofertas").delete().eq("id", id);
    if (!error) setOfertas(ofertas.filter((o) => o.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">
        Registrar Nueva Oferta
      </h2>

      
      <input
        type="text"
        placeholder="Buscar por código o nombre del medicamento..."
        className="border rounded p-2 w-full mb-4"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

    
      <div className="overflow-x-auto max-h-96 border rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-blue-100 sticky top-0">
            <tr>
              <th className="p-2 text-left">Código</th>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Lote</th>
              <th className="p-2 text-left">Reg. Sanitario</th>
              <th className="p-2 text-left">Vence</th>
              <th className="p-2 text-right">Stock</th>
              <th className="p-2 text-right">CPM</th>
              <th className="p-2 text-right">MED</th>
              <th className="p-2 text-right">Cantidad</th>
              <th className="p-2 text-right">Tipo de Oferta</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center text-gray-500 p-3">
                  Sin resultados
                </td>
              </tr>
            ) : (
              productos.map((p) => {
                const key = `${p.codpre_det}-${p.codmed}-${p.lote}-${p.regsan}-${p.fecha_venc}`;
                return (
                  <tr
                    key={key}
                    className="border-t hover:bg-blue-50 transition-colors"
                  >
                    <td className="p-2">{p.codmed}</td>
                    <td className="p-2">{p.Nombre_Medicamento}</td>
                    <td className="p-2">{p.lote}</td>
                    <td className="p-2">{p.regsan}</td>
                    <td className="p-2">{p.fecha_venc}</td>
                    <td className="p-2 text-right">{p.stock_lote}</td>
                    <td className="p-2 text-right">{p.cpma}</td>
                    <td className="p-2 text-right">{p.med}</td>
                    <td className="p-2 text-right">
                      <input
                        type="number"
                        min="0"
                        className="border rounded w-24 p-1 text-right"
                        value={cantidades[key] || ""}
                        onChange={(e) =>
                          handleCantidadChange(key, e.target.value)
                        }
                      />
                    </td>
                    <td className="p-2 text-right">
                      <select
                        className="border rounded p-1 w-32"
                        value={tiposOferta[key] || "sobrestock"}
                        onChange={(e) =>
                          handleTipoOfertaChange(key, e.target.value)
                        }
                      >
                        <option value="sobrestock">Sobrestock</option>
                        <option value="donación">Donación</option>
                        <option value="transferencia">Transferencia</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {productos.length > 0 && (
        <div className="mt-4 text-right">
          <button
            onClick={publicarOfertas}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            Publicar todas las ofertas
          </button>
        </div>
      )}

     
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Mis Ofertas Publicadas
        </h3>
        {ofertas.length === 0 ? (
          <p className="text-gray-500">Aún no tienes ofertas registradas.</p>
        ) : (
          <table className="w-full border mt-2">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-2">Código</th>
                <th className="p-2">Descripción</th>
                <th className="p-2">Cantidad</th>
                <th className="p-2">Tipo</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ofertas.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-2">{o.codmed}</td>
                  <td className="p-2">{o.descripcion}</td>
                  <td className="p-2 text-center">{o.cantidad}</td>
                  <td className="p-2 text-center">{o.tipo_oferta}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => eliminarOferta(o.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
