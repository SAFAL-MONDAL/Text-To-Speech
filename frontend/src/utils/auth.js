import { jwtDecode } from 'jwt-decode';

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const checkTokenExpiration = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const decoded = jwtDecode(token);
  return decoded.exp > Date.now() / 1000;
};