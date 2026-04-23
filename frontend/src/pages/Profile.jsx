import { useState, useEffect } from 'react';
import api from '../api/axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: '',
    experience: '',
    links: '',
    education: '',
    availability: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const profileRes = await api.get('/user/profile');
      setProfile(profileRes.data);
      setFormData({
        name: profileRes.data.name || '',
        bio: profileRes.data.bio || '',
        skills: profileRes.data.skills || '',
        experience: profileRes.data.experience || '',
        links: profileRes.data.links || '',
        education: profileRes.data.education || '',
        availability: profileRes.data.availability || ''
      });

      const reviewsRes = await api.get('/reviews/my');
      setReviews(reviewsRes.data);
      if (reviewsRes.data.length > 0) {
        const sum = reviewsRes.data.reduce((acc, curr) => acc + curr.rating, 0);
        setAverageRating((sum / reviewsRes.data.length).toFixed(1));
      }
    } catch (err) {
      setError('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await api.put('/user/profile', formData);
      setProfile(res.data);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-4"><div className="loader"></div></div>;

  return (
    <div className="profile-container fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="text-center mb-4">
        <h1 className="page-title">User Profile</h1>
        <p className="page-subtitle">Manage your personal information and skill portfolio.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        {!isEditing ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <div>
                <h2 style={{ color: '#fff', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 0.8rem 0' }}>{profile.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span style={{ color: '#fbbf24', fontSize: '1.4rem' }}>★</span>
                  <strong style={{ fontSize: '1.2rem', color: '#fff' }}>{averageRating > 0 ? averageRating : 'N/A'}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>({reviews.length} reviews received)</span>
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
              <div className="stat-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                <strong style={{ color: '#818cf8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Account Information</strong>
                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Email Address</label>
                  <p style={{ color: '#fff', fontSize: '1.1rem' }}>{profile.email}</p>
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Bio</label>
                  <p style={{ color: '#fff', fontSize: '1rem', lineHeight: '1.5' }}>{profile.bio || 'No bio provided yet.'}</p>
                </div>
              </div>

              <div className="stat-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                <strong style={{ color: '#818cf8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Expertise & Experience</strong>
                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Skills</label>
                  <p style={{ color: '#fff', fontSize: '1rem' }}>{profile.skills || 'Not specified'}</p>
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Experience</label>
                  <p style={{ color: '#fff', fontSize: '1rem' }}>{profile.experience || 'Not specified'}</p>
                </div>
              </div>

              <div className="stat-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                <strong style={{ color: '#818cf8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Background</strong>
                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Education</label>
                  <p style={{ color: '#fff', fontSize: '1rem' }}>{profile.education || 'Not specified'}</p>
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Links</label>
                  <p style={{ color: '#818cf8', fontSize: '1rem' }}>{profile.links || 'No links added'}</p>
                </div>
              </div>

              <div className="stat-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                <strong style={{ color: '#818cf8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Availability</strong>
                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Status</label>
                  <p style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: '600' }}>{profile.availability || 'Available'}</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '4rem' }}>
              <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '700' }}>Recent Reviews</h3>
              {reviews.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.01)' }}>
                  <p style={{ color: 'var(--text-muted)' }}>You haven't received any reviews yet. Complete sessions to build your reputation!</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {reviews.map(review => (
                    <div key={review.id} className="stat-card" style={{ padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <strong style={{ color: '#fff' }}>{review.reviewer.name}</strong>
                        <span style={{ color: '#fbbf24' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="fade-in">
            <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem', color: '#fff' }}>Edit Your Profile</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Email (View Only)</label>
                <input type="text" className="form-input" value={profile.email} disabled style={{ opacity: 0.5 }} />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Bio</label>
                <textarea className="form-input" name="bio" value={formData.bio} onChange={handleInputChange} rows="3" placeholder="Tell us about yourself and your passions..."></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Expertise / Skills</label>
                <input type="text" className="form-input" name="skills" value={formData.skills} onChange={handleInputChange} placeholder="e.g. React, Java, UI/UX" />
              </div>

              <div className="form-group">
                <label className="form-label">Professional Experience</label>
                <input type="text" className="form-input" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="Years of experience or key roles" />
              </div>

              <div className="form-group">
                <label className="form-label">Education / Certs</label>
                <input type="text" className="form-input" name="education" value={formData.education} onChange={handleInputChange} placeholder="Degrees or certifications" />
              </div>

              <div className="form-group">
                <label className="form-label">Portfolio / Social Links</label>
                <input type="text" className="form-input" name="links" value={formData.links} onChange={handleInputChange} placeholder="Links to your work" />
              </div>

              <div className="form-group">
                <label className="form-label">Availability Status</label>
                <input type="text" className="form-input" name="availability" value={formData.availability} onChange={handleInputChange} placeholder="e.g. Weekends only, Evenings, Open to all" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                {saving ? <div className="loader"></div> : 'Update Profile'}
              </button>
              <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsEditing(false)} disabled={saving}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
