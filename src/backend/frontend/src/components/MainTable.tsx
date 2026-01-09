import { useEffect, useState } from 'react';
import axios from 'axios';

interface TableRow {
  _id: string;
  number: string;
  club: string;
  paramedico: string;
  cambio: string;
  hora: string;
  changeNumber?: number;
}

function MainTable() {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const processRowsWithChangeNumbers = (originalRows: TableRow[]) => {
    let changeCounter = 1;
    const horaCounts: { [key: string]: number } = {};
    
    originalRows.forEach(row => {
      if (row.hora && row.hora !== '-') {
        horaCounts[row.hora] = (horaCounts[row.hora] || 0) + 1;
      }
    });
    
    const horaEstandar = Object.keys(horaCounts).reduce((a, b) => 
      horaCounts[a] > horaCounts[b] ? a : b, Object.keys(horaCounts)[0] || '13:00'
    );
    
    return originalRows.map(row => {
      let shouldAssignNumber = false;
      if (row.cambio !== '-' || (row.hora && row.hora !== horaEstandar && row.hora !== '-')) {
        shouldAssignNumber = true;
      }
      return {
        ...row,
        changeNumber: shouldAssignNumber ? changeCounter++ : undefined
      };
    });
  };

  useEffect(() => {
    const fetchRows = async (isInitialLoad = true) => {
      try {
        if (isInitialLoad) setLoading(true);
        const response = await axios.get('/api/desing');
        const processedRows = processRowsWithChangeNumbers(response.data);
        setRows(processedRows);
        setError(null);
      } catch (err) {
        if (isInitialLoad) setError('Error al cargar los datos');
      } finally {
        if (isInitialLoad) setLoading(false);
      }
    };

    fetchRows(true);
    const interval = setInterval(() => fetchRows(false), 100000);
    return () => clearInterval(interval);
  }, []);

  const formatearHora = (hora: string): string => {
    if (!hora || hora === '-') return '-';
    return `${hora} hs`;
  };

  if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (rows.length === 0) return <div className="p-8 text-center text-gray-600">No hay datos</div>;

  return (
    <>
      {/* Vista Desktop - Sin condiciones especiales de última fila */}
      <div className="hidden md:flex md:justify-center">
        <div className="w-full max-w-6xl overflow-x-auto">
          <table className="w-full border border-black">
            <thead className="bg-amber-600 text-white text-sm lg:text-lg">
              <tr>
                <th className="p-2 lg:p-3 border border-black">N°</th>
                <th className="p-2 lg:p-3 border border-black">CLUB LOCAL</th>
                <th className="p-2 lg:p-3 border border-black">PARAMÉDICO/A</th>
                <th className="p-2 lg:p-3 border border-black">CAMBIO DE CANCHA</th>
                <th className="p-2 lg:p-3 border border-black">HORA</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._id} className="text-sm lg:text-lg">
                  <td className="text-center border border-black p-2 lg:p-3">{row.number || '-'}</td>
                  <td className="text-center border border-black p-2 lg:p-3">
                    {row.club}
                    {row.changeNumber && (
                      <span className="text-red-600 ml-1 font-bold">({row.changeNumber})</span>
                    )}
                  </td>
                  <td className="text-center border border-black p-2 lg:p-3">{row.paramedico || '-'}</td>
                  <td className="text-center border border-black p-2 lg:p-3">{row.cambio || '-'}</td>
                  <td className="text-center border border-black p-2 lg:p-3">{formatearHora(row.hora)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista Móvil - Sin condiciones especiales de última fila */}
      <div className="md:hidden space-y-4">
        <div className="bg-amber-600 text-white text-center py-3 px-4 rounded shadow-md">
          <h2 className="text-lg font-bold">Información de Partidos</h2>
        </div>

        {rows.map((row) => (
          <div key={row._id} className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-amber-600 text-white px-4 py-2 flex justify-between items-center text-sm font-semibold">
              <span>Cancha N° {row.number || '-'}</span>
              <span>{formatearHora(row.hora)}</span>
            </div>

            <div className="p-4 space-y-3 text-sm">
              <div>
                <span className="block text-gray-500 text-xs font-medium">CLUB LOCAL</span>
                <span className="text-gray-900 font-bold">
                  {row.club}
                  {row.changeNumber && (
                    <span className="text-red-600 ml-1">({row.changeNumber})</span>
                  )}
                </span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs font-medium">PARAMÉDICO/A</span>
                <span className="text-gray-900 font-semibold">{row.paramedico || "-"}</span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs font-medium">CAMBIO DE CANCHA</span>
                <span className="text-gray-900">{row.cambio || "-"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default MainTable;
