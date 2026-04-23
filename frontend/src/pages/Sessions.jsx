import { useState, useEffect } from 'react';
import api from '../api/axios';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Review Modal State
  const [reviewModal, setReviewModal] = useState({ isOpen: false, reviewee: null });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewStatus, setReviewStatus] = useState({ loading: false, error: '', success: '' });

  const myEmail = localStorage.getItem('email');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/sessions');
      setSessions(res.data);
    } catch (err) {
      setError('Failed to load sessions.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, action) => {
    try {
      await api.put(`/sessions/${id}/${action}`);
      fetchSessions();
    } catch (err) {
      alert(`Failed to ${action} session`);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewStatus({ loading: true, error: '', success: '' });
    try {
      await api.post('/reviews', {
        revieweeId: reviewModal.reviewee.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      setReviewStatus({ loading: false, error: '', success: 'Review submitted successfully!' });
      setTimeout(() => {
        setReviewModal({ isOpen: false, reviewee: null });
        setReviewForm({ rating: 5, comment: '' });
        setReviewStatus({ loading: false, error: '', success: '' });
      }, 1500);
    } catch (err) {
      setReviewStatus({ loading: false, error: err.response?.data || 'Failed to submit review', success: '' });
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'SCHEDULED': return { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' };
      case 'COMPLETED': return { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981' };
      case 'CANCELLED': return { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' };
      default: return { bg: 'rgba(156, 163, 175, 0.2)', text: '#9ca3af' };
    }
  };

  if (loading) return <div className="text-center mt-4"><div className="loader"></div></div>;

  return (
    <div className="sessions-container fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="text-center mb-4">
        <h1 className="page-title">Session Manager</h1>
        <p className="page-subtitle">Track your learning journey and session history.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="sessions-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {sessions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.01)' }}>
            <p style={{ color: 'var(--text-muted)' }}>No sessions found. Book a session from the Explore page to get started!</p>
          </div>
        ) : (
          sessions.map(session => {
            const isInstructor = session.instructor.email === myEmail;
            const otherPerson = isInstructor ? session.student : session.instructor;
            const colors = getStatusColor(session.status);

            return (
              <div key={session.id} className="stat-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1rem' }}>
                    <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>{session.skill.title}</h3>
                    <span style={{ 
                      background: colors.bg, 
                      color: colors.text, 
                      padding: '0.3rem 0.8rem', 
                      borderRadius: '20px', 
                      fontSize: '0.75rem', 
                      fontWeight: '700',
                      letterSpacing: '0.5px'
                    }}>
                      {session.status}
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{isInstructor ? 'Collaborating with Student:' : 'Learning from Instructor:'}</span>
                    <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '600', margin: '0.2rem 0 0 0' }}>{otherPerson.name}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{otherPerson.email}</p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '2rem', color: '#fff', fontSize: '0.9rem', opacity: 0.8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      {session.sessionDate}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {session.sessionTime}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  {session.status === 'SCHEDULED' && (
                    <>
                      <button className="btn btn-primary" onClick={() => handleUpdateStatus(session.id, 'complete')}>Mark Completed</button>
                      <button className="btn btn-outline" style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#ef4444' }} onClick={() => handleUpdateStatus(session.id, 'cancel')}>Cancel</button>
                    </>
                  )}

                  {session.status === 'COMPLETED' && (
                    <button className="btn btn-outline" onClick={() => setReviewModal({ isOpen: true, reviewee: otherPerson })}>Leave Feedback</button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {reviewModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: '450px', border: '1px solid rgba(129, 140, 248, 0.3)' }}>
            <h2 style={{ marginBottom: '0.5rem', color: '#fff', fontSize: '1.8rem' }}>Rate {reviewModal.reviewee.name}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Your feedback helps maintain our community trust score.</p>
            
            {reviewStatus.error && <div className="alert alert-error">{reviewStatus.error}</div>}
            {reviewStatus.success && <div className="alert alert-success">{reviewStatus.success}</div>}

            <form onSubmit={handleSubmitReview}>
              <div className="form-group" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '1rem' }}>Select Star Rating</label>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', fontSize: '2.5rem', cursor: 'pointer' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span 
                      key={star} 
                      onClick={() => setReviewForm({...reviewForm, rating: star})}
                      style={{ color: star <= reviewForm.rating ? '#fbbf24' : 'rgba(255,255,255,0.1)', transition: 'transform 0.2s' }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Written Feedback</label>
                <textarea 
                  className="form-input" 
                  rows="4" 
                  placeholder="Share your experience learning with them..." 
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                  required
                ></textarea>
              </div>
              
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={reviewStatus.loading}>
                  {reviewStatus.loading ? <div className="loader"></div> : 'Submit Feedback'}
                </button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setReviewModal({ isOpen: false, reviewee: null })}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sessions;
