import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  if (isAuthenticated && currentPage === 'dashboard') {
    return <Dashboard onLogout={handleLogout} />;
  }

  if (currentPage === 'register') {
    return <Register onSwitch={() => setCurrentPage('login')} />;
  }

  return <Login onLogin={handleLogin} onSwitch={() => setCurrentPage('register')} />;
}

export default App;
