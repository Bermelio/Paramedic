import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Clock from "./Clock";

function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/auth/verify',
          { withCredentials: true }
        );
        setIsAuthenticated(response.data.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleIconClick = () => {
    if (isAuthenticated) {
      navigate('/admin');
    } else {
      navigate('/login');
    }
  };

  const handleMenuClick = () => {
    navigate('/login');
  };

  return (
    <>
      <div className="flex justify-between items-center gap-2 sm:gap-4 lg:gap-10 bg-amber-600 text-white p-3 sm:p-4 shadow-lg">
        
        <button onClick={handleIconClick} className="cursor-pointer pl-4">
          <img 
            className="size-12 sm:size-16 lg:size-20" 
            src="/icon.png" 
            alt="icon main" 
          />
        </button>
        
        <div className="flex-1 text-center">
          <a href="/">
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
             Campeonato Nacional de Baby Fútbol · 49ª Edición
            </h1>
          </a>
        </div>
        
        <button 
          onClick={handleMenuClick}
          className="flex items-center justify-center cursor-pointer pr-4"
        >
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ffffff"
          >
            <path
              d="M4 6H20M4 12H20M4 18H20"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="flex justify-center sm:justify-end p-2 sm:p-3 sm:mr-4 lg:mr-10">
        <Clock/>
      </div>
    </>
  );
}

export default NavBar;
