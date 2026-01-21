import express from 'express';
import {
    getConversations,
    getMessages,
    sendMessage,
    getUnreadCount,
    markAsRead,
    clearChat
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All message routes are protected

router.get('/conversations', getConversations);
router.get('/unread/count', getUnreadCount);
router.get('/:userId', getMessages);
router.post('/', sendMessage);
router.put('/read/:userId', markAsRead);
router.delete('/clear/:userId', clearChat);

export default router;
