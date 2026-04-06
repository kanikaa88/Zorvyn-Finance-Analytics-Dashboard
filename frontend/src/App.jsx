import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
    if (token) {
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    }
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  if (isAuthenticated && currentPage === 'dashboard') {
    return <Dashboard onLogout={handleLogout} darkMode={darkMode} toggleTheme={toggleTheme} />;
  }

  if (currentPage === 'register') {
    return <Register onSwitch={() => setCurrentPage('login')} />;
  }

  return <Login onLogin={handleLogin} onSwitch={() => setCurrentPage('register')} />;
}

export default App;
