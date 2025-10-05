const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  bio: {
    type: String,
    required: true,
    maxlength: 1000
  },
  avatar: {
    url: String,
    public_id: String
  },
  resume: {
    url: String,
    public_id: String
  },
  location: {
    type: String,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  socialLinks: {
    github: String,
    linkedin: String,
    instagram: String,
    facebook: String,
    website: String
  },
  services: [{
    title: String,
    description: String,
    icon: String
  }],
  experience: [{
    company: String,
    position: String,
    duration: String,
    description: String,
    technologies: [String]
  }],
  education: [{
    institution: String,
    degree: String,
    duration: String,
    description: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('About', aboutSchema);