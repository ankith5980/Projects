import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sendEmail, emailTemplates } from '../utils/email.js';
import { emitToUser } from './socket.service.js';
import { logger } from '../config/logger.js';

export const sendNotification = async (notificationData) => {
  try {
    // Create notification in database
    const notification = await Notification.create(notificationData);

    // Send real-time notification via Socket.IO
    if (notificationData.channel.includes('in_app')) {
      emitToUser(notificationData.recipient, 'notification', {
        type: 'new_notification',
        notification: notification,
      });
    }

    // Send email notification
    if (notificationData.channel.includes('email')) {
      const user = await User.findById(notificationData.recipient);
      if (user && user.email) {
        const emailResult = await sendEmail({
          to: user.email,
          subject: notificationData.title,
          html: `
            <h2>${notificationData.title}</h2>
            <p>${notificationData.message}</p>
            ${
              notificationData.actionUrl
                ? `<p><a href="${process.env.CLIENT_URL}${notificationData.actionUrl}" style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">${notificationData.actionText || 'View'}</a></p>`
                : ''
            }
          `,
        });

        // Update notification status
        notification.status.email.sent = emailResult.success;
        notification.status.email.sentAt = new Date();
        if (!emailResult.success) {
          notification.status.email.error = emailResult.error;
        }
        await notification.save();
      }
    }

    // TODO: Implement push notifications
    // if (notificationData.channel.includes('push')) {
    //   await sendPushNotification(notificationData);
    // }

    logger.info(`Notification sent to user ${notificationData.recipient}`);
    return notification;
  } catch (error) {
    logger.error('Error sending notification:', error);
    throw error;
  }
};

export const sendBulkNotification = async (recipients, notificationData) => {
  const results = [];

  for (const recipientId of recipients) {
    try {
      const notification = await sendNotification({
        ...notificationData,
        recipient: recipientId,
      });
      results.push({ success: true, recipientId, notificationId: notification._id });
    } catch (error) {
      results.push({ success: false, recipientId, error: error.message });
    }
  }

  return results;
};

export const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    throw new Error('Notification not found');
  }

  return await notification.markAsRead();
};

export const markAllNotificationsAsRead = async (userId) => {
  return await Notification.updateMany(
    { recipient: userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
};

export const getUnreadCount = async (userId) => {
  return await Notification.getUnreadCount(userId);
};
