import Skill from '../models/Skill.js';
import User from '../models/User.js';

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req, res, next) => {
    try {
        const {
            search,
            category,
            level,
            minPoints,
            maxPoints,
            page = 1,
            limit = 12,
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query;

        let query = { isActive: true };

        // Text search
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // Level filter
        if (level) {
            query.level = level;
        }

        // Points range filter
        if (minPoints || maxPoints) {
            query.pointsCost = {};
            if (minPoints) query.pointsCost.$gte = parseInt(minPoints);
            if (maxPoints) query.pointsCost.$lte = parseInt(maxPoints);
        }

        const skip = (page - 1) * limit;
        const sortOrder = order === 'asc' ? 1 : -1;

        const skills = await Skill.find(query)
            .populate('teacher', 'name avatar averageRating')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ [sortBy]: sortOrder });

        const total = await Skill.countDocuments(query);

        res.status(200).json({
            success: true,
            count: skills.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: skills
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
export const getSkill = async (req, res, next) => {
    try {
        const skill = await Skill.findById(req.params.id)
            .populate('teacher', 'name avatar bio averageRating totalRatings skillsOffered');

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        res.status(200).json({
            success: true,
            data: skill
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private
export const createSkill = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.teacher = req.user.id;

        const skill = await Skill.create(req.body);

        // Populate teacher info
        await skill.populate('teacher', 'name avatar averageRating');

        res.status(201).json({
            success: true,
            data: skill
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
export const updateSkill = async (req, res, next) => {
    try {
        let skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        // Make sure user is skill owner
        if (skill.teacher.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this skill'
            });
        }

        skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('teacher', 'name avatar averageRating');

        res.status(200).json({
            success: true,
            data: skill
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
export const deleteSkill = async (req, res, next) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        // Make sure user is skill owner
        if (skill.teacher.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this skill'
            });
        }

        await skill.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get skills by teacher
// @route   GET /api/skills/teacher/:teacherId
// @access  Public
export const getSkillsByTeacher = async (req, res, next) => {
    try {
        const skills = await Skill.find({
            teacher: req.params.teacherId,
            isActive: true
        }).populate('teacher', 'name avatar averageRating');

        res.status(200).json({
            success: true,
            count: skills.length,
            data: skills
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get my skills
// @route   GET /api/skills/my
// @access  Private
export const getMySkills = async (req, res, next) => {
    try {
        const skills = await Skill.find({ teacher: req.user.id })
            .populate('teacher', 'name avatar averageRating');

        res.status(200).json({
            success: true,
            count: skills.length,
            data: skills
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get skill categories
// @route   GET /api/skills/categories
// @access  Public
export const getCategories = async (req, res, next) => {
    try {
        const categories = [
            'Programming',
            'Design',
            'Marketing',
            'Music',
            'Languages',
            'Business',
            'Photography',
            'Writing',
            'Fitness',
            'Cooking',
            'Arts & Crafts',
            'Finance',
            'Science',
            'Other'
        ];

        // Get count for each category
        const categoryCounts = await Skill.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        const categoryMap = {};
        categoryCounts.forEach(c => {
            categoryMap[c._id] = c.count;
        });

        const data = categories.map(cat => ({
            name: cat,
            count: categoryMap[cat] || 0
        }));

        res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        next(err);
    }
};
