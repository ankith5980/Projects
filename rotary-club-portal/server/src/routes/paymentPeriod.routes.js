import express from 'express';
import {
  createPaymentPeriod,
  getPaymentPeriods,
  getPaymentPeriod,
  updatePaymentPeriod,
  deletePaymentPeriod,
  triggerPaymentCreation,
  getDashboardSummary,
} from '../controllers/paymentPeriod.controller.js';
import { protect } from '../middleware/auth.js';
import { checkClubPosition } from '../middleware/checkClubPosition.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Dashboard summary (all authenticated users)
router.get('/dashboard/summary', getDashboardSummary);

// Get all payment periods (all authenticated users)
router.get('/', getPaymentPeriods);

// Get single payment period (all authenticated users)
router.get('/:id', getPaymentPeriod);

// Admin-only routes (President, Secretary, Treasurer)
router.post('/', checkClubPosition, createPaymentPeriod);
router.put('/:id', checkClubPosition, updatePaymentPeriod);
router.delete('/:id', checkClubPosition, deletePaymentPeriod);
router.post('/:id/create-payments', checkClubPosition, triggerPaymentCreation);

export default router;
