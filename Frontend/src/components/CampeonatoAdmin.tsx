import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

interface CampeonatoData {
  _id?: string;
  torneo: string;
  club: string;
  categoria: string;
  partidos: string;
  hora: string;
  habilitado: boolean;
  paramedico?: string;
}


function Campeonato() {
  const [canchas, setCanchas] = useState<{ value: string; label: string }[]>([]);
  const [paramedicos, setParamedicos] = useState<{ value: string; label: string }[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [campeonato, setCampeonato] = useState<CampeonatoData>({
    torneo: '',
    club: '',
    categoria: '',
    partidos: '',
    hora: '',
    habilitado: false
  });

  useEffect(() => {
  const fetchCampeonato = async () => {
    try {
      const response = await axios.get('/api/campeonato');
      if (response.data && response.data.habilitado) {
        setCampeonato(response.data);
        setIsExpanded(true);
      }
    } catch (error) {
      console.log('No hay campeonato activo');
    }
  };

  const fetchParamedicos = async () => {
    try {
      const res = await axios.get('/api/paramedicos');
      setParamedicos(res.data.map((p: any) => ({ value: p._id, label: p.fullname })));
    } catch (err) {
      console.error('Error cargando paramédicos:', err);
    }
  };

  const fetchCanchas = async () => {
    try {
      const res = await axios.get('/api/canchas');
      setCanchas(res.data.map((c: any) => ({ value: c._id, label: c.name })));
    } catch (err) {
      console.error('Error cargando canchas:', err);
    }
  };

  fetchCanchas();
  fetchCampeonato();
  fetchParamedicos();
}, []);


  const handleCheckboxChange = async (checked: boolean) => {
  if (!checked && campeonato._id) {
    try {
      await axios.delete(`/api/campeonato/${campeonato._id}`);
      setIsExpanded(false);
      setCampeonato({
        torneo: '',
        club: '',
        categoria: '',
        partidos: '',
        hora: '',
        habilitado: false,
        paramedico: ''
      });
    } catch (error) {
      console.error('Error al borrar campeonato:', error);
    }
  } else {
    setIsExpanded(true);
  }};


  const handleInputChange = (field: keyof CampeonatoData, value: string) => {
    setCampeonato(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
  try {
    const dataToSave = {
      ...campeonato,
      habilitado: isExpanded
    };

    await axios.post('/api/campeonato', dataToSave);

    console.log('Datos del campeonato guardados:', dataToSave);
    alert('Datos del campeonato guardados correctamente');
  } catch (error) {
    console.error('Error al guardar campeonato:', error);
    alert('Error al guardar los datos del campeonato');
  }};

  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <label className="text-xl font-bold text-gray-800">CAMPEONATO</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => handleCheckboxChange(!isExpanded)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
              isExpanded ? 'bg-amber-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                isExpanded ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <span className={`text-sm font-medium ${isExpanded ? 'text-amber-600' : 'text-gray-500'}`}>
          {isExpanded ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      {isExpanded && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                TORNEO
              </label>
              <input 
                type="date" 
                value={campeonato.torneo} 
                onChange={(e) => handleInputChange('torneo', e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PARAMÉDICO
              </label>
              <Select
                options={paramedicos}
                value={paramedicos.find((p) => p.label === campeonato.paramedico) || null}
                onChange={(label) =>
                  setCampeonato((prev) => ({ ...prev, paramedico: label?.label || '' }))
                }
                isClearable
                placeholder="Seleccionar..."
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CLUB
              </label>
              <Select
                options={canchas}
                value={canchas.find((c) => c.label === campeonato.club) || null}
                onChange={(label) =>
                  setCampeonato((prev) => ({ ...prev, club: label?.label || '' }))
                }
                isClearable
                placeholder="Seleccionar..."
              />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CATEGORÍA
              </label>
              <input
                type="text"
                value={campeonato.categoria}
                onChange={(e) => handleInputChange('categoria', e.target.value)}
                placeholder="Ej: 2016"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Partidos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PARTIDOS
              </label>
              <input
                type="text"
                value={campeonato.partidos}
                onChange={(e) => handleInputChange('partidos', e.target.value)}
                placeholder="Ej: 10 +"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HORA
              </label>
              <input
                type="time"
                value={campeonato.hora}
                onChange={(e) => handleInputChange('hora', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
            >
              Guardar Campeonato
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Campeonato;