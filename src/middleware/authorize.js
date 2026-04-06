const { hasPermission } = require('../config/roles');
const { AppError } = require('../utils/errorHandler');

// Policy-based authorization middleware
const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const userRole = req.user.role;

    // Check if user has at least one of the required permissions
    const hasRequiredPermission = requiredPermissions.some(permission => 
      hasPermission(userRole, permission)
    );

    if (!hasRequiredPermission) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

module.exports = { authorize };
