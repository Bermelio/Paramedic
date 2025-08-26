import './App.css';
import NavBar from './components/NavBar.tsx';
import Header from './components/Header.tsx';
import Table from './pages/Table.tsx';
import Torneo from './components/Torneo.tsx';
import Login from './pages/Login.tsx';
import Admin from './pages/Admin.tsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/auth/verify',
          { withCredentials: true }
        );
        setIsAuthenticated(response.data.authenticated);
      } catch (error) {
        console.log('No autenticado');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Table />
                  <Torneo />
                </>
              }
            />
            <Route 
              path="/login" 
              element={<Login setIsAuthenticated={setIsAuthenticated} />} 
            />
            <Route
              path="/admin"
              element={
                isAuthenticated ? (
                  <Admin />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;