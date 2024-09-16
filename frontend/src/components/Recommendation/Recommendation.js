import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/friends/recommendations', {
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
      await axios.post(`http://localhost:5000/api/friends/sendRequest/${friendId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Friend request sent!');
    } catch (err) {
      console.error('Error sending friend request:', err);
    }
  };

  return (
    <div>
      <h3>Friend Recommendations</h3>
      {recommendations.length === 0 ? (
        <p>No friend recommendations available at the moment.</p>
      ) : (
        <ul>
          {recommendations.map((friend) => (
            <li key={friend._id}>
              {friend.username} 
              <button onClick={() => handleSendRequest(friend._id)}>Send Friend Request</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Recommendations;
