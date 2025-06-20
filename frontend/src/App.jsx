import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';  
import { Box } from '@mui/material';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/HomePage" />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Box sx={{ pt: 8 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/HomePage" />} />
            <Route path="/HomePage" element={<HomePage />} /> 
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } 
            />
          </Routes>
        </Box>
      </AuthProvider>
    </Router>
  );
};

export default App;
