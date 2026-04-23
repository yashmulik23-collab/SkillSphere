import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('role') !== 'ROLE_ADMIN') {
      navigate('/dashboard');
      return;
    }
    fetchAdminData();
  }, [navigate]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, skillsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/skills')
      ]);
      setUsers(usersRes.data);
      setSkills(skillsRes.data);
    } catch (err) {
      setError('Failed to load admin data. Access denied or server error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This may cause issues if they have existing sessions or chats.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user. They might be tied to existing records.');
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill post?')) return;
    try {
      await api.delete(`/admin/skills/${id}`);
      setSkills(skills.filter(s => s.id !== id));
    } catch (err) {
      alert('Failed to delete skill.');
    }
  };

  if (loading) return <div className="text-center mt-4"><div className="loader"></div></div>;

  return (
    <div className="admin-container fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="text-center mb-4">
        <h1 className="page-title" style={{ background: 'linear-gradient(to right, #f87171, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Admin Control Center</h1>
        <p className="page-subtitle">Platform moderation and user management.</p>
      </div>
      
      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '14px' }}>
        <button 
          className="btn"
          style={{ 
            flex: 1, 
            background: activeTab === 'users' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'transparent',
            color: '#fff',
            borderRadius: '10px'
          }}
          onClick={() => setActiveTab('users')}
        >
          Users Registry ({users.length})
        </button>
        <button 
          className="btn"
          style={{ 
            flex: 1, 
            background: activeTab === 'skills' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'transparent',
            color: '#fff',
            borderRadius: '10px'
          }}
          onClick={() => setActiveTab('skills')}
        >
          Skill Marketplace ({skills.length})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'users' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {users.length === 0 ? <p className="text-center" style={{color: 'var(--text-muted)'}}>No users found.</p> : users.map(user => (
              <div key={user.id} className="stat-card fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.8rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.2rem', fontWeight: '700' }}>{user.name}</h3>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Role: <span style={{ fontWeight: '700', color: user.role === 'ROLE_ADMIN' ? '#f87171' : '#818cf8' }}>{user.role}</span></div>
                </div>
                {user.role !== 'ROLE_ADMIN' && (
                  <button className="btn btn-outline" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }} onClick={() => handleDeleteUser(user.id)}>
                    Delete User
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'skills' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {skills.length === 0 ? <p className="text-center" style={{color: 'var(--text-muted)'}}>No skill posts found.</p> : skills.map(skill => (
              <div key={skill.id} className="stat-card fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.8rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.2rem', fontWeight: '700' }}>{skill.title}</h3>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Category: <span style={{color: '#818cf8'}}>{skill.category}</span></div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Instructor: {skill.user?.name} ({skill.user?.email})</div>
                </div>
                <button className="btn btn-outline" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }} onClick={() => handleDeleteSkill(skill.id)}>
                  Remove Post
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
