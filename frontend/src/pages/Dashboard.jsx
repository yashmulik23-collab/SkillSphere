import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    sessionsScheduled: 0,
    sessionsCompleted: 0,
    requestsPending: 0,
    activeChats: 0,
    totalReviews: 0,
    averageRating: 0,
    mySkills: 0
  });
  const [error, setError] = useState('');

  const email = localStorage.getItem('email');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [sessionsRes, reqsRes, chatsRes, reviewsRes, skillsRes] = await Promise.all([
        api.get('/sessions'),
        api.get('/requests/incoming'),
        api.get('/chats'),
        api.get('/reviews/my'),
        api.get('/skills/my')
      ]);

      const sessions = sessionsRes.data;
      const scheduled = sessions.filter(s => s.status === 'SCHEDULED').length;
      const completed = sessions.filter(s => s.status === 'COMPLETED').length;

      const pendingReqs = reqsRes.data.filter(r => r.status === 'PENDING').length;

      const reviews = reviewsRes.data;
      let avgRating = 0;
      if (reviews.length > 0) {
        avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
      }

      setStats({
        sessionsScheduled: scheduled,
        sessionsCompleted: completed,
        requestsPending: pendingReqs,
        activeChats: chatsRes.data.length,
        totalReviews: reviews.length,
        averageRating: avgRating.toFixed(1),
        mySkills: skillsRes.data.length
      });
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        navigate('/login');
      } else {
        setError('Failed to load dashboard data. Ensure backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  if (loading) return <div className="text-center mt-4"><div className="loader"></div></div>;

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="page-subtitle">Welcome back, {email}</p>
        </div>
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      {/* Stats Grid */}
      <div className="dashboard-stats mb-4">
        
        <div className="stat-card">
          <div className="stat-value">{stats.sessionsScheduled}</div>
          <div className="stat-title">Scheduled Sessions</div>
          <Link to="/sessions" className="btn btn-outline" style={{ marginTop: '1.5rem', width: '100%' }}>View Sessions</Link>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{ color: '#fbbf24' }}>{stats.requestsPending}</div>
          <div className="stat-title">Pending Requests</div>
          <Link to="/requests" className="btn btn-outline" style={{ marginTop: '1.5rem', width: '100%' }}>Review Requests</Link>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{ color: '#34d399' }}>{stats.activeChats}</div>
          <div className="stat-title">Active Chats</div>
          <Link to="/chats" className="btn btn-outline" style={{ marginTop: '1.5rem', width: '100%' }}>Open Messages</Link>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{ color: '#a78bfa' }}>{stats.mySkills}</div>
          <div className="stat-title">Posted Skills</div>
          <Link to="/my-skills" className="btn btn-outline" style={{ marginTop: '1.5rem', width: '100%' }}>Manage Skills</Link>
        </div>

      </div>

      {/* Analytics Section */}
      <div style={{ marginTop: '4rem' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem', fontWeight: '700' }}>Analytics & Reputation</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <div className="card">
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Session Completion Rate</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Ratio of scheduled to completed sessions.</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.9rem', fontWeight: '600' }}>
              <span style={{ color: 'var(--primary-color)' }}>Scheduled ({stats.sessionsScheduled})</span>
              <span style={{ color: '#10b981' }}>Completed ({stats.sessionsCompleted})</span>
            </div>
            
            <div style={{ width: '100%', height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', display: 'flex' }}>
              {stats.sessionsScheduled + stats.sessionsCompleted === 0 ? (
                <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)' }}></div>
              ) : (
                <>
                  <div style={{ width: `${(stats.sessionsScheduled / (stats.sessionsScheduled + stats.sessionsCompleted)) * 100}%`, background: 'var(--primary-color)' }}></div>
                  <div style={{ width: `${(stats.sessionsCompleted / (stats.sessionsScheduled + stats.sessionsCompleted)) * 100}%`, background: '#10b981' }}></div>
                </>
              )}
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Trust Score</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Based on {stats.totalReviews} student reviews.</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#fbbf24', lineHeight: 1 }}>
                {stats.averageRating > 0 ? stats.averageRating : 'N/A'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: '600' }}>Rating</span>
                  <span style={{ color: 'var(--text-muted)' }}>{stats.averageRating} / 5.0</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${(stats.averageRating / 5) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #fbbf24, #f59e0b)' }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
