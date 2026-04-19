import express from 'express';
import {
  sendMessage,
  getConversations,
  getConversationById,
  deleteConversation,
} from '../controllers/chatController.js';
import authenticateUser from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser);
router.post('/send', sendMessage);
router.get('/history', getConversations);
router.get('/:id', getConversationById);
router.delete('/:id', deleteConversation);

export default router;
