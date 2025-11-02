const express = require('express');
const Certificate = require('../models/Certificate');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/certificates
// @desc    Get all visible certificates
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

    const pageSize = parseInt(limit) || 50;
    const skip = (parseInt(page) - 1) * pageSize;

    const certificates = await Certificate.find(filter)
      .sort({ order: 1, issueDate: -1 })
      .limit(pageSize)
      .skip(skip);

    const total = await Certificate.countDocuments(filter);

    res.json({
      certificates,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / pageSize),
        total,
        hasNext: skip + pageSize < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/certificates/admin
// @desc    Get all certificates for admin
// @access  Private (Admin)
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ order: 1, issueDate: -1 });
    res.json(certificates);
  } catch (error) {
    console.error('Get admin certificates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/certificates/:id
// @desc    Get single certificate
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ 
      _id: req.params.id, 
      isVisible: true 
    });
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.json(certificate);
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/certificates
// @desc    Create new certificate
// @access  Private (Admin)
router.post('/', adminAuth, async (req, res) => {
  try {
    const certificate = new Certificate(req.body);
    await certificate.save();
    res.status(201).json({ message: 'Certificate created successfully', certificate });
  } catch (error) {
    console.error('Create certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/certificates/:id
// @desc    Update certificate
// @access  Private (Admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.json({ message: 'Certificate updated successfully', certificate });
  } catch (error) {
    console.error('Update certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/certificates/:id
// @desc    Delete certificate
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/certificates/:id/toggle-visibility
// @desc    Toggle certificate visibility
// @access  Private (Admin)
router.put('/:id/toggle-visibility', adminAuth, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    certificate.isVisible = !certificate.isVisible;
    await certificate.save();
    
    res.json({ 
      message: `Certificate ${certificate.isVisible ? 'shown' : 'hidden'} successfully`, 
      certificate 
    });
  } catch (error) {
    console.error('Toggle visibility error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
