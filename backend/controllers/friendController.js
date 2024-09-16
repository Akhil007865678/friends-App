const User = require('../models/User');

const searchUsers = async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({ username: new RegExp(query, 'i') }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const sendFriendRequest = async (req, res) => {
  const { userId } = req.body;
  const requesterId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (user.friendRequests.includes(requesterId)) return res.status(400).json({ msg: 'Request already sent' });

    user.friendRequests.push(requesterId);
    await user.save();
    res.json({ msg: 'Friend request sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFriendRequests = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).populate('friendRequests', 'username');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user.friendRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFriends = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).populate('friends', 'username');
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const unfriend = async (req, res) => {
  const userId = req.user.id;
  const friendId = req.params.friendId;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      friendId,
      { $pull: { friends: userId } }, 
      { new: true }
    );

    res.json({ msg: 'Friend removed successfully', userFriends: user.friends });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleFriendRequest = async (req, res) => {
  const { requesterId, action } = req.body;
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    if (!requester || !user) return res.status(404).json({ msg: 'User not found' });

    if (action === 'accept') {
      user.friends.push(requesterId);
      requester.friends.push(userId);
    }

    user.friendRequests = user.friendRequests.filter(req => req.toString() !== requesterId);
    await user.save();
    await requester.save();

    res.json({ msg: 'Friend request handled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const rejectFriendRequest = async (req, res) => {
  const userId = req.user.id;
  const requesterId = req.params.requesterId;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { friendRequests: requesterId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ msg: 'Friend request rejected successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRecommendations = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).populate('friends');
    const friendsOfFriends = new Set();

    user.friends.forEach(friend => {
      friend.friends.forEach(fof => {
        if (fof.toString() !== userId && !user.friends.includes(fof)) {
          friendsOfFriends.add(fof.toString());
        }
      });
    });

    const recommendations = await User.find({ _id: { $in: Array.from(friendsOfFriends) } }).select('-password');
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { searchUsers, sendFriendRequest, getAllUsers, rejectFriendRequest, handleFriendRequest, getFriends, unfriend, getFriendRequests, getRecommendations };
