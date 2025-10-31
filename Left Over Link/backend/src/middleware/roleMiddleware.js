/**
 * Middleware to check if user has one of the required roles.
 * @param {string[]} roles - Array of roles (e.g., ['ADMIN', 'RESTAURANT'])
 */
export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
};