const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  // Note: Your frontend is sending 'Authorization: Bearer <token>'
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload to request object
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};