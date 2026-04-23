import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Skills from './pages/Skills';
import MySkills from './pages/MySkills';
import Requests from './pages/Requests';
import Chats from './pages/Chats';
import Sessions from './pages/Sessions';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/skills" 
              element={
                <ProtectedRoute>
                  <Skills />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-skills" 
              element={
                <ProtectedRoute>
                  <MySkills />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/requests" 
              element={
                <ProtectedRoute>
                  <Requests />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chats" 
              element={
                <ProtectedRoute>
                  <Chats />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sessions" 
              element={
                <ProtectedRoute>
                  <Sessions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
