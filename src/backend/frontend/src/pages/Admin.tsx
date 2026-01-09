import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Row from '../components/Row.tsx';
import Campeonato from '../components/CampeonatoAdmin.tsx';
import HeaderFecha from '../components/HeaderFecha.tsx'
import { API_BASE_URL } from "../adapter"

function Admin() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      navigate('/login');
      window.location.reload();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      navigate('/login');
    }
  };

  return (
    <>
      <div className='flex justify-end pr-12'>
        <button onClick={handleLogout} className="bg-red-500 text-white p-2 mt-2 rounded">
          Cerrar Sesión
          </button>
      </div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2 pl-5">Panel de Administración</h1>

        <HeaderFecha />

        <Row/>

        <Campeonato />
        
      </div>

    </>
  );
}

export default Admin;