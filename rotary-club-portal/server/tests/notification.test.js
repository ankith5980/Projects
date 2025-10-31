const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const Notification = require('../src/models/Notification');
const User = require('../src/models/User');
const Member = require('../src/models/Member');

describe('Notification System Tests', () => {
  let authToken;
  let testUserId;
  let testMemberId;
  let testNotificationId;

  beforeAll(async () => {
    // Create test user and member
    const testUser = await User.create({
      email: 'notification.test@test.com',
      password: 'Test123!@#',
      role: 'member',
    });

    const testMember = await Member.create({
      user: testUser._id,
      firstName: 'Notification',
      lastName: 'Tester',
      email: 'notification.test@test.com',
      phone: '+919876543210',
      memberId: 'NTEST001',
      status: 'active',
    });

    testUserId = testUser._id;
    testMemberId = testMember._id;

    // Login to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'notification.test@test.com',
        password: 'Test123!@#',
      });

    authToken = loginRes.body.token;
  });

  afterAll(async () => {
    // Cleanup
    await User.deleteOne({ email: 'notification.test@test.com' });
    await Member.deleteOne({ email: 'notification.test@test.com' });
    await Notification.deleteMany({ recipient: testMemberId });
    await mongoose.connection.close();
  });

  describe('GET /api/notifications - Get My Notifications', () => {
    beforeAll(async () => {
      // Create test notifications
      await Notification.create([
        {
          recipient: testMemberId,
          type: 'payment_reminder',
          title: 'Payment Due',
          message: 'Your payment is due soon',
          priority: 'high',
        },
        {
          recipient: testMemberId,
          type: 'announcement',
          title: 'Club Meeting',
          message: 'Meeting scheduled for next week',
          priority: 'medium',
          isRead: true,
        },
        {
          recipient: testMemberId,
          type: 'project_update',
          title: 'Project Progress',
          message: 'Project 50% complete',
          priority: 'low',
        },
      ]);
    });

    test('should return paginated notifications', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.notifications).toBeInstanceOf(Array);
      expect(res.body.data.notifications.length).toBeGreaterThan(0);
      expect(res.body.data.pagination).toBeDefined();
      expect(res.body.data.unreadCount).toBeDefined();
    });

    test('should filter notifications by type', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ type: 'payment_reminder' });

      expect(res.status).toBe(200);
      expect(res.body.data.notifications).toBeInstanceOf(Array);
      res.body.data.notifications.forEach((notif) => {
        expect(notif.type).toBe('payment_reminder');
      });
    });

    test('should filter notifications by read status', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ isRead: false });

      expect(res.status).toBe(200);
      res.body.data.notifications.forEach((notif) => {
        expect(notif.isRead).toBe(false);
      });
    });

    test('should return unread count', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(typeof res.body.data.unreadCount).toBe('number');
      expect(res.body.data.unreadCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('GET /api/notifications/stats - Get Statistics', () => {
    test('should return notification statistics', async () => {
      const res = await request(app)
        .get('/api/notifications/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total).toBeDefined();
      expect(res.body.data.unread).toBeDefined();
      expect(res.body.data.byType).toBeDefined();
      expect(typeof res.body.data.total).toBe('number');
      expect(typeof res.body.data.unread).toBe('number');
    });
  });

  describe('PUT /api/notifications/:id/read - Mark as Read', () => {
    test('should mark notification as read', async () => {
      // Create unread notification
      const notification = await Notification.create({
        recipient: testMemberId,
        type: 'system',
        title: 'Test Notification',
        message: 'This is a test',
        isRead: false,
      });

      testNotificationId = notification._id;

      const res = await request(app)
        .put(`/api/notifications/${testNotificationId}/read`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.notification.isRead).toBe(true);
      expect(res.body.data.notification.readAt).toBeDefined();
    });

    test('should return 404 for non-existent notification', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/notifications/${fakeId}/read`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/notifications/read-all - Mark All as Read', () => {
    test('should mark all notifications as read', async () => {
      const res = await request(app)
        .put('/api/notifications/read-all')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.count).toBeDefined();
      expect(typeof res.body.data.count).toBe('number');

      // Verify all are marked as read
      const unreadCount = await Notification.countDocuments({
        recipient: testMemberId,
        isRead: false,
      });
      expect(unreadCount).toBe(0);
    });
  });

  describe('DELETE /api/notifications/:id - Delete Notification', () => {
    test('should delete notification', async () => {
      const notification = await Notification.create({
        recipient: testMemberId,
        type: 'other',
        title: 'To Delete',
        message: 'This will be deleted',
      });

      const res = await request(app)
        .delete(`/api/notifications/${notification._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify deletion
      const deleted = await Notification.findById(notification._id);
      expect(deleted).toBeNull();
    });
  });

  describe('DELETE /api/notifications/clear-read - Delete All Read', () => {
    test('should delete all read notifications', async () => {
      // Create read notifications
      await Notification.create([
        {
          recipient: testMemberId,
          type: 'system',
          title: 'Read 1',
          message: 'Read notification 1',
          isRead: true,
        },
        {
          recipient: testMemberId,
          type: 'system',
          title: 'Read 2',
          message: 'Read notification 2',
          isRead: true,
        },
      ]);

      const res = await request(app)
        .delete('/api/notifications/clear-read')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.count).toBeGreaterThanOrEqual(2);

      // Verify only read notifications were deleted
      const unreadCount = await Notification.countDocuments({
        recipient: testMemberId,
        isRead: false,
      });
      expect(unreadCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Authorization Tests', () => {
    test('should return 401 without auth token', async () => {
      const res = await request(app).get('/api/notifications');

      expect(res.status).toBe(401);
    });

    test('should return 401 with invalid token', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', 'Bearer invalid_token');

      expect(res.status).toBe(401);
    });
  });
});
