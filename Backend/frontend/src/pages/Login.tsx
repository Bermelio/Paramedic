import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  setIsAuthenticated: (auth: boolean) => void;
}

function Login({ setIsAuthenticated }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      console.log("Respuesta completa:", response);

      setMensaje(response.data.message || "Login exitoso");
      setIsAuthenticated(true);
      navigate('/admin');

    } catch (error: any) {
      console.error("Error en login:", error);
      setMensaje(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="flex justify-center items-center pt-40">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white w-2xs p-6 rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button type="submit" className="p-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition">
          Ingresar
        </button>
        {mensaje && <p className="text-center text-red-500">{mensaje}</p>}
      </form>
    </div>
  );
}

export default Login;