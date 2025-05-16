import { createContext, useContext, useState, useEffect } from 'react';
import { setAuthToken, checkTokenExpiration } from '../utils/auth';
import * as authApi from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && checkTokenExpiration()) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (userData) => {
    try {
      const { token, userId, username } = await authApi.login(userData);
      setAuthToken(token);
      setUser({ userId, username });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (userData) => {
    try {
      const { token, userId, username } = await authApi.signup(userData);
      setAuthToken(token);
      setUser({ userId, username });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);