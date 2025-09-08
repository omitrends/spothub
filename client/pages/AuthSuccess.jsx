// client/pages/AuthSuccess.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userJson = params.get('user');

    if (token && userJson) {
      const user = JSON.parse(decodeURIComponent(userJson));
      login(token, user);
      localStorage.setItem("authToken", token); // corrected key

      // Redirect based on role
      navigate(user.role === 'admin' ? '/admin' : '/');
    } else {
      navigate('/'); // fallback to home
    }
  }, [navigate, login]);

  return <div>Logging you in...</div>;
};

export default AuthSuccess;
