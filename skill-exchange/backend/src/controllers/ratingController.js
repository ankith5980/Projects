import Rating from '../models/Rating.js';
import Session from '../models/Session.js';
import User from '../models/User.js';

// @desc    Create rating
// @route   POST /api/ratings
// @access  Private
export const createRating = async (req, res, next) => {
    try {
        const { sessionId, rating, review } = req.body;

        // Get session
        const session = await Session.findById(sessionId);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        // Check if session is completed
        if (session.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Can only rate completed sessions'
            });
        }

        // Determine who is rating whom
        const isTeacher = session.teacher.toString() === req.user.id;
        const isStudent = session.student.toString() === req.user.id;

        if (!isTeacher && !isStudent) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to rate this session'
            });
        }

        // Skill publishers (teachers) cannot rate sessions for their own skills
        if (isTeacher) {
            return res.status(400).json({
                success: false,
                message: 'You cannot rate sessions for your own skill'
            });
        }

        // Check if already rated
        if (session.teacherRated) {
            return res.status(400).json({
                success: false,
                message: 'You have already rated this session'
            });
        }

        // Create rating - only students can rate, so they rate the teacher
        const ratingData = {
            session: sessionId,
            skill: session.skill,
            rater: req.user.id,
            rated: session.teacher,
            rating,
            review,
            type: 'teacher'
        };

        const newRating = await Rating.create(ratingData);

        // Update session rated status
        session.teacherRated = true;
        await session.save();

        // Populate and return
        await newRating.populate([
            { path: 'rater', select: 'name avatar' },
            { path: 'rated', select: 'name avatar' }
        ]);

        res.status(201).json({
            success: true,
            data: newRating
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get ratings for a user
// @route   GET /api/ratings/user/:userId
// @access  Public
export const getUserRatings = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const ratings = await Rating.find({ rated: req.params.userId })
            .populate('rater', 'name avatar')
            .populate('skill', 'title')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Rating.countDocuments({ rated: req.params.userId });

        res.status(200).json({
            success: true,
            count: ratings.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: ratings
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get ratings for a skill
// @route   GET /api/ratings/skill/:skillId
// @access  Public
export const getSkillRatings = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const ratings = await Rating.find({ skill: req.params.skillId })
            .populate('rater', 'name avatar')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Rating.countDocuments({ skill: req.params.skillId });

        res.status(200).json({
            success: true,
            count: ratings.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: ratings
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Check if user can rate a session
// @route   GET /api/ratings/check/:sessionId
// @access  Private
export const checkCanRate = async (req, res, next) => {
    try {
        const session = await Session.findById(req.params.sessionId);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        const isTeacher = session.teacher.toString() === req.user.id;
        const isStudent = session.student.toString() === req.user.id;

        let canRate = false;
        let hasRated = false;

        if (session.status === 'completed') {
            if (isStudent) {
                canRate = !session.teacherRated;
                hasRated = session.teacherRated;
            } else if (isTeacher) {
                canRate = !session.studentRated;
                hasRated = session.studentRated;
            }
        }

        res.status(200).json({
            success: true,
            data: {
                canRate,
                hasRated,
                sessionCompleted: session.status === 'completed'
            }
        });
    } catch (err) {
        next(err);
    }
};
