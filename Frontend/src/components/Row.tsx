import Select from 'react-select';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface ParamedicoOption {
  value: string;
  label: string;
}
interface CanchaOption {
  value: string;
  label: string;
}

function Row() {
  const [paramedicos, setParamedicos] = useState<ParamedicoOption[]>([]);
  const [canchas, setCanchas] = useState<CanchaOption[]>([]);

  const [selecciones, setSelecciones] = useState<
    { paramedico: ParamedicoOption | null; cancha: CanchaOption | null; cambio: CanchaOption | null }[]
  >(Array(10).fill({ paramedico: null, cancha: null, cambio: null }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await axios.get('/api/paramedicos');
        setParamedicos(res1.data.map((p: any) => ({ value: p._id, label: p.fullname })));

        const res2 = await axios.get('/api/canchas');
        const canchasMapped = res2.data.map((c: any) => ({
          value: c._id,
          label: c.name,
        }));
        setCanchas(canchasMapped);

        const guionCancha = canchasMapped.find((c: { label: string; }) => c.label === '-') || null;
        const filasConGuion = Array(10).fill(null).map(() => ({
          paramedico: null,
          cancha: null,
          cambio: guionCancha,
        }));
        setSelecciones(filasConGuion);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    index: number,
    field: 'paramedico' | 'cancha' | 'cambio',
    value: any
  ) => {
    const nuevasSelecciones = [...selecciones];
    nuevasSelecciones[index] = { ...nuevasSelecciones[index], [field]: value };
    setSelecciones(nuevasSelecciones);
  };

  const handleGuardar = async () => {
    try {
      const datosAEnviar = selecciones.map((fila) => ({
        paramedicoId: fila.paramedico?.value || '-',
        canchaId: fila.cancha?.value || '-',
        cambioId: fila.cambio?.value || '-',
      }));

      console.log('Enviando datos:', datosAEnviar);
      const res = await axios.post('/api/desing', datosAEnviar);
      console.log('Guardado exitosamente:', res.data);
      alert('¡Guardado correctamente! La tabla ha sido actualizada con las 10 filas.');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Ocurrió un error al guardar. Por favor, intenta nuevamente.');
    }
  };

  return (
    <>
      {/* <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-bold text-blue-800 mb-2">📋 Configuración de Paramédicos</h3>
        <p className="text-blue-700 text-sm">
          Configura las 10 filas de la tabla. Al guardar, se reemplazarán todos los datos anteriores.
        </p>
      </div> */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-col justify-center md:flex-row flex-wrap gap-4">
          {selecciones.map((fila, index) => (
            <div
              key={index}
              className="border border-gray-300 p-4 rounded md:max-w-xs md:w-full flex-shrink-0"
            >
              <h2 className="font-bold mb-2">{index === 9 ? "Cancha libre" : `Fila ${index+1}`}</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Seleccionar cancha:</label>
                <Select
                  options={canchas}
                  value={fila.cancha}
                  onChange={(value) => handleChange(index, 'cancha', value)}
                  isClearable
                  placeholder="Cancha..."
                  className="w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Seleccionar paramédico:</label>
                <Select
                  options={paramedicos}
                  value={fila.paramedico}
                  onChange={(value) => handleChange(index, 'paramedico', value)}
                  isClearable
                  placeholder="Paramédico..."
                  className="w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Cambio de cancha:</label>
                <Select
                  options={canchas}
                  value={fila.cambio}
                  onChange={(value) => handleChange(index, 'cambio', value)}
                  isClearable
                  placeholder="Cambio..."
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>
      <button
        onClick={handleGuardar}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded m-6 font-medium transition-colors max-w-xs w-full mx-auto justify-center flex items-center gap-2 "
      >
        💾 Guardar
      </button>
      </div>


    </>
  );
}

export default Row;