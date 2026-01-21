import express from 'express';
import {
    getSessions,
    getSession,
    createSession,
    updateSession,
    getUpcomingSessions,
    getSessionStats
} from '../controllers/sessionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All session routes are protected

router.get('/upcoming', getUpcomingSessions);
router.get('/stats', getSessionStats);

router.route('/')
    .get(getSessions)
    .post(createSession);

router.route('/:id')
    .get(getSession)
    .put(updateSession);

export default router;
