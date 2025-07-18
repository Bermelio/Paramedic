import './App.css';
import NavBar from './components/NavBar.tsx';
import Header from './components/Header.tsx';
import Table from './components/Table.tsx';
import Torneo from './components/Torneo.tsx';
import Login from './pages/Login.tsx';
import Admin from './pages/Admin.tsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

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
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
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
