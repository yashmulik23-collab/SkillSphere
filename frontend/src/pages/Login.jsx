import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('role', response.data.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container card fade-in">
      <h2 className="text-center mb-4" style={{ fontSize: '2.5rem', color: '#fff', fontWeight: '800' }}>Welcome Back</h2>
      
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input 
            type="email" 
            className="form-input" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            placeholder="Enter your email"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-input" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? <div className="loader"></div> : 'Login'}
        </button>
      </form>

      <p className="text-center mt-4" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
