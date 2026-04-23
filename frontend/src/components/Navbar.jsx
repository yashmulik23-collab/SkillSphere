import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">SkillSphere</Link>
      <div className="nav-links">
        {token ? (
          <>
            {localStorage.getItem('role') === 'ROLE_ADMIN' && (
              <Link to="/admin" className="nav-link" style={{ color: '#ef4444', fontWeight: 'bold' }}>Admin Panel</Link>
            )}
            <Link to="/skills" className="nav-link">Explore</Link>
            <Link to="/my-skills" className="nav-link">My Skills</Link>
            <Link to="/requests" className="nav-link">Requests</Link>
            <Link to="/chats" className="nav-link">Chats</Link>
            <Link to="/sessions" className="nav-link">Sessions</Link>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <span className="nav-link" style={{color: 'var(--text-muted)'}}>Hi, {email}</span>
            <button onClick={handleLogout} className="btn btn-outline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
