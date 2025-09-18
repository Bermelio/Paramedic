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
      
      if (row.cambio !== '-') {
        shouldAssignNumber = true;
      }
      
      if (row.hora && row.hora !== horaEstandar && row.hora !== '-') {
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
        if (isInitialLoad) {
          setLoading(true);
        }

        const response = await axios.get('/api/desing');
        const processedRows = processRowsWithChangeNumbers(response.data);
        setRows(processedRows);
        setError(null);
        console.log('Datos cargados en MainTable:', processedRows);
      } catch (err) {
        console.error('Error al cargar datos de la tabla principal:', err);
        if (isInitialLoad) {
          setError('Error al cargar los datos de la tabla');
        }
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        }
      }
    };

    fetchRows(true);
    const interval = setInterval(() => {
      fetchRows(false);
    }, 100000);
    return () => clearInterval(interval);
  }, []);

  const formatearHora = (hora: string): string => {
    if (!hora) return '-';
    return `${hora} hs`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4 sm:p-8">
        <div className="text-base sm:text-lg">Cargando datos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-4 sm:p-8">
        <div className="text-base sm:text-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex justify-center items-center p-4 sm:p-8">
        <div className="text-base sm:text-lg text-gray-600">No hay datos guardados para mostrar</div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}
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
              {rows.map((row, index) => {
                const isLastRow = index === rows.length - 1;
                if (isLastRow) {
                  return (
                    <tr key={row._id} className="text-sm lg:text-lg">
                      <td className="text-center border border-black p-2 lg:p-3">-</td>
                      <td className="text-center border border-black p-2 lg:p-3">{row.club}</td>
                      <td className="text-center border border-black p-2 lg:p-3">-</td>
                      <td className="text-center border border-black p-2 lg:p-3 font-semibold" colSpan={2}>
                        Libre: Confirmado
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={row._id} className="text-sm lg:text-lg">
                    <td className="text-center border border-black p-2 lg:p-3">{row.number}</td>
                    <td className="text-center border border-black p-2 lg:p-3">
                      {row.club}
                      {row.changeNumber && (
                        <span className="text-red-600 ml-1 font-bold">
                          ({row.changeNumber})
                        </span>
                      )}
                    </td>
                    <td className="text-center border border-black p-2 lg:p-3">{row.paramedico}</td>
                    <td className="text-center border border-black p-2 lg:p-3">{row.cambio}</td>
                    <td className="text-center border border-black p-2 lg:p-3">{row.hora}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista móvil */}
      <div className="md:hidden space-y-4">
        <div className="bg-amber-600 text-white text-center py-3 px-4 rounded shadow-md">
          <h2 className="text-lg font-bold">Información de Partidos</h2>
        </div>

        {rows.map((row, index) => {
          const isLastRow = index === rows.length - 1;

          if (isLastRow) {
            return (
              <div
                key={row._id}
                className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden"
              >
                <div className="bg-amber-600 text-white px-4 py-2 font-semibold text-sm">
                  Libre
                </div>
                <div className="p-4 text-center">
                  <div className="text-lg font-bold text-gray-800">{row.club}</div>
                  <div className="text-green-600 font-semibold">Confirmado</div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={row._id}
              className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="bg-amber-600 text-white px-4 py-2 flex justify-between items-center text-sm font-semibold">
                <span>Cancha N° {row.number}</span>
                <span>{formatearHora(row.hora)}</span>
              </div>

              <div className="p-4 space-y-3 text-sm">
                <div>
                  <span className="block text-gray-500 text-xs font-medium">CLUB LOCAL</span>
                  <span className="text-gray-900">
                    {row.club}
                    {row.changeNumber && (
                      <span className="text-red-600 ml-1 font-bold">
                        ({row.changeNumber})
                      </span>
                    )}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500 text-xs font-medium">PARAMÉDICO/A</span>
                  <span className="text-gray-900 font-semibold">{row.paramedico}</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-xs font-medium">CAMBIO DE CANCHA</span>
                  <span className="text-gray-900">{row.cambio || "-"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default MainTable;

//refactor someday...