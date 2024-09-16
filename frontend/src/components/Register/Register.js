import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ipaddress } from '../../demo/domain';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://${ipaddress}/api/auth/register`, { username, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className='container'>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <div className='child-container'>
           <input
             type="text"
             placeholder="Username"
             value={username}
             onChange={(e) => setUsername(e.target.value)}
             required
           />
        </div>

        <div className='child-container'>
           <input
             type="password"
             placeholder="Password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
           />
        </div>
        <button type="submit">Register</button>
        <p>If you have an account? <a href="/login">Login</a></p>
      </form>
    </div>
  );
};

export default Register;
