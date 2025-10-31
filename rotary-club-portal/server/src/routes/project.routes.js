import express from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import { checkClubPosition } from '../middleware/checkClubPosition.js';
import {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  addProjectUpdate,
  updateProjectStatus,
  getProjectStats,
} from '../controllers/project.controller.js';

const router = express.Router();

// Public routes - No authentication required
router.get('/', optionalAuth, getAllProjects);
router.get('/:id', optionalAuth, getProject);

// Protected routes - Only President, Secretary, Treasurer can access
router.get('/stats/summary', protect, getProjectStats);
router.post('/', protect, checkClubPosition, createProject);
router.put('/:id', protect, checkClubPosition, updateProject);
router.delete('/:id', protect, checkClubPosition, deleteProject);

// Project status
router.put('/:id/status', protect, checkClubPosition, updateProjectStatus);

// Team management
router.post('/:id/team', protect, checkClubPosition, addTeamMember);
router.delete('/:id/team/:memberId', protect, checkClubPosition, removeTeamMember);

// Milestone management
router.post('/:id/milestones', protect, checkClubPosition, addMilestone);
router.put('/:id/milestones/:milestoneId', protect, checkClubPosition, updateMilestone);
router.delete('/:id/milestones/:milestoneId', protect, checkClubPosition, deleteMilestone);

// Project updates
router.post('/:id/updates', protect, checkClubPosition, addProjectUpdate);

export default router;
