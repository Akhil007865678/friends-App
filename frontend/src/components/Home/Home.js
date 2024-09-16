import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import accountLogo from '../images/accountLogo.png';
import './home.css';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/friends/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, [token]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${query}`);
    }
  };
  const handleClick = () => {
    navigate('/profile');
  }
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <div className='home-container'>
        <h2>Home</h2>

        <div className='search-container'>
          <form onSubmit={handleSearch}>
            <input
              className='search-box'
              type="text"
              placeholder="Search Users"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>
        <div className='image' onClick={handleClick}>
          <img src={accountLogo} alt="Logo" style={{ width: '50px', height: '50px', margin: '7px' }} />
        </div>
        <button className='logout' onClick={handleLogout}>Logout</button>
      </div>

      <div className='user-list-container'>
        <h3>All Users</h3>
        <ul style={{ listStyleType: 'none' }}>
          {users.length === 0 ? (
            <p>No users found</p>
          ) : (
            users.map((user) => (
              <li key={user._id}>
                {user.username}
                <button onClick={() => navigate(`/profile/${user._id}`)}>View Profile</button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Home;
