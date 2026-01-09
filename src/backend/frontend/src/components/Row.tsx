import Select from 'react-select';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "../adapter"

axios.defaults.baseURL = API_BASE_URL;

interface ParamedicoOption {
  value: string;
  label: string;
}

interface CanchaOption {
  value: string;
  label: string;
}

interface FilaSeleccion {
  paramedico: ParamedicoOption | null;
  cancha: CanchaOption | null;
  cambio: CanchaOption | null;
  hora: string;
}

interface HeaderResponse {
  _id: string;
  encuentro: string;
  fecha: string;
  hora: string;
  nombreDia: string;
}

function Row() {
  const [paramedicos, setParamedicos] = useState<ParamedicoOption[]>([]);
  const [canchas, setCanchas] = useState<CanchaOption[]>([]);
  const [horaDefault, setHoraDefault] = useState<string>('13:00');
  const [selecciones, setSelecciones] = useState<FilaSeleccion[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let horaDelHeader = '13:00';
        try {
          const headerRes = await axios.get<HeaderResponse>('/api/header');
          if (headerRes.data && headerRes.data.hora) {
            horaDelHeader = headerRes.data.hora;
          }
        } catch (headerError) {
          console.log('No se pudo obtener la hora del header, usando 13:00 por defecto');
        }
        setHoraDefault(horaDelHeader);

        const res1 = await axios.get('/api/paramedicos');
        setParamedicos(res1.data.map((p: any) => ({ value: p._id, label: p.fullname })));

        const res2 = await axios.get('/api/canchas');
        const canchasMapped = res2.data.map((c: any) => ({
          value: c._id,
          label: c.name,
        }));
        setCanchas(canchasMapped);

        const guionCancha = canchasMapped.find((c: CanchaOption) => c.label === '-') || null;
        const filasIniciales = Array(11).fill(null).map(() => ({
          paramedico: null,
          cancha: null,
          cambio: guionCancha,
          hora: horaDelHeader 
        }));
        setSelecciones(filasIniciales);

      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selecciones.length > 0) {
      setSelecciones(prevSelecciones => 
        prevSelecciones.map(fila => ({ ...fila, hora: horaDefault }))
      );
    }
  }, [horaDefault]);

  const handleChange = (
    index: number,
    field: 'paramedico' | 'cancha' | 'cambio' | 'hora',
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
      hora: String(fila.hora) || horaDefault
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
      <div className="max-w-6xl mx-auto mb-10">
        {/* Info de la hora por defecto */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border text-center">
          <p className="text-sm text-gray-700">
            Las horas se configuran automáticamente con: <strong>{horaDefault}</strong>
          </p>
        </div>

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

              {index !== 9 && (
                <>
                  <div className='mb-4'>
                    <label className="block text-sm font-medium mb-1">
                      Seleccionar paramédico:
                    </label>
                    <Select
                      options={paramedicos}
                      value={fila.paramedico}
                      onChange={(value) => handleChange(index, "paramedico", value)}
                      isClearable
                      placeholder="Paramédico..."
                      className="w-full"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Cambio de cancha:
                    </label>
                    <Select
                      options={canchas}
                      value={fila.cambio}
                      onChange={(value) => handleChange(index, 'cambio', value)}
                      isClearable
                      placeholder="Cambio..."
                      className="w-full"
                    />
                  </div>
                </>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Hora: 
                </label>
                <input
                  type="time"
                  value={fila.hora}
                  onChange={(e) => handleChange(index, 'hora', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={handleGuardar}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded m-6 font-medium transition-colors max-w-xs w-full mx-auto justify-center flex items-center gap-2"
        >
          💾 Guardar
        </button>
      </div>
    </>
  );
}

export default Row;
