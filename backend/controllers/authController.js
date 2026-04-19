import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import { createJwt } from '../utils/tokenUtils.js';
import { UnauthenticatedError } from '../Error/customError.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) return res.status(401).json({ msg: 'Invalid email or password' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ msg: 'Invalid email or password' });

  if (user.status === 'blocked') {
    return res.status(403).json({ msg: 'Your account is blocked. Contact admin.' });
  }

  const token = createJwt({ userId: user._id, role: user.role });

  res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'None',
  maxAge: 24 * 60 * 60 * 1000,
});

  res.status(StatusCodes.OK).json({
    msg: 'Login successful',
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  if (!user) throw new UnauthenticatedError('User not found');
  res.status(StatusCodes.OK).json({ user });
};

export const logout = async (req, res) => {
  res.cookie('token', '', {
  httpOnly: true,
  secure: true,
  sameSite: 'None',
  expires: new Date(0),
});
  res.status(StatusCodes.OK).json({ msg: 'Logged out successfully' });
};

export const register = async (req, res) => {
  const count = await User.countDocuments();
  const role = count === 0 ? 'admin' : 'user';
  const user = await User.create({ ...req.body, role });
  res.status(StatusCodes.CREATED).json({ msg: 'Account created', user: { name: user.name, email: user.email, role: user.role } });
};
