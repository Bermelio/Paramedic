import { useEffect, useState } from 'react';

interface CampeonatoData {
  _id?: string;
  paramedico: string;
  torneo: string;
  club: string;
  categoria: string;
  partidos: string;
  hora: string;
  habilitado: boolean;
}

function CampeonatoTable() {
  const [campeonato, setCampeonato] = useState<CampeonatoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const evtSource = new EventSource('/api/campeonato/stream');

  evtSource.onmessage = (e) => {
    const data: CampeonatoData = JSON.parse(e.data);
    if (data?.habilitado) {
      setCampeonato(data);
    } else {
      setCampeonato(null);
    }
    setLoading(false);
  };

  evtSource.onerror = () => {
    console.error("Error SSE, cerrando conexión");
    evtSource.close();
  };

  return () => evtSource.close();
}, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4 mb-8">
        <div className="text-base sm:text-lg">Cargando campeonato...</div>
      </div>
    );
  }

  if (!campeonato) {
    return null;
  }

  return (
    <div className="mt-8">
      {/* Desktop */}
      <div className="hidden md:flex md:justify-center mb-6">
        <div className="w-full max-w-6xl overflow-x-auto">
          <table className="w-full border border-black">
            <thead className="bg-blue-600 text-white text-sm lg:text-lg">
              <tr>
                <th className="p-2 lg:p-3 border border-black" colSpan={5}>
                  CAMPEONATO – CAT. {campeonato.categoria} Paramédico: {campeonato.paramedico}
                </th>
              </tr>
              <tr className="bg-blue-400">
                <th className="p-2 lg:p-3 border border-black">TORNEO</th>
                <th className="p-2 lg:p-3 border border-black">CLUB</th>
                <th className="p-2 lg:p-3 border border-black">CATEGORÍA</th>
                <th className="p-2 lg:p-3 border border-black">PARTIDOS</th>
                <th className="p-2 lg:p-3 border border-black">HORA</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-sm lg:text-lg">
                <td className="text-center border border-black p-2 lg:p-3">{campeonato.torneo}</td>
                <td className="text-center border border-black p-2 lg:p-3">{campeonato.club}</td>
                <td className="text-center border border-black p-2 lg:p-3">{campeonato.categoria}</td>
                <td className="text-center border border-black p-2 lg:p-3">{campeonato.partidos}</td>
                <td className="text-center border border-black p-2 lg:p-3">{campeonato.hora}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden mt-6">
        <div className="bg-blue-600 text-white text-center py-3 px-4 rounded shadow-md mb-4">
          <h2 className="text-lg font-bold">CAMPEONATO – CAT. {campeonato.categoria}</h2>
          <p className="text-sm">Paramédico: {campeonato.paramedico}</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 space-y-3 text-sm">
            <div>
              <span className="block text-gray-500 text-xs font-medium">CLUB</span>
              <span className="text-gray-900">{campeonato.club}</span>
            </div>
            <div>
              <span className="block text-gray-500 text-xs font-medium">FECHA</span>
              <span className="text-gray-900 font-semibold">{campeonato.torneo}</span>
            </div>
            <div>
              <span className="block text-gray-500 text-xs font-medium">CATEGORÍA</span>
              <span className="text-gray-900">{campeonato.categoria}</span>
            </div>
            <div>
              <span className="block text-gray-500 text-xs font-medium">PARTIDOS</span>
              <span className="text-gray-900">{campeonato.partidos}</span>
            </div>
            <div>
              <span className="block text-gray-500 text-xs font-medium">HORA</span>
              <span className="text-gray-900">{campeonato.hora}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampeonatoTable;