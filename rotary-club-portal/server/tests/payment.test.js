const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const PaymentPeriod = require('../src/models/PaymentPeriod');
const Payment = require('../src/models/Payment');
const User = require('../src/models/User');
const Member = require('../src/models/Member');

describe('Payment System Tests', () => {
  let authToken;
  let adminToken;
  let testMemberId;
  let adminMemberId;
  let testPeriodId;

  beforeAll(async () => {
    // Create test member
    const testUser = await User.create({
      email: 'payment.test@test.com',
      password: 'Test123!@#',
      role: 'member',
    });

    const testMember = await Member.create({
      user: testUser._id,
      firstName: 'Payment',
      lastName: 'Tester',
      email: 'payment.test@test.com',
      phone: '+919876543210',
      memberId: 'PTEST001',
      status: 'active',
    });

    testMemberId = testMember._id;

    // Create admin member
    const adminUser = await User.create({
      email: 'payment.admin@test.com',
      password: 'Test123!@#',
      role: 'admin',
    });

    const adminMember = await Member.create({
      user: adminUser._id,
      firstName: 'Payment',
      lastName: 'Admin',
      email: 'payment.admin@test.com',
      phone: '+919876543211',
      memberId: 'PADMIN001',
      status: 'active',
      clubPosition: 'President',
    });

    adminMemberId = adminMember._id;

    // Get tokens
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'payment.test@test.com',
        password: 'Test123!@#',
      });
    authToken = loginRes.body.token;

    const adminLoginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'payment.admin@test.com',
        password: 'Test123!@#',
      });
    adminToken = adminLoginRes.body.token;
  });

  afterAll(async () => {
    // Cleanup
    await User.deleteMany({ email: /payment\.(test|admin)@test\.com/ });
    await Member.deleteMany({ email: /payment\.(test|admin)@test\.com/ });
    await PaymentPeriod.deleteMany({ name: /Test Period/ });
    await Payment.deleteMany({ member: { $in: [testMemberId, adminMemberId] } });
    await mongoose.connection.close();
  });

  describe('POST /api/payment-periods - Create Payment Period', () => {
    test('should create payment period (admin only)', async () => {
      const startDate = new Date();
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const dueDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

      const res = await request(app)
        .post('/api/payment-periods')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Period November 2025',
          description: 'Test payment period',
          startDate,
          endDate,
          dueDate,
          amount: 5000,
          members: [testMemberId],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.paymentPeriod).toBeDefined();
      expect(res.body.data.paymentPeriod.name).toBe('Test Period November 2025');
      expect(res.body.data.paymentPeriod.amount).toBe(5000);

      testPeriodId = res.body.data.paymentPeriod._id;
    });

    test('should auto-create payment records for members', async () => {
      // Check if payment was created for test member
      const payment = await Payment.findOne({
        member: testMemberId,
        paymentPeriod: testPeriodId,
      });

      expect(payment).toBeDefined();
      expect(payment.amount).toBe(5000);
      expect(payment.status).toBe('pending');
    });

    test('should fail without admin token', async () => {
      const res = await request(app)
        .post('/api/payment-periods')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Unauthorized Period',
          amount: 1000,
        });

      expect(res.status).toBe(403);
    });

    test('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/payment-periods')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Invalid Period',
          // Missing required fields
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/payment-periods - List Payment Periods', () => {
    test('should list all payment periods', async () => {
      const res = await request(app)
        .get('/api/payment-periods')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.paymentPeriods).toBeInstanceOf(Array);
      expect(res.body.data.paymentPeriods.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/payments/pending/my - Get My Pending Payments', () => {
    test('should return pending payments for logged-in member', async () => {
      const res = await request(app)
        .get('/api/payments/pending/my')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.payments).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/payments/create-order - Create Razorpay Order', () => {
    let testPaymentId;

    beforeAll(async () => {
      // Create a test payment
      const payment = await Payment.create({
        member: testMemberId,
        paymentPeriod: testPeriodId,
        amount: 5000,
        status: 'pending',
      });
      testPaymentId = payment._id;
    });

    test('should create Razorpay order', async () => {
      const res = await request(app)
        .post('/api/payments/create-order')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          paymentId: testPaymentId,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.order).toBeDefined();
      expect(res.body.data.order.id).toBeDefined();
      expect(res.body.data.order.amount).toBe(500000); // Amount in paise
    });

    test('should handle invalid payment ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post('/api/payments/create-order')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          paymentId: fakeId,
        });

      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/payments - List Payments with Filters', () => {
    test('should list payments with pagination', async () => {
      const res = await request(app)
        .get('/api/payments')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.payments).toBeInstanceOf(Array);
      expect(res.body.data.pagination).toBeDefined();
    });

    test('should filter by status', async () => {
      const res = await request(app)
        .get('/api/payments')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ status: 'pending' });

      expect(res.status).toBe(200);
      res.body.data.payments.forEach((payment) => {
        expect(payment.status).toBe('pending');
      });
    });

    test('should filter by date range', async () => {
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = new Date();

      const res = await request(app)
        .get('/api/payments')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

      expect(res.status).toBe(200);
      expect(res.body.data.payments).toBeInstanceOf(Array);
    });
  });

  describe('PUT /api/payment-periods/:id - Update Payment Period', () => {
    test('should update payment period (admin only)', async () => {
      const res = await request(app)
        .put(`/api/payment-periods/${testPeriodId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          amount: 6000,
          description: 'Updated description',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.paymentPeriod.amount).toBe(6000);
      expect(res.body.data.paymentPeriod.description).toBe('Updated description');
    });
  });

  describe('DELETE /api/payment-periods/:id - Delete Payment Period', () => {
    test('should delete payment period (admin only)', async () => {
      // Create a period to delete
      const period = await PaymentPeriod.create({
        name: 'Test Period To Delete',
        amount: 1000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        members: [testMemberId],
      });

      const res = await request(app)
        .delete(`/api/payment-periods/${period._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify deletion
      const deleted = await PaymentPeriod.findById(period._id);
      expect(deleted).toBeNull();
    });
  });
});
