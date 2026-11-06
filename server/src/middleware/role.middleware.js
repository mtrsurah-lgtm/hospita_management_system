const { errorResponse } = require('../utils/response');

/**
 * Role-Based Access Control (RBAC) Middleware
 * @param  {...string} roles - Permitted roles (e.g. 'admin', 'doctor', 'staff', 'patient')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Unauthorized. Please authenticate first.');
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`
      );
    }

    next();
  };
};

module.exports = { authorize };

