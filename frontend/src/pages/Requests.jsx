import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Requests = () => {
  const [activeTab, setActiveTab] = useState('incoming');
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Booking Modal State
  const [bookingModal, setBookingModal] = useState({ isOpen: false, request: null, date: '', time: '' });
  const [bookingStatus, setBookingStatus] = useState({ loading: false, error: '', success: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [incRes, outRes] = await Promise.all([
        api.get('/requests/incoming'),
        api.get('/requests/outgoing')
      ]);
      setIncoming(incRes.data);
      setOutgoing(outRes.data);
    } catch (err) {
      setError('Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, action) => {
    try {
      await api.put(`/requests/${id}/${action}`);
      fetchRequests();
    } catch (err) {
      alert('Failed to update request status');
    }
  };

  const handleStartChat = async (otherUserId) => {
    try {
      await api.post(`/chats/with/${otherUserId}`);
      navigate('/chats');
    } catch (err) {
      alert('Failed to start chat');
    }
  };

  const handleBookSession = async (e) => {
    e.preventDefault();
    setBookingStatus({ loading: true, error: '', success: '' });
    try {
      await api.post('/sessions/book', {
        skillId: bookingModal.request.skill.id,
        instructorId: bookingModal.request.receiver.id,
        sessionDate: bookingModal.date,
        sessionTime: bookingModal.time + ':00' // append seconds for LocalTime
      });
      setBookingStatus({ loading: false, error: '', success: 'Session booked successfully!' });
      setTimeout(() => {
        setBookingModal({ isOpen: false, request: null, date: '', time: '' });
        setBookingStatus({ loading: false, error: '', success: '' });
        navigate('/sessions');
      }, 1500);
    } catch (err) {
      setBookingStatus({ loading: false, error: err.response?.data || 'Failed to book session', success: '' });
    }
  };

  if (loading) return <div className="text-center mt-4"><div className="loader"></div></div>;

  return (
    <div className="requests-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="page-title text-center mb-4">Connection Requests</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button 
          className={`btn ${activeTab === 'incoming' ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: 1 }}
          onClick={() => setActiveTab('incoming')}
        >
          Incoming Requests ({incoming.length})
        </button>
        <button 
          className={`btn ${activeTab === 'outgoing' ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: 1 }}
          onClick={() => setActiveTab('outgoing')}
        >
          Outgoing Requests ({outgoing.length})
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="requests-list">
        {activeTab === 'incoming' && (
          incoming.length === 0 ? <p className="text-center text-muted">No incoming requests.</p> :
          incoming.map(req => (
            <div key={req.id} className="card mb-4" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ color: 'var(--primary-color)', margin: 0 }}>{req.skill?.title}</h3>
                <span style={{ 
                  background: req.status === 'PENDING' ? 'rgba(234, 179, 8, 0.2)' : req.status === 'ACCEPTED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', 
                  color: req.status === 'PENDING' ? '#eab308' : req.status === 'ACCEPTED' ? '#10b981' : '#ef4444', 
                  padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' 
                }}>
                  {req.status}
                </span>
              </div>
              <p><strong>From:</strong> {req.sender?.name} ({req.sender?.email})</p>
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--primary-color)' }}>
                <em>"{req.message}"</em>
              </div>
              
              {req.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button className="btn btn-primary" onClick={() => handleStatusUpdate(req.id, 'accept')}>Accept</button>
                  <button className="btn btn-outline" style={{ borderColor: 'var(--error-color)', color: 'var(--error-color)' }} onClick={() => handleStatusUpdate(req.id, 'reject')}>Reject</button>
                </div>
              )}

              {req.status === 'ACCEPTED' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <button className="btn btn-primary" onClick={() => handleStartChat(req.sender.id)}>Message {req.sender.name}</button>
                </div>
              )}
            </div>
          ))
        )}

        {activeTab === 'outgoing' && (
          outgoing.length === 0 ? <p className="text-center text-muted">No outgoing requests.</p> :
          outgoing.map(req => (
            <div key={req.id} className="card mb-4" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ color: 'var(--primary-color)', margin: 0 }}>{req.skill?.title}</h3>
                <span style={{ 
                  background: req.status === 'PENDING' ? 'rgba(234, 179, 8, 0.2)' : req.status === 'ACCEPTED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', 
                  color: req.status === 'PENDING' ? '#eab308' : req.status === 'ACCEPTED' ? '#10b981' : '#ef4444', 
                  padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' 
                }}>
                  {req.status}
                </span>
              </div>
              <p><strong>To Instructor:</strong> {req.receiver?.name} ({req.receiver?.email})</p>
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--primary-color)' }}>
                <em>"{req.message}"</em>
              </div>

              {req.status === 'ACCEPTED' && (
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-primary" onClick={() => handleStartChat(req.receiver.id)}>Message Instructor</button>
                  <button className="btn btn-outline" style={{ borderColor: '#10b981', color: '#10b981' }} onClick={() => setBookingModal({ isOpen: true, request: req, date: '', time: '' })}>Book Session</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {bookingModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '90%', maxWidth: '400px' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Book a Session</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>with {bookingModal.request.receiver.name} for {bookingModal.request.skill.title}</p>
            
            {bookingStatus.error && <div className="alert alert-error">{bookingStatus.error}</div>}
            {bookingStatus.success && <div className="alert alert-success">{bookingStatus.success}</div>}

            <form onSubmit={handleBookSession}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" required value={bookingModal.date} onChange={(e) => setBookingModal({...bookingModal, date: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <input type="time" className="form-input" required value={bookingModal.time} onChange={(e) => setBookingModal({...bookingModal, time: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary" disabled={bookingStatus.loading}>
                  {bookingStatus.loading ? 'Booking...' : 'Confirm Booking'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setBookingModal({ isOpen: false, request: null, date: '', time: '' })}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
