import { useEffect, useState } from 'react';
import axios from 'axios';

interface HeaderData {
  encuentro: string;
  fecha: string;
  hora: string;
  nombreDia?: string;
  _id?: string;
}

interface HeaderResponse {
  _id: string;
  encuentro: string;
  fecha: string;
  hora: string;
  nombreDia: string;
}

interface CreateUpdateResponse {
  message: string;
  data: HeaderResponse;
}

function HeaderFecha() {
  const [headerData, setHeaderData] = useState<HeaderData>({
    encuentro: '',
    fecha: '',
    hora: '',
    nombreDia: ''
  });

  // here was Claude
  const obtenerNombreDia = (fecha: string): string => {
    if (!fecha) return '';
    
    const diasSemana = [
      'domingo', 'lunes', 'martes', 'miércoles', 
      'jueves', 'viernes', 'sábado'
    ];
    
    const fechaObj = new Date(fecha + 'T00:00:00');
    return diasSemana[fechaObj.getDay()];
  };
  // love u

  useEffect(() => { 
    const fetchHeaderData = async () => {
      try {
        const response = await axios.get<HeaderResponse>('/api/header');
        if (response.data) {
          setHeaderData(response.data);
        }
      } catch (error) {
        console.error('Error fetching header data:', error);
      }
    };
    
    fetchHeaderData();
  }, []);
  
  const handleClick = async () => {
    try { 
      const dataToSave = {
        encuentro: headerData.encuentro || '',
        fecha: headerData.fecha || '',
        hora: headerData.hora || '',
        nombreDia: obtenerNombreDia(headerData.fecha || '')
      };

      if (!dataToSave.encuentro || !dataToSave.fecha || !dataToSave.hora) {
        alert('Por favor completa todos los campos');
        return;
      }

      if (headerData._id) {
        const response = await axios.put<CreateUpdateResponse>(`/api/header/${headerData._id}`, dataToSave);
        alert("Datos actualizados correctamente");
      } else {
        const response = await axios.post<CreateUpdateResponse>('/api/header', dataToSave);
        alert("Datos guardados correctamente");
        
        setHeaderData(prev => ({ ...prev, _id: response.data.data._id }));
      }

    } catch (error) {
      console.error('Error al guardar header:', error);
      alert('Error al guardar los datos');
    }
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-6">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-3">
      
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Encuentro n°</label>
            <input
              type="text"
              value={headerData.encuentro}
              onChange={(e) => setHeaderData(prev => ({ ...prev, encuentro: e.target.value }))}
              placeholder="Ej: 1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              value={headerData.fecha}
              onChange={(e) => setHeaderData(prev => ({ ...prev, fecha: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
            <input
              type="time"
              value={headerData.hora}
              onChange={(e) => setHeaderData(prev => ({ ...prev, hora: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" 
            />
          </div>

          <div className="flex items-end justify-center align-middle">
            <button
              className="bg-green-600 hover:bg-green-700 rounded align-middle flex items-center justify-center text-2xl shadow-md hover:shadow-lg transition-all duration-200 w-20 h-12 text-white"
              onClick={handleClick}
            >
              ✔
            </button>
          </div>
        </div>
        
        {headerData.fecha && (
          <div className="mt-2 text-sm text-gray-600">
            Día: <strong>{obtenerNombreDia(headerData.fecha)}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeaderFecha;



