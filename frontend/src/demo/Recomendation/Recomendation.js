import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Recommendations = ({ token }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/friends/recommendations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecommendations(response.data);
      } catch (err) {
        console.error(err.response.data);
      }
    };

    fetchRecommendations();
  }, [token]);

  return (
    <div>
      <h2>Friend Recommendations</h2>
      <ul>
        {recommendations.map(user => (
          <li key={user._id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
