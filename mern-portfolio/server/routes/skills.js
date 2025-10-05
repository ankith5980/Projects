const express = require('express');
const Skill = require('../models/Skill');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/skills
// @desc    Get all visible skills grouped by category
// @access  Public
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find({ isVisible: true })
      .sort({ category: 1, order: 1, name: 1 });

    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
      const category = skill.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {});

    res.json(groupedSkills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/skills/admin
// @desc    Get all skills for admin
// @access  Private (Admin)
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1, name: 1 });
    res.json(skills);
  } catch (error) {
    console.error('Get admin skills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/skills/:id
// @desc    Get single skill
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    res.json(skill);
  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/skills
// @desc    Create new skill
// @access  Private (Admin)
router.post('/', adminAuth, async (req, res) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json({ message: 'Skill created successfully', skill });
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/skills/:id
// @desc    Update skill
// @access  Private (Admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    res.json({ message: 'Skill updated successfully', skill });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/skills/:id
// @desc    Delete skill
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/skills/:id/toggle-visibility
// @desc    Toggle skill visibility
// @access  Private (Admin)
router.put('/:id/toggle-visibility', adminAuth, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    skill.isVisible = !skill.isVisible;
    await skill.save();
    
    res.json({ 
      message: `Skill ${skill.isVisible ? 'shown' : 'hidden'} successfully`, 
      skill 
    });
  } catch (error) {
    console.error('Toggle visibility error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;