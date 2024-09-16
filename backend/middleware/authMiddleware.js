const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ msg: 'No authentication token' });

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer YOUR_TOKEN"
  if (!token) return res.status(401).json({ msg: 'No authentication token' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach user info to request
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token verification failed' });
  }
};

module.exports = authMiddleware;
