import Member from '../models/Member.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get current member profile
// @route   GET /api/members/me
// @access  Private
export const getMyProfile = asyncHandler(async (req, res) => {
  const member = await Member.findOne({ user: req.user._id })
    .populate('user', 'email role isEmailVerified lastLogin')
    .populate('sponsoredBy', 'firstName lastName memberId');

  if (!member) {
    return res.status(404).json({
      success: false,
      message: 'Member profile not found',
    });
  }

  res.json({
    success: true,
    data: member,
  });
});

// @desc    Get member by ID
// @route   GET /api/members/:id
// @access  Private
export const getMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id)
    .populate('user', 'email isEmailVerified lastLogin role')
    .populate('sponsoredBy', 'firstName lastName memberId');

  if (!member) {
    return res.status(404).json({
      success: false,
      message: 'Member not found',
    });
  }

  res.json({
    success: true,
    data: member,
  });
});

// @desc    Get all members
// @route   GET /api/members
// @access  Private
export const getAllMembers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
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
    ];
  }

  const members = await Member.find(filter)
    .select('memberId firstName lastName photo email phone status membershipType occupation address createdAt')
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

// @desc    Update member profile
// @route   PUT /api/members/:id
// @access  Private
export const updateMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);

  if (!member) {
    return res.status(404).json({
      success: false,
      message: 'Member not found',
    });
  }

  // Check if user is updating their own profile or is admin
  if (
    member.user.toString() !== req.user._id.toString() &&
    !['admin', 'super_admin'].includes(req.user.role)
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this profile',
    });
  }

  // Update allowed fields
  const allowedFields = [
    'firstName',
    'lastName',
    'displayName',
    'phone',
    'alternatePhone',
    'dateOfBirth',
    'gender',
    'bloodGroup',
    'photo',
    'address',
    'occupation',
    'company',
    'designation',
    'classification',
    'membershipType',
    'spouseInfo',
    'emergencyContact',
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      member[field] = req.body[field];
    }
  });

  await member.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: member,
  });
});

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private/Admin
export const deleteMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);

  if (!member) {
    return res.status(404).json({
      success: false,
      message: 'Member not found',
    });
  }

  // Delete associated user
  if (member.user) {
    await User.findByIdAndDelete(member.user);
  }

  await member.deleteOne();

  res.json({
    success: true,
    message: 'Member deleted successfully',
  });
});

// @desc    Add family member
// @route   POST /api/members/:id/family
// @access  Private
export const addFamilyMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);

  if (!member) {
    return res.status(404).json({
      success: false,
      message: 'Member not found',
    });
  }

  // Check authorization
  if (
    member.user.toString() !== req.user._id.toString() &&
    !['admin', 'super_admin'].includes(req.user.role)
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  member.familyMembers.push(req.body);
  await member.save();

  res.status(201).json({
    success: true,
    message: 'Family member added successfully',
    data: member,
  });
});

// @desc    Update family member
// @route   PUT /api/members/:id/family/:familyId
// @access  Private
export const updateFamilyMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);

  if (!member) {
    return res.status(404).json({
      success: false,
      message: 'Member not found',
    });
  }

  // Check authorization
  if (
    member.user.toString() !== req.user._id.toString() &&
    !['admin', 'super_admin'].includes(req.user.role)
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  const familyMember = member.familyMembers.id(req.params.familyId);

  if (!familyMember) {
    return res.status(404).json({
      success: false,
      message: 'Family member not found',
    });
  }

  Object.keys(req.body).forEach((key) => {
    familyMember[key] = req.body[key];
  });

  await member.save();

  res.json({
    success: true,
    message: 'Family member updated successfully',
    data: member,
  });
});

// @desc    Delete family member
// @route   DELETE /api/members/:id/family/:familyId
// @access  Private
export const deleteFamilyMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);

  if (!member) {
    return res.status(404).json({
      success: false,
      message: 'Member not found',
    });
  }

  // Check authorization
  if (
    member.user.toString() !== req.user._id.toString() &&
    !['admin', 'super_admin'].includes(req.user.role)
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  member.familyMembers.pull(req.params.familyId);
  await member.save();

  res.json({
    success: true,
    message: 'Family member deleted successfully',
    data: member,
  });
});

// @desc    Add committee membership
// @route   POST /api/members/:id/committees
// @access  Private/Admin
export const addCommittee = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);

  if (!member) {
    return res.status(404).json({
      success: false,
      message: 'Member not found',
    });
  }

  member.committees.push(req.body);
  await member.save();

  res.status(201).json({
    success: true,
    message: 'Committee membership added successfully',
    data: member,
  });
});

// @desc    Update member status
// @route   PUT /api/members/:id/status
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
  );

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
