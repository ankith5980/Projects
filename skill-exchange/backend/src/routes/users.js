import express from 'express';
import {
    getUsers,
    getUser,
    getUserStats,
    getLeaderboard
} from '../controllers/userController.js';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/', getUsers);
router.get('/:id', getUser);
router.get('/:id/stats', getUserStats);

export default router;
