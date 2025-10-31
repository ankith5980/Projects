import express from 'express';
import { protect } from '../middleware/auth.js';
import { requireAdminAccess } from '../middleware/checkClubPosition.js';
import {
  getDashboardStats,
  getAllUsers,
  getAllMembers,
  getMemberDetails,
  updateMemberStatus,
  getAllPayments,
  getAllProjects,
  deleteUser,
  exportData,
} from '../controllers/admin.controller.js';

const router = express.Router();

router.use(protect);
router.use(requireAdminAccess); // Only President, Secretary, Treasurer, or super_admin

// Dashboard & Statistics
router.get('/stats', getDashboardStats);
router.get('/dashboard', getDashboardStats); // Alias for backward compatibility

// User Management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// Member Management
router.get('/members', getAllMembers);
router.get('/members/:id', getMemberDetails);
router.put('/members/:id/status', updateMemberStatus);

// Payment Management
router.get('/payments', getAllPayments);

// Project Management
router.get('/projects', getAllProjects);

// Analytics
router.get('/analytics', getDashboardStats); // Alias

// Data Export
router.get('/export/:type', exportData);

export default router;
