import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Registration Error:', err);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || 'Registration failed. Please check if your backend is running.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container card fade-in">
      <h2 className="text-center mb-4" style={{ fontSize: '2.5rem', color: '#fff', fontWeight: '800' }}>Join SkillSphere</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input 
            type="text" 
            className="form-input" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            placeholder="Your full name"
          />
        </div>

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
            placeholder="Create a strong password"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input 
            type="password" 
            className="form-input" 
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
            placeholder="Repeat your password"
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? <div className="loader"></div> : 'Create Account'}
        </button>
      </form>

      <p className="text-center mt-4" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Login here</Link>
      </p>
    </div>
  );
};

export default Register;
