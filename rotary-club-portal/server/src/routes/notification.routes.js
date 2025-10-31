import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
  getNotificationStats,
} from '../controllers/notification.controller.js';

const router = express.Router();

router.use(protect);

// Get notifications
router.get('/', getMyNotifications);
router.get('/stats', getNotificationStats);

// Mark as read
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);

// Delete notifications
router.delete('/clear-read', deleteAllRead);
router.delete('/:id', deleteNotification);

export default router;
