import express from 'express';
import { protect } from '../middleware/auth.js';
import { checkClubPosition } from '../middleware/checkClubPosition.js';
import { paymentRateLimiter } from '../config/rateLimiter.js';
import {
  createOrder,
  verifyPayment,
  handleWebhook,
  getAllPayments,
  getPaymentById,
  getPendingPayments,
  generateInvoice,
  getPaymentStats,
} from '../controllers/payment.controller.js';

const router = express.Router();

// Webhook route (public but verified)
router.post('/webhook', handleWebhook);

// Protected routes
router.use(protect);

// Stats route (admin only - President, Secretary, Treasurer)
router.get('/stats/summary', checkClubPosition, getPaymentStats);

// Payment operations
router.post('/create-order', paymentRateLimiter, createOrder);
router.post('/verify', paymentRateLimiter, verifyPayment);

// Get payments
router.get('/', getAllPayments);
router.get('/pending/my', getPendingPayments);
router.get('/:id', getPaymentById);
router.get('/:id/invoice', generateInvoice);

export default router;
