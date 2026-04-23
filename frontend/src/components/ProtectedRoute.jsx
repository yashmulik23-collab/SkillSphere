import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // If there is no token, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child components
  return children;
};

export default ProtectedRoute;
