import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      navigate('/home');
    } catch (err) { 
      setError(err.response?.data?.msg || 'Invalid credentials');
    }
  };

  return (
    <div className='container'>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
         <form onSubmit={handleLogin}>
           <div className='child-container'>
            <input
              type="text"
              placeholder=" Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
           </div>
           
           <div className='child-container'>
            <input
              type="password"
              placeholder=" Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
           </div>
           <button type="submit">Login</button>
           <p>If you don't have an account? <a href="/register">Register</a></p>
         </form>
    </div>
  );
};

export default Login;
