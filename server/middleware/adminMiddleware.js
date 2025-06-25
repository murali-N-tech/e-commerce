// server/middleware/adminMiddleware.js
function admin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as admin');
  }
}
module.exports = { admin };
