import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

interface ParamedicoOption {
  value: string;
  label: string; 
}

function Admin() {
  const navigate = useNavigate();
  const [paramedicos, setParamedicos] = useState<ParamedicoOption[]>([]);
  const [selectedParamedico, setSelectedParamedico] = useState<ParamedicoOption | null>(null);

  const handleLogout = () => {
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  useEffect(() => {
    const fetchParamedicos = async () => {
      try {
        const response = await axios.get('/api/paramedicos');
        const opciones = response.data.map((paramedico: any) => ({
          value: paramedico._id,
          label: paramedico.fullname,
        }));
        setParamedicos(opciones);
      } catch (error) {
        console.error('Error al cargar paramédicos:', error);
      }
    };

    fetchParamedicos();
  }, []);

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">Panel de Administración</h1>
        <p className="text-gray-600">Bienvenido al panel de administración.</p>
        <p className="text-gray-600 mb-4">Aquí puedes gestionar los paramédicos y las canchas.</p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Seleccionar paramédico:</label>
          <Select
            options={paramedicos}
            value={selectedParamedico}
            onChange={setSelectedParamedico}
            isClearable
            isSearchable
            placeholder="Paramédico..."
          />
        </div>


        <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
          Cerrar Sesión
        </button>
      </div>
    </>
  );
}
export default Admin;