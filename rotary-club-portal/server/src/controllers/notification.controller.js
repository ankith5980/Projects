import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getIO } from '../services/socket.service.js';

// @desc    Get my notifications
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Build filter
  const filter = { recipient: req.user.member };

  if (req.query.isRead !== undefined) {
    filter.isRead = req.query.isRead === 'true';
  }

  if (req.query.type) {
    filter.type = req.query.type;
  }

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments(filter);
  const unreadCount = await Notification.countDocuments({
    recipient: req.user.member,
    isRead: false,
  });

  res.json({
    success: true,
    data: {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    },
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user.member,
  });

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found',
    });
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  // Emit socket event
  const io = getIO();
  io.to(req.user.member.toString()).emit('notification:read', {
    notificationId: notification._id,
  });

  res.json({
    success: true,
    message: 'Notification marked as read',
    data: notification,
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await Notification.updateMany(
    {
      recipient: req.user.member,
      isRead: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    }
  );

  // Emit socket event
  const io = getIO();
  io.to(req.user.member.toString()).emit('notification:allRead', {
    count: result.modifiedCount,
  });

  res.json({
    success: true,
    message: `${result.modifiedCount} notifications marked as read`,
    data: { count: result.modifiedCount },
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user.member,
  });

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found',
    });
  }

  await notification.deleteOne();

  res.json({
    success: true,
    message: 'Notification deleted successfully',
  });
});

// @desc    Delete all read notifications
// @route   DELETE /api/notifications/clear-read
// @access  Private
export const deleteAllRead = asyncHandler(async (req, res) => {
  const result = await Notification.deleteMany({
    recipient: req.user.member,
    isRead: true,
  });

  res.json({
    success: true,
    message: `${result.deletedCount} notifications deleted`,
    data: { count: result.deletedCount },
  });
});

// @desc    Get notification statistics
// @route   GET /api/notifications/stats
// @access  Private
export const getNotificationStats = asyncHandler(async (req, res) => {
  const stats = await Notification.aggregate([
    {
      $match: { recipient: req.user.member },
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        unread: {
          $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] },
        },
      },
    },
  ]);

  const total = await Notification.countDocuments({ recipient: req.user.member });
  const unread = await Notification.countDocuments({
    recipient: req.user.member,
    isRead: false,
  });

  res.json({
    success: true,
    data: {
      total,
      unread,
      byType: stats,
    },
  });
});
