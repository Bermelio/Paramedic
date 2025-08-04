import { useNavigate } from 'react-router-dom';
import Row from '../components/row.tsx';

function Admin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <>
      <div className='flex justify-end pr-12'>
        <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
        Cerrar Sesión
        </button>
      </div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2 pl-5">Panel de Administración</h1>

        <Row/>

      </div>
    </>
  );
}
export default Admin; 