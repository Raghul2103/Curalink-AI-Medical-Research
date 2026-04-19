import { verifyJWT } from '../utils/tokenUtils.js';
import { UnauthorizedError } from '../Error/customError.js';

const authenticateUser = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) throw new UnauthorizedError('Not authorized');
    const decoded = verifyJWT(token);
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    throw new UnauthorizedError('Authentication invalid');
  }
};

export default authenticateUser;
