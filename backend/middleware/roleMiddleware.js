import { UnauthorizedError } from '../Error/customError.js';

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('Not authorized for this action');
    }
    next();
  };
};

export default authorizeRoles;
