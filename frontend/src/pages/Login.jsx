import { useState } from 'react';
import { authAPI } from '../services/api';

function Login({ onLogin, onSwitch }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    { role: 'Admin', email: 'admin@demo.com', password: 'admin123', icon: '👑', color: '#ff6b6b' },
    { role: 'Analyst', email: 'analyst@demo.com', password: 'analyst123', icon: '📊', color: '#4ecdc4' },
    { role: 'Viewer', email: 'viewer@demo.com', password: 'viewer123', icon: '👁️', color: '#ffc371' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('token', response.data.data.token);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (email, password) => {
    setFormData({ email, password });
    // Auto-submit after a brief moment
    setTimeout(() => {
      document.getElementById('login-form').requestSubmit();
    }, 100);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Welcome Back</h1>
        
        {/* Demo Accounts Section */}
        <div className="demo-accounts">
          <div className="demo-header">
            <span className="demo-badge">🚀 Quick Demo Access</span>
          </div>
          <div className="demo-grid">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                className="demo-account-btn"
                onClick={() => handleDemoLogin(account.email, account.password)}
                style={{ borderColor: account.color }}
                type="button"
              >
                <span className="demo-icon" style={{ color: account.color }}>
                  {account.icon}
                </span>
                <div className="demo-info">
                  <div className="demo-role">{account.role}</div>
                  <div className="demo-email">{account.email}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="divider">
          <span>or login manually</span>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <form id="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-switch">
          Don't have an account?{' '}
          <button onClick={onSwitch}>Register</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
