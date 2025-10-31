import cron from 'node-cron';
import { logger } from '../config/logger.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';
import Member from '../models/Member.js';
import User from '../models/User.js';
import { sendEmail, emailTemplates } from '../utils/email.js';
import { sendNotification } from './notification.service.js';
import { cleanupOrphanedFiles } from './upload.service.js';

export const initializeCronJobs = () => {
  // Run payment reminders every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    logger.info('Running payment reminder cron job');
    try {
      await sendPaymentReminders();
    } catch (error) {
      logger.error('Error in payment reminder cron job:', error);
    }
  });

  // Run overdue payment notifications every day at 10:00 AM
  cron.schedule('0 10 * * *', async () => {
    logger.info('Running overdue payment notification cron job');
    try {
      await sendOverduePaymentNotifications();
    } catch (error) {
      logger.error('Error in overdue payment notification cron job:', error);
    }
  });

  // Send birthday wishes at 8:00 AM daily
  cron.schedule('0 8 * * *', async () => {
    logger.info('Running birthday wishes cron job');
    try {
      await sendBirthdayWishes();
    } catch (error) {
      logger.error('Error in birthday wishes cron job:', error);
    }
  });

  // Send anniversary wishes at 8:00 AM daily
  cron.schedule('0 8 * * *', async () => {
    logger.info('Running anniversary wishes cron job');
    try {
      await sendAnniversaryWishes();
    } catch (error) {
      logger.error('Error in anniversary wishes cron job:', error);
    }
  });

  // Clean up old notifications every week on Sunday at 2:00 AM
  cron.schedule('0 2 * * 0', async () => {
    logger.info('Running notification cleanup cron job');
    try {
      const result = await Notification.deleteOldNotifications(90);
      logger.info(`Deleted ${result.deletedCount} old notifications`);
    } catch (error) {
      logger.error('Error in notification cleanup cron job:', error);
    }
  });

  // Clean up orphaned uploaded files every week on Sunday at 3:00 AM
  cron.schedule('0 3 * * 0', async () => {
    logger.info('Running file cleanup cron job');
    try {
      const result = await cleanupOrphanedFiles(30); // Delete files older than 30 days
      if (result.success) {
        logger.info(`Deleted ${result.deletedCount} orphaned files`);
      } else {
        logger.error('Error in file cleanup:', result.error);
      }
    } catch (error) {
      logger.error('Error in file cleanup cron job:', error);
    }
  });

  logger.info('All cron jobs initialized successfully');
};

// Send payment reminders for upcoming due dates
const sendPaymentReminders = async () => {
  const today = new Date();
  const reminderDays = [7, 3, 1]; // Send reminders 7, 3, and 1 days before due date

  for (const days of reminderDays) {
    const reminderDate = new Date();
    reminderDate.setDate(today.getDate() + days);
    reminderDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(reminderDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Find pending payments due on the reminder date
    const payments = await Payment.find({
      status: 'pending',
      dueDate: {
        $gte: reminderDate,
        $lt: nextDay,
      },
      $or: [{ remindersSent: { $lt: 3 } }, { remindersSent: { $exists: false } }],
    }).populate('member');

    for (const payment of payments) {
      try {
        const member = payment.member;
        if (!member || !member.user) continue;

        // Get user email
        const user = await User.findById(member.user);
        if (!user || !user.email) continue;

        // Send email
        const paymentUrl = `${process.env.CLIENT_URL}/payments/${payment._id}`;
        const dueDate = payment.dueDate.toLocaleDateString('en-IN');
        const emailContent = emailTemplates.paymentReminder(
          member.fullName,
          payment.amount,
          dueDate,
          paymentUrl
        );

        await sendEmail({
          to: user.email,
          ...emailContent,
        });

        // Send in-app notification
        await sendNotification({
          recipient: user._id,
          type: 'payment_reminder',
          title: 'Payment Reminder',
          message: `Your payment of ₹${payment.amount} is due on ${dueDate}`,
          priority: days === 1 ? 'high' : 'medium',
          channel: ['in_app', 'email'],
          actionUrl: `/payments/${payment._id}`,
          actionText: 'Pay Now',
          relatedEntity: {
            entityType: 'payment',
            entityId: payment._id,
          },
        });

        // Update payment reminder count
        payment.remindersSent = (payment.remindersSent || 0) + 1;
        payment.lastReminderDate = new Date();
        await payment.save();

        logger.info(`Payment reminder sent to ${user.email} for payment ${payment._id}`);
      } catch (error) {
        logger.error(`Error sending payment reminder for ${payment._id}:`, error);
      }
    }
  }
};

// Send notifications for overdue payments
const sendOverduePaymentNotifications = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overduePayments = await Payment.find({
    status: 'pending',
    dueDate: { $lt: today },
  }).populate('member');

  for (const payment of overduePayments) {
    try {
      const member = payment.member;
      if (!member || !member.user) continue;

      const user = await User.findById(member.user);
      if (!user) continue;

      const daysOverdue = Math.floor((today - payment.dueDate) / (1000 * 60 * 60 * 24));

      // Send notification
      await sendNotification({
        recipient: user._id,
        type: 'payment_reminder',
        title: 'Overdue Payment',
        message: `Your payment of ₹${payment.amount} is overdue by ${daysOverdue} days`,
        priority: 'urgent',
        channel: ['in_app', 'email'],
        actionUrl: `/payments/${payment._id}`,
        actionText: 'Pay Now',
        relatedEntity: {
          entityType: 'payment',
          entityId: payment._id,
        },
      });

      logger.info(`Overdue payment notification sent for payment ${payment._id}`);
    } catch (error) {
      logger.error(`Error sending overdue notification for ${payment._id}:`, error);
    }
  }
};

// Send birthday wishes
const sendBirthdayWishes = async () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const members = await Member.find({
    $expr: {
      $and: [
        { $eq: [{ $month: '$dateOfBirth' }, month] },
        { $eq: [{ $dayOfMonth: '$dateOfBirth' }, day] },
      ],
    },
    status: 'active',
  }).populate('user');

  for (const member of members) {
    try {
      if (!member.user) continue;

      await sendNotification({
        recipient: member.user._id,
        type: 'birthday',
        title: '🎉 Happy Birthday!',
        message: `Wishing you a wonderful birthday, ${member.firstName}! May this year bring you joy and success.`,
        priority: 'medium',
        channel: ['in_app', 'email'],
      });

      logger.info(`Birthday wishes sent to ${member.fullName}`);
    } catch (error) {
      logger.error(`Error sending birthday wishes to ${member._id}:`, error);
    }
  }
};

// Send anniversary wishes
const sendAnniversaryWishes = async () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const members = await Member.find({
    $expr: {
      $and: [
        { $eq: [{ $month: '$anniversaryDate' }, month] },
        { $eq: [{ $dayOfMonth: '$anniversaryDate' }, day] },
      ],
    },
    anniversaryDate: { $exists: true },
    status: 'active',
  }).populate('user');

  for (const member of members) {
    try {
      if (!member.user) continue;

      await sendNotification({
        recipient: member.user._id,
        type: 'anniversary',
        title: '🎊 Happy Anniversary!',
        message: `Happy Anniversary, ${member.firstName}! Wishing you many more years of happiness together.`,
        priority: 'medium',
        channel: ['in_app', 'email'],
      });

      logger.info(`Anniversary wishes sent to ${member.fullName}`);
    } catch (error) {
      logger.error(`Error sending anniversary wishes to ${member._id}:`, error);
    }
  }
};
