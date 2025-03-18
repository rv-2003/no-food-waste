const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Middleware to check user role
exports.checkRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ msg: 'Access denied' });
  }
  next();
};