import { useNavigate } from 'react-router-dom';

function Admin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div>
      <h1>Panel de Administración</h1>
      <button onClick={handleLogout} className="bg-red-500 text-white p-2">
        Cerrar Sesión
      </button>
    </div>
  );
}
export default Admin;