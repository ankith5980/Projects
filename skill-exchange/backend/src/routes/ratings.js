import express from 'express';
import {
    createRating,
    getUserRatings,
    getSkillRatings,
    checkCanRate
} from '../controllers/ratingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createRating);
router.get('/check/:sessionId', protect, checkCanRate);
router.get('/user/:userId', getUserRatings);
router.get('/skill/:skillId', getSkillRatings);

export default router;
