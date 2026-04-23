import { useState, useEffect } from 'react';
import api from '../api/axios';

const MySkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', category: '', description: '', level: 'Beginner', price: 'Free', mode: 'Online'
  });

  useEffect(() => {
    fetchMySkills();
  }, []);

  const fetchMySkills = async () => {
    try {
      const res = await api.get('/skills/my');
      setSkills(res.data);
    } catch (err) {
      setError('Failed to load your skills.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openForm = (skill = null) => {
    if (skill) {
      setEditingId(skill.id);
      setFormData({
        title: skill.title, category: skill.category, description: skill.description,
        level: skill.level, price: skill.price, mode: skill.mode
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', category: '', description: '', level: 'Beginner', price: 'Free', mode: 'Online' });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/skills/${editingId}`, formData);
      } else {
        await api.post('/skills', formData);
      }
      fetchMySkills();
      closeForm();
    } catch (err) {
      setError('Failed to save skill.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      fetchMySkills();
    } catch (err) {
      setError('Failed to delete skill.');
    }
  };

  if (loading) return <div className="text-center mt-4"><div className="loader"></div></div>;

  return (
    <div className="my-skills-container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Manage My Skills</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>Create and edit your skill offerings.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openForm()} style={{ padding: '1rem 2rem' }}>+ Post New Skill</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {isFormOpen && (
        <div className="card mb-4 fade-in" style={{ border: '1px solid rgba(129, 140, 248, 0.3)' }}>
          <h2 style={{ marginBottom: '2.5rem', color: '#fff', fontSize: '1.8rem' }}>{editingId ? 'Edit Skill Listing' : 'Create New Skill Listing'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Skill Title</label>
              <input type="text" className="form-input" name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g. Master React and Next.js" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input type="text" className="form-input" name="category" value={formData.category} onChange={handleInputChange} required placeholder="e.g. Web Development" />
              </div>
              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select className="form-input" name="level" value={formData.level} onChange={handleInputChange}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description</label>
              <textarea className="form-input" name="description" value={formData.description} onChange={handleInputChange} required rows="4" placeholder="What will you teach? What are the prerequisites?"></textarea>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              <div className="form-group">
                <label className="form-label">Pricing / Rate</label>
                <input type="text" className="form-input" name="price" value={formData.price} onChange={handleInputChange} placeholder="e.g. Free, $25/hr, or Skill Swap" />
              </div>
              <div className="form-group">
                <label className="form-label">Session Mode</label>
                <select className="form-input" name="mode" value={formData.mode} onChange={handleInputChange}>
                  <option value="Online">Online</option>
                  <option value="In-person">In-person</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
              <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {skills.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.01)' }}>
            <p style={{ color: 'var(--text-muted)' }}>You haven't posted any skills yet. Click "Post New Skill" to get started!</p>
          </div>
        ) : (
          skills.map(skill => (
            <div key={skill.id} className="stat-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '700', margin: 0 }}>{skill.title}</h3>
                <span style={{ background: 'rgba(129, 140, 248, 0.15)', color: '#818cf8', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>
                  {skill.category}
                </span>
              </div>
              
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1, fontSize: '0.95rem', lineHeight: '1.5' }}>{skill.description}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', fontSize: '0.85rem', color: '#fff', marginBottom: '2rem', opacity: 0.8 }}>
                <div><span style={{color: 'var(--text-muted)'}}>Level:</span> {skill.level}</div>
                <div><span style={{color: 'var(--text-muted)'}}>Mode:</span> {skill.mode}</div>
                <div><span style={{color: 'var(--text-muted)'}}>Price:</span> {skill.price}</div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => openForm(skill)}>Edit</button>
                <button className="btn btn-primary" style={{ flex: 1, background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)' }} onClick={() => handleDelete(skill.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MySkills;
