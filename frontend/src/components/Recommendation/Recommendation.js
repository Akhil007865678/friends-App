import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './recommend.css';
import account from '../images/account.jpg';
import { ipaddress } from '../../demo/domain';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(`http://${ipaddress}/api/friends/recommendations`, {
          headers: { Authorization: `Bearer ${token}` } 
        });
        setRecommendations(response.data); 
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      }
    };

    fetchRecommendations(); 
  }, [token]);

  const handleSendRequest = async (friendId) => {
    try {
      await axios.post(`http://${ipaddress}/api/friends/sendRequest/${friendId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Friend request sent!');
    } catch (err) {
      console.error('Error sending friend request:', err);
    }
  };

  return (
    <div className='first-container'>
      <h2 className='head'>Friend Recommendations</h2>
      {recommendations.length === 0 ? (
        <p>No friend recommendations available at the moment.</p>
      ) : (
        <ul className='users-datas'>
          {recommendations.map((friend) => (
              <li key={friend._id}>
                  <div className='data-child'>
                    <img className='friends-logo' src={account} alt="Logo" />
                    <h3>{friend.username}</h3>
                    <button className='sujjest-btn' onClick={() => handleSendRequest(friend._id)}>Add Friend</button>
                  </div>
              </li>
            
          ))}
        </ul>
      )}
    </div>
  );
};

export default Recommendations;
