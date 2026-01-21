import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Public
export const getUsers = async (req, res, next) => {
    try {
        const { search, skill, page = 1, limit = 10 } = req.query;

        let query = {};

        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Filter by skill offered
        if (skill) {
            query.skillsOffered = { $regex: skill, $options: 'i' };
        }

        const skip = (page - 1) * limit;

        const users = await User.find(query)
            .select('-password')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ averageRating: -1 });

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: users
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get user stats
// @route   GET /api/users/:id/stats
// @access  Public
export const getUserStats = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select(
            'points averageRating totalRatings totalSessionsAsTeacher totalSessionsAsStudent'
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get top teachers (leaderboard)
// @route   GET /api/users/leaderboard
// @access  Public
export const getLeaderboard = async (req, res, next) => {
    try {
        const { limit = 10 } = req.query;

        const users = await User.find({ totalSessionsAsTeacher: { $gt: 0 } })
            .select('name avatar averageRating totalRatings totalSessionsAsTeacher skillsOffered')
            .sort({ averageRating: -1, totalSessionsAsTeacher: -1 })
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        next(err);
    }
};
