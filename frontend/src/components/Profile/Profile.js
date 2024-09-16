import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import accountLogo from '../images/accountLogo.png';
import account from '../images/account.jpg';
import './profile.css';
import { ipaddress } from '../../demo/domain';

const Profile = () => {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  //const username = localStorage.getItem('username'); 

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`http://${ipaddress}/api/friends/getfriends`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const uniqueFriends = Array.from(new Set(response.data.map(friend => friend._id)))
          .map(id => response.data.find(friend => friend._id === id));
        
        setFriends(uniqueFriends);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(`http://${ipaddress}/api/friends/getrequests`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const uniqueRequests = Array.from(new Set(response.data.map(request => request._id)))
        .map(id => response.data.find(request => request._id === id));
    
        setFriendRequests(uniqueRequests);
      } catch (err) {
        console.error('Error fetching friend requests:', err);
      }
    };
    
    fetchFriends();
    fetchFriendRequests();
  }, [token]);

  const handleAcceptRequest = async (requestId) => {
    try {
      await axios.post(`http://${ipaddress}/api/friends/request/handle`, {
        requesterId: requestId,
        action: 'accept',
      }, { headers: { Authorization: `Bearer ${token}` } });
      setFriendRequests(friendRequests.filter(request => request._id !== requestId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectRequest = async (requesterId) => {
    try {
      await axios.delete(`http://${ipaddress}/api/friends/rejectRequest/${requesterId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.filter(request => request._id !== requesterId));
    } catch (err) {
      console.error('Error rejecting friend request:', err);
    }
  };

  const handleUnfriend = async (friendId) => {
    try {
      await axios.delete(`http://${ipaddress}/api/friends/unfriend/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriends(friends.filter(friend => friend._id !== friendId));
    } catch (err) {
      console.error('Error unfriending:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleRecommendation = () => {
    navigate('/recommendation');
  };

  return (
    <div className='profile-container'>
      <div className='header'>
        <div>
          <img src={accountLogo} alt="Logo" style={{ width: '50px', height: '50px', margin: '7px' }} />
        </div>
        <h2>Profile</h2>
        <button className='logout' onClick={handleLogout}>Logout</button>
        <button className='recommendation' onClick={handleRecommendation}>Recommendations</button>
      </div>
      
      <div className='data-container'>
        <div className='friend-container'>
          <h3>Friends List</h3>
          <ul>
            {friends.length === 0 ? (
              <p>No friends</p>
            ) : (
              friends.map((friend) => (
                <li key={friend._id}>
                  <img src={account} alt="Logo"/>
                  <div className='c1'>
                     <h5>{friend.username}</h5>
                     <div className='btn-container'>
                       <button className='friends-btn' onClick={() => handleUnfriend(friend._id)}>Unfriend</button>
                       <button className='friends-btn'>View Profile</button>
                     </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className='request-container'>
          <h3>Friend Requests</h3>
          <ul>
            {friendRequests.length === 0 ? (
              <p>No friend requests</p>
            ) : (
              friendRequests.map((request) => (
                <li key={request._id}>
                  {request.username}
                  <button onClick={() => handleAcceptRequest(request._id)}>Accept</button>
                  <button onClick={() => handleRejectRequest(request._id)}>Reject</button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
