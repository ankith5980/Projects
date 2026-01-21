import Session from '../models/Session.js';
import Skill from '../models/Skill.js';
import User from '../models/User.js';

// @desc    Get user's sessions
// @route   GET /api/sessions
// @access  Private
export const getSessions = async (req, res, next) => {
    try {
        const { status, role, page = 1, limit = 10 } = req.query;

        let query = {
            $or: [
                { teacher: req.user.id },
                { student: req.user.id }
            ]
        };

        // Filter by status
        if (status) {
            query.status = status;
        }

        // Filter by role
        if (role === 'teacher') {
            query = { teacher: req.user.id };
            if (status) query.status = status;
        } else if (role === 'student') {
            query = { student: req.user.id };
            if (status) query.status = status;
        }

        const skip = (page - 1) * limit;

        const sessions = await Session.find(query)
            .populate('skill', 'title category pointsCost duration')
            .populate('teacher', 'name avatar')
            .populate('student', 'name avatar')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ scheduledAt: -1 });

        const total = await Session.countDocuments(query);

        res.status(200).json({
            success: true,
            count: sessions.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: sessions
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Private
export const getSession = async (req, res, next) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate('skill', 'title description category pointsCost duration')
            .populate('teacher', 'name avatar email')
            .populate('student', 'name avatar email');

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        // Check if user is part of session
        if (
            session.teacher._id.toString() !== req.user.id &&
            session.student._id.toString() !== req.user.id
        ) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to view this session'
            });
        }

        res.status(200).json({
            success: true,
            data: session
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Book a session
// @route   POST /api/sessions
// @access  Private
export const createSession = async (req, res, next) => {
    try {
        const { skillId, scheduledAt, notes } = req.body;

        // Get skill
        const skill = await Skill.findById(skillId);

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        // Can't book own skill
        if (skill.teacher.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot book your own skill'
            });
        }

        // Check if student has enough points
        const student = await User.findById(req.user.id);
        if (student.points < skill.pointsCost) {
            return res.status(400).json({
                success: false,
                message: `Insufficient points. You need ${skill.pointsCost} points but have ${student.points}`
            });
        }

        // Create session
        const session = await Session.create({
            skill: skillId,
            teacher: skill.teacher,
            student: req.user.id,
            scheduledAt,
            duration: skill.duration,
            pointsTransferred: skill.pointsCost,
            notes
        });

        // Deduct points from student (points held in escrow)
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { points: -skill.pointsCost }
        });

        // Update skill booking count
        await Skill.findByIdAndUpdate(skillId, {
            $inc: { totalBookings: 1 }
        });

        // Populate and return
        await session.populate([
            { path: 'skill', select: 'title category pointsCost duration' },
            { path: 'teacher', select: 'name avatar' },
            { path: 'student', select: 'name avatar' }
        ]);

        res.status(201).json({
            success: true,
            data: session
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update session status
// @route   PUT /api/sessions/:id
// @access  Private
export const updateSession = async (req, res, next) => {
    try {
        const { status, meetingLink, cancellationReason } = req.body;

        let session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        // Check authorization
        const isTeacher = session.teacher.toString() === req.user.id;
        const isStudent = session.student.toString() === req.user.id;

        if (!isTeacher && !isStudent) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this session'
            });
        }

        // Handle different status updates
        if (status === 'confirmed' && !isTeacher) {
            return res.status(401).json({
                success: false,
                message: 'Only teacher can confirm sessions'
            });
        }

        if (status === 'completed') {
            if (!isTeacher) {
                return res.status(401).json({
                    success: false,
                    message: 'Only teacher can mark session as completed'
                });
            }

            // Transfer points to teacher
            await User.findByIdAndUpdate(session.teacher, {
                $inc: {
                    points: session.pointsTransferred,
                    totalSessionsAsTeacher: 1
                }
            });

            // Update student session count
            await User.findByIdAndUpdate(session.student, {
                $inc: { totalSessionsAsStudent: 1 }
            });
        }

        if (status === 'cancelled') {
            // Students can only cancel within 24 hours of booking
            if (isStudent) {
                const hoursSinceBooking = (Date.now() - new Date(session.createdAt).getTime()) / (1000 * 60 * 60);
                if (hoursSinceBooking > 24) {
                    return res.status(400).json({
                        success: false,
                        message: 'Cancellation window has expired. Students can only cancel within 24 hours of booking.'
                    });
                }
            }

            // Can only cancel pending or confirmed sessions
            if (!['pending', 'confirmed'].includes(session.status)) {
                return res.status(400).json({
                    success: false,
                    message: 'This session cannot be cancelled'
                });
            }

            // Refund points to student
            await User.findByIdAndUpdate(session.student, {
                $inc: { points: session.pointsTransferred }
            });

            session.cancelledBy = req.user.id;
            session.cancellationReason = cancellationReason || 'No reason provided';
        }

        session.status = status || session.status;
        session.meetingLink = meetingLink || session.meetingLink;

        await session.save();

        await session.populate([
            { path: 'skill', select: 'title category pointsCost duration' },
            { path: 'teacher', select: 'name avatar' },
            { path: 'student', select: 'name avatar' }
        ]);

        res.status(200).json({
            success: true,
            data: session
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get upcoming sessions
// @route   GET /api/sessions/upcoming
// @access  Private
export const getUpcomingSessions = async (req, res, next) => {
    try {
        const sessions = await Session.find({
            $or: [
                { teacher: req.user.id },
                { student: req.user.id }
            ],
            status: { $in: ['pending', 'confirmed'] },
            scheduledAt: { $gte: new Date() }
        })
            .populate('skill', 'title category pointsCost duration')
            .populate('teacher', 'name avatar')
            .populate('student', 'name avatar')
            .sort({ scheduledAt: 1 })
            .limit(5);

        res.status(200).json({
            success: true,
            count: sessions.length,
            data: sessions
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get session stats
// @route   GET /api/sessions/stats
// @access  Private
export const getSessionStats = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const [asTeacher, asStudent] = await Promise.all([
            Session.aggregate([
                { $match: { teacher: req.user._id } },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        totalPoints: { $sum: '$pointsTransferred' }
                    }
                }
            ]),
            Session.aggregate([
                { $match: { student: req.user._id } },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        totalPoints: { $sum: '$pointsTransferred' }
                    }
                }
            ])
        ]);

        res.status(200).json({
            success: true,
            data: {
                asTeacher,
                asStudent
            }
        });
    } catch (err) {
        next(err);
    }
};
