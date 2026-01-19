// Authentication middleware to protect routes
const authMiddleware = (req, res, next) => {
  if (req.session && req.session.user) {
    // User is authenticated
    next();
  } else {
    // User is not authenticated
    res.status(401).json({ 
      success: false, 
      message: 'Unauthorized. Please login first.' 
    });
  }
};

module.exports = authMiddleware;
