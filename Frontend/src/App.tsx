import './App.css'
import NavBar from './components/NavBar.tsx'
import Header from './components/Header.tsx'
import Table from './components/Table.tsx'
import Torneo from './components/Torneo.tsx'

function App() {

  return (
    <>
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <Header />
      <Table />
      <Torneo />
    </div>
    </>
  );
}

export default App
