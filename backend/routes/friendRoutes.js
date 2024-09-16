const express = require('express');
const { searchUsers, sendFriendRequest, getFriendRequests,getAllUsers, rejectFriendRequest, handleFriendRequest, getFriends, unfriend, getRecommendations } = require('../controllers/friendController');
const authMiddleware = require('../middleware/authMiddleware');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/search', auth, searchUsers);
router.get('/getrequests', authMiddleware, getFriendRequests);
router.get('/getfriends', authMiddleware, getFriends);
router.post('/request', auth, sendFriendRequest);
router.delete('/unfriend/:friendId', authMiddleware, unfriend);
router.get('/recommendations', authMiddleware, getRecommendations);
router.post('/request/handle', authMiddleware, handleFriendRequest);
router.delete('/rejectRequest/:requesterId', authMiddleware, rejectFriendRequest);
router.get('/users', authMiddleware, getAllUsers);

module.exports = router;
