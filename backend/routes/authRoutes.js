import express from 'express';
import { login, logout, getCurrentUser, register } from '../controllers/authController.js';
import authenticateUser from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', authenticateUser, logout);
router.get('/me', authenticateUser, getCurrentUser);

export default router;
