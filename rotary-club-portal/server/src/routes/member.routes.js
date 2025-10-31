import express from 'express';
import { protect } from '../middleware/auth.js';
import { checkClubPosition } from '../middleware/checkClubPosition.js';
import {
  getMyProfile,
  getMember,
  getAllMembers,
  updateMember,
  deleteMember,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  addCommittee,
  updateMemberStatus,
} from '../controllers/member.controller.js';

const router = express.Router();

router.use(protect);

// My profile
router.get('/me', getMyProfile);

// Member CRUD
router.get('/', getAllMembers);
router.get('/:id', getMember);
router.put('/:id', updateMember);
router.delete('/:id', checkClubPosition, deleteMember);

// Family members
router.post('/:id/family', addFamilyMember);
router.put('/:id/family/:familyId', updateFamilyMember);
router.delete('/:id/family/:familyId', deleteFamilyMember);

// Committees (admin only)
router.post('/:id/committees', checkClubPosition, addCommittee);

// Status update (admin only)
router.put('/:id/status', checkClubPosition, updateMemberStatus);

export default router;
