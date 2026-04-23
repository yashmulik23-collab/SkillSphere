import { Link } from 'react-router-dom';

const Home = () => {
  const token = localStorage.getItem('token');

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '6rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', borderRadius: '30px', fontWeight: 'bold', marginBottom: '1.5rem', letterSpacing: '1px' }}>
          WELCOME TO SKILLSPHERE
        </div>
        <h1 className="page-title" style={{ fontSize: '3.5rem', lineHeight: 1.2, marginBottom: '1.5rem' }}>
          Master New Skills. <br />
          <span style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Share Your Expertise.</span>
        </h1>
        <p className="page-subtitle" style={{ fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          The ultimate platform to connect, collaborate, and grow. Whether you want to learn Web Development or teach Music, SkillSphere makes it happen.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {token ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Get Started Free</Link>
              <Link to="/login" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Log In</Link>
            </>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '4rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="text-center" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Everything you need to succeed</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Discover Experts</h3>
            <p style={{ color: 'var(--text-muted)' }}>Search and filter through hundreds of verified skill posts to find the perfect instructor for your needs.</p>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Real-time Chat</h3>
            <p style={{ color: 'var(--text-muted)' }}>Communicate instantly with your students and instructors securely through our built-in messenger.</p>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Book Sessions</h3>
            <p style={{ color: 'var(--text-muted)' }}>Easily schedule learning sessions and keep track of your progress directly from your dashboard.</p>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Build Reputation</h3>
            <p style={{ color: 'var(--text-muted)' }}>Leave and receive reviews after completed sessions to build your trusted profile score.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '3rem 1rem', borderTop: '1px solid var(--border-color)', marginTop: '4rem', color: 'var(--text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} SkillSphere Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
