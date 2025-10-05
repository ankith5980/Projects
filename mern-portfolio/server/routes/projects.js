const express = require('express');
const Project = require('../models/Project');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/projects
// @desc    Get all visible projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, featured, limit, page = 1 } = req.query;
    
    let filter = { isVisible: true };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (featured === 'true') {
      filter.featured = true;
    }

    const pageSize = parseInt(limit) || 10;
    const skip = (parseInt(page) - 1) * pageSize;

    const projects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .limit(pageSize)
      .skip(skip);

    const total = await Project.countDocuments(filter);

    res.json({
      projects,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / pageSize),
        total,
        hasNext: skip + pageSize < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/admin
// @desc    Get all projects for admin
// @access  Private (Admin)
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Get admin projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id, 
      isVisible: true 
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Admin)
router.post('/', adminAuth, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({ message: 'Project updated successfully', project });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id/toggle-visibility
// @desc    Toggle project visibility
// @access  Private (Admin)
router.put('/:id/toggle-visibility', adminAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    project.isVisible = !project.isVisible;
    await project.save();
    
    res.json({ 
      message: `Project ${project.isVisible ? 'shown' : 'hidden'} successfully`, 
      project 
    });
  } catch (error) {
    console.error('Toggle visibility error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;