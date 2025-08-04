import { useEffect, useState } from 'react';
import axios from 'axios';

interface TableRow {
  _id: string;
  number: string;
  club: string;
  paramedico: string;
  cambio: string;
  hora: string;
}

function Table() {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/desing');
        setRows(response.data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos de la tabla');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Cargando datos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg text-gray-600">No hay datos guardados para mostrar</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-8">
      <table className="table-auto md:w-2/3 border border-black">
        <thead className="bg-amber-600 text-white text-lg">
          <tr>
            <th className="p-2 border border-black">N°</th>
            <th className="p-2 border border-black">CLUB LOCAL</th>
            <th className="p-2 border border-black">PARAMÉDICO/A</th>
            <th className="p-2 border border-black">CAMBIO DE CANCHA</th>
            <th className="p-2 border border-black">HORA</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id} className="text-lg">
              <td className="text-center border border-black p-2">{row.number}</td>
              <td className="text-center border border-black p-2">{row.club}</td>
              <td className="text-center border border-black p-2">{row.paramedico}</td>
              <td className="text-center border border-black p-2">{row.cambio}</td>
              <td className="text-center border border-black p-2">{row.hora}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;