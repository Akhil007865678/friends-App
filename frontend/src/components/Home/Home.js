import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import accountLogo from '../images/accountLogo.png';
import account from '../images/account.jpg';
import Recommendations from '../Recommendation/Recommendation';
import './home.css';
import { jwtDecode } from 'jwt-decode';
import { ipaddress } from '../../demo/domain';


const Home = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  
  let userId = 0;
  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.id;
    console.log('User ID from JWT:', userId);
  }
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
      const response = await axios.get(`http://${ipaddress}/api/friends/users`, {
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
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const sendFriendRequest = async (userId) => { 
    try {
      await axios.post(`http://${ipaddress}/api/friends/request`, { userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Friend request sent');
    } catch (err) {
      console.error(err);
    }
  };

  const goToChat = (userId) => {
    navigate(`/chat/${userId}`);
  };

  const filteredUsers = users.filter(user => user._id !== userId);
  console.log(userId);

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
          <img src={accountLogo} alt="Logo" />
        </div>
        <button className='logout1' onClick={handleLogout}>Logout</button>
      </div>

      <div className='both-container'>
        <div className='user-list-container'>
          <h2 className='all-user'>All Users</h2>
          <ul style={{ listStyleType: 'none' }}>
            {filteredUsers.length === 0 ? (
              <p>No users found</p>
            ) : (
              filteredUsers.map((user) => (
                <li className='user-data' key={user._id}>
                  <img className='friends-logo' src={account} alt="Logo" />
                  <div className='child-data'>
                    <h3>{user.username}</h3>
                    <div>
                      <button className='user-btn' onClick={goToChat}>View Profile</button>
                      <button className='user-btn' onClick={() => sendFriendRequest(user._id)}>Add Friend</button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className='right-child'><Recommendations/></div>
      </div>
    </div>
  );
};

export default Home;
