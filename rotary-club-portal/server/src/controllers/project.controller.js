import Project from '../models/Project.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getIO } from '../services/socket.service.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
export const getAllProjects = asyncHandler(async (req, res) => {
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
  
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const projects = await Project.find(filter)
    .populate('createdBy', 'firstName lastName')
    .populate('team.member', 'firstName lastName photo')
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

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('createdBy', 'firstName lastName photo')
    .populate('team.member', 'firstName lastName photo occupation')
    .populate('updates.createdBy', 'firstName lastName');

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  res.json({
    success: true,
    data: project,
  });
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = asyncHandler(async (req, res) => {
  const projectData = {
    ...req.body,
    createdBy: req.user.member,
  };

  const project = await Project.create(projectData);

  // Populate for response
  await project.populate('createdBy', 'firstName lastName photo');

  // Emit socket event
  const io = getIO();
  io.emit('project:created', {
    project,
    message: `New project "${project.name}" has been created`,
  });

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: project,
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = asyncHandler(async (req, res) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  // Update allowed fields
  const allowedFields = [
    'name',
    'description',
    'type',
    'status',
    'startDate',
    'endDate',
    'location',
    'targetAudience',
    'expectedOutcome',
    'budget',
    'images',
    'documents',
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      project[field] = req.body[field];
    }
  });

  await project.save();

  await project.populate('createdBy', 'firstName lastName photo');
  await project.populate('team.member', 'firstName lastName photo');

  res.json({
    success: true,
    message: 'Project updated successfully',
    data: project,
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  await project.deleteOne();

  res.json({
    success: true,
    message: 'Project deleted successfully',
  });
});

// @desc    Add team member to project
// @route   POST /api/projects/:id/team
// @access  Private/Admin
export const addTeamMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  // Check if member already in team
  const exists = project.team.some(
    (t) => t.member.toString() === req.body.member.toString()
  );

  if (exists) {
    return res.status(400).json({
      success: false,
      message: 'Member already in project team',
    });
  }

  project.team.push(req.body);
  await project.save();

  await project.populate('team.member', 'firstName lastName photo');

  res.status(201).json({
    success: true,
    message: 'Team member added successfully',
    data: project,
  });
});

// @desc    Remove team member from project
// @route   DELETE /api/projects/:id/team/:memberId
// @access  Private/Admin
export const removeTeamMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  project.team = project.team.filter(
    (t) => t.member.toString() !== req.params.memberId
  );

  await project.save();

  res.json({
    success: true,
    message: 'Team member removed successfully',
    data: project,
  });
});

// @desc    Add milestone to project
// @route   POST /api/projects/:id/milestones
// @access  Private/Admin
export const addMilestone = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  project.milestones.push(req.body);
  await project.save();

  res.status(201).json({
    success: true,
    message: 'Milestone added successfully',
    data: project,
  });
});

// @desc    Update milestone
// @route   PUT /api/projects/:id/milestones/:milestoneId
// @access  Private/Admin
export const updateMilestone = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  const milestone = project.milestones.id(req.params.milestoneId);

  if (!milestone) {
    return res.status(404).json({
      success: false,
      message: 'Milestone not found',
    });
  }

  Object.keys(req.body).forEach((key) => {
    milestone[key] = req.body[key];
  });

  await project.save();

  res.json({
    success: true,
    message: 'Milestone updated successfully',
    data: project,
  });
});

// @desc    Delete milestone
// @route   DELETE /api/projects/:id/milestones/:milestoneId
// @access  Private/Admin
export const deleteMilestone = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  project.milestones.pull(req.params.milestoneId);
  await project.save();

  res.json({
    success: true,
    message: 'Milestone deleted successfully',
    data: project,
  });
});

// @desc    Add project update
// @route   POST /api/projects/:id/updates
// @access  Private/Admin
export const addProjectUpdate = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  const update = {
    ...req.body,
    createdBy: req.user.member,
  };

  project.updates.push(update);
  await project.save();

  await project.populate('updates.createdBy', 'firstName lastName');

  // Emit socket event for real-time update
  const io = getIO();
  io.emit('project:update', {
    projectId: project._id,
    update: project.updates[project.updates.length - 1],
    message: `New update for project "${project.name}"`,
  });

  res.status(201).json({
    success: true,
    message: 'Project update added successfully',
    data: project,
  });
});

// @desc    Update project status
// @route   PUT /api/projects/:id/status
// @access  Private/Admin
export const updateProjectStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['planning', 'active', 'completed', 'on-hold', 'cancelled'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status value',
    });
  }

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  ).populate('createdBy', 'firstName lastName');

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  // Emit socket event
  const io = getIO();
  io.emit('project:statusChanged', {
    projectId: project._id,
    status,
    message: `Project "${project.name}" status changed to ${status}`,
  });

  res.json({
    success: true,
    message: `Project status updated to ${status}`,
    data: project,
  });
});

// @desc    Get project statistics
// @route   GET /api/projects/stats/summary
// @access  Private
export const getProjectStats = asyncHandler(async (req, res) => {
  const stats = await Project.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalBudget: { $sum: '$budget.allocated' },
      },
    },
  ]);

  const typeStats = await Project.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
      },
    },
  ]);

  const total = await Project.countDocuments();

  res.json({
    success: true,
    data: {
      total,
      byStatus: stats,
      byType: typeStats,
    },
  });
});
