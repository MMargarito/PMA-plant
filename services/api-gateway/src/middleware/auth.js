const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

/**
 * Extract and verify JWT token from request
 */
const extractUser = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    const token = authHeader.split(' ')[1];
    if (!token) return null;

    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
    );

    return { user: decoded, token };
  } catch (error) {
    logger.debug('Token verification failed:', error.message);
    return null;
  }
};

module.exports = { extractUser };

