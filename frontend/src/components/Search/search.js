import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './search.css';
import account from '../images/account.jpg';
import { ipaddress } from '../../demo/domain';

const SearchResults = () => {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://${ipaddress}/api/friends/search?query=${query}`, {
          headers: { Authorization: token }
        });
        setResults(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query, token]);

  const sendFriendRequest = async (userId) => {
    try {
      await axios.post(`http://${ipaddress}/api/friends/request`, { userId }, {
        headers: { Authorization: token }
      });
      alert('Friend request sent');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Search Results for "{query}"</h3>
      <img className='logo1' src={account} alt="Logo" />
      <ul className='search'>
        {results.map((user) => (
          <li key={user._id}>
            {user.username}
            <button onClick={() => sendFriendRequest(user._id)}>Add Friend</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
