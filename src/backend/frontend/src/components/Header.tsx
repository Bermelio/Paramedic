import { useEffect, useState } from "react";
import { API_BASE_URL } from "../adapter"

interface HeaderData {
  _id?: string;
  encuentro: string;
  fecha: string;
  hora: string;
  nombreDia: string;
}

function Header() {
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatearFecha = (fecha: string): string => {
    if (!fecha) return '';
    
    const fechaObj = new Date(fecha + 'T00:00:00');
    const opciones: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    
    return fechaObj.toLocaleDateString('es-ES', opciones);
  };

  const formatearHora = (hora: string): string => {
    if (!hora) return '';
    return `${hora} hs`;
  };

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/header`);
        
        if (!response.ok) {
          throw new Error('Data header no encontrada');
        }
        
        const data = await response.json();
        setHeaderData(data);
        setError(null);
        
      } catch (error) {
        console.error('Error fetching header data:', error);
        setError('No se pudo cargar la información del header');
        setHeaderData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHeaderData();
  }, []);

  if (loading) {
    return (
      <header className="text-balance p-4 m-4 bg-white shadow-lg rounded-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </header>
    );
  }

  if (error) {
    return (
      <header className="text-balance p-4 m-4 bg-white shadow-lg rounded-lg border-l-4 border-yellow-400">
        <h2 className="text-center text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-3">
          Comisión de Baby Fútbol San Francisco
        </h2>
        <p className="text-yellow-600 text-center">
          {error}
        </p>
      </header>
    );
  }

  return (
    <header className="text-balance p-4 m-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-center text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-3">
        Comisión de Baby Fútbol San Francisco
      </h2>

      {headerData ? (
        <>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            Se informan las designaciones para la <strong>Fecha Nº {headerData.encuentro}</strong>, 
            a disputarse el <strong>{headerData.nombreDia} {formatearFecha(headerData.fecha)} a las {formatearHora(headerData.hora)}</strong>.
          </p>

          <p className="mt-2 text-gray-700 text-sm sm:text-base leading-relaxed">
            A continuación, se detallan las asignaciones de cobertura de los paramédicos/as.
          </p>
        </>
      ) : (
        <p className="text-gray-500 text-center">
          No hay información de encuentro disponible. 
          <br />
          Por favor, configura los datos del encuentro primero.
        </p>
      )}
    </header>
  );
}

export default Header;