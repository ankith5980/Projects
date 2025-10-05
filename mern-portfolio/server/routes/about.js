const express = require('express');
const About = require('../models/About');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/about
// @desc    Get about information
// @access  Public
router.get('/', async (req, res) => {
  try {
    let about = await About.findOne();
    
    if (!about) {
      // Create default about if none exists
      about = new About({
        fullName: 'Your Name',
        title: 'Full Stack Developer',
        bio: 'Passionate developer with expertise in modern web technologies.',
        email: 'your.email@example.com',
        location: 'Your City, Country',
        socialLinks: {
          github: 'https://github.com/yourusername',
          linkedin: 'https://linkedin.com/in/yourusername'
        },
        services: [
          {
            title: 'Web Development',
            description: 'Creating responsive and dynamic web applications',
            icon: 'FaCode'
          },
          {
            title: 'Mobile Development',
            description: 'Building cross-platform mobile applications',
            icon: 'FaMobile'
          }
        ]
      });
      await about.save();
    }
    
    res.json(about);
  } catch (error) {
    console.error('Get about error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/about
// @desc    Update about information
// @access  Private (Admin)
router.put('/', adminAuth, async (req, res) => {
  try {
    let about = await About.findOne();
    
    if (!about) {
      about = new About(req.body);
    } else {
      Object.assign(about, req.body);
    }
    
    await about.save();
    res.json({ message: 'About information updated successfully', about });
  } catch (error) {
    console.error('Update about error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;