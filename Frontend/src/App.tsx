import './App.css'
import NavBar from './components/NavBar.tsx'
import Header from './components/Header.tsx'
import Table from './components/Table.tsx'
import Torneo from './components/Torneo.tsx'
import Login from './pages/Login.tsx'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Admin from './pages/Admin.tsx'
import { Navigate } from 'react-router-dom'

function App() {

  return (
    <>
    <div className="min-h-screen bg-gray-100">
      <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<>
          <Header />
          <Table />
          <Torneo />
        </>} />
        <Route path="/login" element={<Login />} />
        <Route 
            path="/admin" 
            element={
              localStorage.getItem('isAuthenticated') ? (
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

export default App
