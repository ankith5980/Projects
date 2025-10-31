import crypto from 'crypto';
import Razorpay from 'razorpay';
import Payment from '../models/Payment.js';
import Member from '../models/Member.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendNotification } from '../services/notification.service.js';

// Lazy initialize Razorpay
let razorpay;
const getRazorpay = () => {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'test_key',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret',
    });
  }
  return razorpay;
};

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { amount, type, period } = req.body;

  if (!amount || !type) {
    return res.status(400).json({
      success: false,
      message: 'Amount and type are required',
    });
  }

  const member = await Member.findById(req.user.member);

  if (!member) {
    return res.status(404).json({
      success: false,
      message: 'Member not found',
    });
  }

  // Create Razorpay order
  const options = {
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`,
    notes: {
      memberId: member.memberId,
      type,
      period: period || '',
    },
  };

  const order = await getRazorpay().orders.create(options);

  // Create payment record
  const payment = await Payment.create({
    member: req.user.member,
    amount,
    type,
    period,
    paymentMethod: 'razorpay',
    razorpayOrderId: order.id,
    status: 'pending',
  });

  res.status(201).json({
    success: true,
    data: {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment._id,
      key: process.env.RAZORPAY_KEY_ID,
    },
  });
});

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !paymentId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required payment details',
    });
  }

  // Verify signature
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isValid = expectedSignature === razorpay_signature;

  const payment = await Payment.findById(paymentId);

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment record not found',
    });
  }

  if (isValid) {
    // Update payment record
    payment.status = 'completed';
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.paidAt = new Date();
    await payment.save();

    // Populate member details
    await payment.populate('member', 'firstName lastName memberId');

    // Create notification
    await sendNotification({
      recipient: req.user.member,
      type: 'payment_success',
      title: 'Payment Successful',
      message: `Your payment of ₹${payment.amount} has been received successfully.`,
      channel: ['in_app', 'email'],
      metadata: { paymentId: payment._id, type: payment.type },
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: payment,
    });
  } else {
    // Update payment as failed
    payment.status = 'failed';
    await payment.save();

    // Create notification
    await sendNotification({
      recipient: req.user.member,
      type: 'payment_failed',
      title: 'Payment Failed',
      message: `Your payment of ₹${payment.amount} has failed. Please try again.`,
      channel: ['in_app', 'email'],
      metadata: { paymentId: payment._id, type: payment.type },
    });

    res.status(400).json({
      success: false,
      message: 'Payment verification failed',
    });
  }
});

// @desc    Handle Razorpay webhook
// @route   POST /api/payments/webhook
// @access  Public (but verified)
export const handleWebhook = asyncHandler(async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  // Verify webhook signature
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }

  const event = req.body.event;
  const paymentEntity = req.body.payload.payment.entity;

  // Handle different events
  switch (event) {
    case 'payment.captured':
      await Payment.findOneAndUpdate(
        { razorpayPaymentId: paymentEntity.id },
        {
          status: 'completed',
          paidAt: new Date(paymentEntity.created_at * 1000),
        }
      );
      break;

    case 'payment.failed':
      await Payment.findOneAndUpdate(
        { razorpayPaymentId: paymentEntity.id },
        { status: 'failed' }
      );
      break;

    default:
      console.log(`Unhandled event: ${event}`);
  }

  res.json({ success: true, message: 'Webhook processed' });
});

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
export const getAllPayments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build filter
  const filter = {};

  // If not admin, show only user's payments
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    filter.member = req.user.member;
  } else if (req.query.memberId) {
    // Admin can filter by member
    filter.member = req.query.memberId;
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.type) {
    filter.type = req.query.type;
  }

  if (req.query.startDate || req.query.endDate) {
    filter.createdAt = {};
    if (req.query.startDate) {
      filter.createdAt.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      filter.createdAt.$lte = new Date(req.query.endDate);
    }
  }

  const payments = await Payment.find(filter)
    .populate('member', 'firstName lastName memberId photo')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Payment.countDocuments(filter);

  // Calculate totals
  const totals = await Payment.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        completedAmount: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] },
        },
        pendingAmount: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0] },
        },
      },
    },
  ]);

  res.json({
    success: true,
    data: {
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      totals: totals[0] || { totalAmount: 0, completedAmount: 0, pendingAmount: 0 },
    },
  });
});

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate(
    'member',
    'firstName lastName memberId email phone photo'
  );

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found',
    });
  }

  // Check authorization
  if (
    req.user.role !== 'admin' &&
    req.user.role !== 'super_admin' &&
    payment.member._id.toString() !== req.user.member.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this payment',
    });
  }

  res.json({
    success: true,
    data: payment,
  });
});

// @desc    Get pending payments for member
// @route   GET /api/payments/pending/my
// @access  Private
export const getPendingPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({
    member: req.user.member,
    status: 'pending',
  }).sort({ dueDate: 1 });

  res.json({
    success: true,
    data: payments,
  });
});

// @desc    Generate invoice PDF
// @route   GET /api/payments/:id/invoice
// @access  Private
export const generateInvoice = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate(
    'member',
    'firstName lastName memberId email phone address'
  );

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found',
    });
  }

  // Check authorization
  if (
    req.user.role !== 'admin' &&
    req.user.role !== 'super_admin' &&
    payment.member._id.toString() !== req.user.member.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this invoice',
    });
  }

  if (payment.status !== 'completed') {
    return res.status(400).json({
      success: false,
      message: 'Invoice can only be generated for completed payments',
    });
  }

  // TODO: Implement PDF generation using a library like pdfkit or puppeteer
  // For now, return invoice data
  const invoiceData = {
    invoiceNumber: payment.invoiceNumber,
    member: payment.member,
    amount: payment.amount,
    type: payment.type,
    period: payment.period,
    paidAt: payment.paidAt,
    paymentMethod: payment.paymentMethod,
    razorpayPaymentId: payment.razorpayPaymentId,
  };

  res.json({
    success: true,
    message: 'Invoice data retrieved. PDF generation to be implemented.',
    data: invoiceData,
  });
});

// @desc    Get payment statistics
// @route   GET /api/payments/stats/summary
// @access  Private/Admin
export const getPaymentStats = asyncHandler(async (req, res) => {
  const stats = await Payment.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);

  const typeStats = await Payment.aggregate([
    {
      $match: { status: 'completed' },
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);

  const monthlyStats = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        paidAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$paidAt' },
          month: { $month: '$paidAt' },
        },
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const total = await Payment.countDocuments();

  res.json({
    success: true,
    data: {
      total,
      byStatus: stats,
      byType: typeStats,
      monthly: monthlyStats,
    },
  });
});
