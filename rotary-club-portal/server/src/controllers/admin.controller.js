import User from '../models/User.js';
import Member from '../models/Member.js';
import Project from '../models/Project.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  // Get counts
  const totalUsers = await User.countDocuments();
  const totalMembers = await Member.countDocuments();
  const activeMembers = await Member.countDocuments({ status: 'active' });
  const totalProjects = await Project.countDocuments();
  const activeProjects = await Project.countDocuments({ status: 'active' });
  const totalPayments = await Payment.countDocuments();
  const pendingPayments = await Payment.countDocuments({ status: 'pending' });

  // Get revenue statistics
  const completedPayments = await Payment.find({ status: 'completed' });
  const totalRevenue = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);

  // Get recent registrations
  const recentMembers = await Member.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'email isEmailVerified')
    .select('firstName lastName memberId status createdAt');

  // Get member statistics by type
  const membersByType = await Member.aggregate([
    {
      $group: {
        _id: '$membershipType',
        count: { $sum: 1 },
      },
    },
  ]);

  // Get payment statistics by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const paymentsByMonth = await Payment.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
        status: 'completed',
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 },
    },
  ]);

  res.json({
    success: true,
    data: {
      overview: {
        totalUsers,
        totalMembers,
        activeMembers,
        totalProjects,
        activeProjects,
        totalPayments,
        pendingPayments,
        totalRevenue,
      },
      recentMembers,
      membersByType,
      paymentsByMonth,
    },
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .populate('member', 'firstName lastName memberId phone status')
    .select('-password -refreshToken')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments();

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get all members
// @route   GET /api/admin/members
// @access  Private/Admin
export const getAllMembers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build filter
  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.membershipType) {
    filter.membershipType = req.query.membershipType;
  }
  if (req.query.search) {
    filter.$or = [
      { firstName: { $regex: req.query.search, $options: 'i' } },
      { lastName: { $regex: req.query.search, $options: 'i' } },
      { memberId: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const members = await Member.find(filter)
    .populate('user', 'email isEmailVerified lastLogin')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Member.countDocuments(filter);

  res.json({
    success: true,
    data: {
      members,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get single member details
// @route   GET /api/admin/members/:id
// @access  Private/Admin
export const getMemberDetails = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id)
    .populate('user', 'email isEmailVerified lastLogin createdAt')
    .populate('committees.committeeId', 'name');

  if (!member) {
    return res.status(404).json({
      success: false,
      message: 'Member not found',
    });
  }

  // Get member's payments
  const payments = await Payment.find({ member: member._id })
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({
    success: true,
    data: {
      member,
      payments,
    },
  });
});

// @desc    Update member status
// @route   PUT /api/admin/members/:id/status
// @access  Private/Admin
export const updateMemberStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['active', 'inactive', 'suspended'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status value',
    });
  }

  const member = await Member.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  ).populate('user', 'email');

  if (!member) {
    return res.status(404).json({
      success: false,
      message: 'Member not found',
    });
  }

  res.json({
    success: true,
    message: `Member status updated to ${status}`,
    data: member,
  });
});

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private/Admin
export const getAllPayments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build filter
  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.type) {
    filter.type = req.query.type;
  }

  const payments = await Payment.find(filter)
    .populate('member', 'firstName lastName memberId')
    .populate('user', 'email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Payment.countDocuments(filter);

  // Calculate totals
  const allPayments = await Payment.find(filter);
  const totalAmount = allPayments.reduce((sum, p) => sum + p.amount, 0);

  res.json({
    success: true,
    data: {
      payments,
      summary: {
        totalAmount,
        totalCount: total,
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get all projects
// @route   GET /api/admin/projects
// @access  Private/Admin
export const getAllProjects = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.type) {
    filter.type = req.query.type;
  }

  const projects = await Project.find(filter)
    .populate('createdBy', 'firstName lastName')
    .populate('team.member', 'firstName lastName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Project.countDocuments(filter);

  res.json({
    success: true,
    data: {
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Delete user (soft delete)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Prevent deleting yourself
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own account',
    });
  }

  // Update member status to inactive
  if (user.member) {
    await Member.findByIdAndUpdate(user.member, { status: 'inactive' });
  }

  // Delete user
  await user.deleteOne();

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});

// @desc    Export data to CSV
// @route   GET /api/admin/export/:type
// @access  Private/Admin
export const exportData = asyncHandler(async (req, res) => {
  const { type } = req.params;

  let data;
  let filename;

  switch (type) {
    case 'members':
      data = await Member.find()
        .populate('user', 'email')
        .select('memberId firstName lastName email phone dateOfBirth gender status membershipType createdAt')
        .lean();
      filename = `members_${Date.now()}.json`;
      break;

    case 'payments':
      data = await Payment.find()
        .populate('member', 'firstName lastName memberId')
        .select('member amount type status dueDate paidDate razorpayOrderId createdAt')
        .lean();
      filename = `payments_${Date.now()}.json`;
      break;

    case 'users':
      data = await User.find()
        .populate('member', 'firstName lastName memberId')
        .select('email role isEmailVerified lastLogin createdAt')
        .lean();
      filename = `users_${Date.now()}.json`;
      break;

    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid export type',
      });
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.json({
    success: true,
    data,
    exportedAt: new Date().toISOString(),
    count: data.length,
  });
});
