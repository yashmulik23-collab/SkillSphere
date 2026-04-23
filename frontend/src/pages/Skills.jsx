import { useState, useEffect } from 'react';
import api from '../api/axios';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and filter states
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [price, setPrice] = useState('');
  
  // Request Modal State
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [message, setMessage] = useState('');
  const [requestStatus, setRequestStatus] = useState({ loading: false, error: '', success: '' });

  useEffect(() => {
    fetchSkills();
  }, [category, level, price]); // Re-fetch when dropdowns change

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (category) params.append('category', category);
      if (level) params.append('level', level);
      if (price) params.append('price', price);

      const res = await api.get(`/skills/search?${params.toString()}`);
      setSkills(res.data);
    } catch (err) {
      setError('Failed to load skills.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSkills();
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setRequestStatus({ loading: true, error: '', success: '' });
    try {
      await api.post('/requests/send', {
        skillId: selectedSkill.id,
        message: message
      });
      setRequestStatus({ loading: false, error: '', success: 'Request sent successfully!' });
      setTimeout(() => {
        setSelectedSkill(null);
        setMessage('');
        setRequestStatus({ loading: false, error: '', success: '' });
      }, 2000);
    } catch (err) {
      setRequestStatus({ 
        loading: false, 
        error: err.response?.data || 'Failed to send request.', 
        success: '' 
      });
    }
  };

  if (loading && skills.length === 0) return <div className="text-center mt-4"><div className="loader"></div></div>;

  return (
    <div className="skills-container fade-in">
      <div className="text-center mb-4">
        <h1 className="page-title">Explore Skills</h1>
        <p className="page-subtitle">Find experts to learn from or collaborate with.</p>
      </div>

      <div className="card mb-4" style={{ padding: '2rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by title or description..." 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div className="form-group mb-1">
              <label className="form-label">Category</label>
              <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="Web Development">Web Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Music">Music</option>
                <option value="Language">Language</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group mb-1">
              <label className="form-label">Level</label>
              <select className="form-input" value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="form-group mb-1">
              <label className="form-label">Price</label>
              <select className="form-input" value={price} onChange={(e) => setPrice(e.target.value)}>
                <option value="">Any Price</option>
                <option value="Free">Free</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {skills.length === 0 ? (
          <p className="text-center" style={{ gridColumn: '1 / -1', color: 'var(--text-muted)', marginTop: '2rem' }}>No skills found matching your search.</p>
        ) : (
          skills.map(skill => (
            <div key={skill.id} className="stat-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '700', margin: 0 }}>{skill.title}</h3>
                <span style={{ background: 'rgba(129, 140, 248, 0.15)', color: '#818cf8', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>
                  {skill.category}
                </span>
              </div>
              
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1, fontSize: '0.95rem', lineHeight: '1.5' }}>{skill.description}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', fontSize: '0.85rem', color: '#fff', marginBottom: '1.5rem', opacity: 0.8 }}>
                <div><span style={{color: 'var(--text-muted)'}}>Level:</span> {skill.level}</div>
                <div><span style={{color: 'var(--text-muted)'}}>Mode:</span> {skill.mode}</div>
                <div><span style={{color: 'var(--text-muted)'}}>Price:</span> {skill.price}</div>
                <div><span style={{color: 'var(--text-muted)'}}>By:</span> {skill.user?.name}</div>
              </div>
              
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }} onClick={() => setSelectedSkill(skill)}>Contact Instructor</button>
            </div>
          ))
        )}
      </div>

      {selectedSkill && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: '500px', border: '1px solid rgba(129, 140, 248, 0.3)' }}>
            <h2 style={{ marginBottom: '0.5rem', color: '#fff', fontSize: '1.8rem' }}>Learn from {selectedSkill.user?.name}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Skill: <span style={{color: '#818cf8', fontWeight: '600'}}>{selectedSkill.title}</span></p>
            
            {requestStatus.error && <div className="alert alert-error">{requestStatus.error}</div>}
            {requestStatus.success && <div className="alert alert-success">{requestStatus.success}</div>}

            <form onSubmit={handleSendRequest}>
              <div className="form-group">
                <label className="form-label">Introduce Yourself</label>
                <textarea 
                  className="form-input" 
                  rows="4" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi, I'm interested in learning this skill. I am available on..."
                  required
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={requestStatus.loading}>
                  {requestStatus.loading ? 'Sending...' : 'Send Request'}
                </button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => {
                  setSelectedSkill(null);
                  setMessage('');
                  setRequestStatus({ loading: false, error: '', success: '' });
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
