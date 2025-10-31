import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    category: {
      type: String,
      enum: [
        'community_service',
        'vocational_service',
        'international_service',
        'youth_service',
        'environment',
        'education',
        'health',
        'water_sanitation',
        'disaster_relief',
        'other',
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ['planning', 'ongoing', 'completed', 'cancelled'],
      default: 'planning',
    },
    type: {
      type: String,
      enum: ['past', 'upcoming', 'recurring'],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    location: {
      address: String,
      city: String,
      state: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    budget: {
      estimated: {
        type: Number,
        default: 0,
      },
      actual: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: 'INR',
      },
    },
    images: [
      {
        url: String,
        caption: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    documents: [
      {
        name: String,
        url: String,
        type: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    team: [
      {
        member: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Member',
        },
        role: String,
      },
    ],
    volunteers: [
      {
        member: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Member',
        },
        hoursContributed: {
          type: Number,
          default: 0,
        },
      },
    ],
    beneficiaries: {
      count: {
        type: Number,
        default: 0,
      },
      description: String,
    },
    partners: [
      {
        name: String,
        type: {
          type: String,
          enum: ['sponsor', 'collaborator', 'vendor', 'other'],
        },
        contribution: String,
      },
    ],
    milestones: [
      {
        title: String,
        description: String,
        targetDate: Date,
        completedDate: Date,
        status: {
          type: String,
          enum: ['pending', 'in_progress', 'completed'],
          default: 'pending',
        },
      },
    ],
    updates: [
      {
        title: String,
        content: String,
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Member',
        },
        postedAt: {
          type: Date,
          default: Date.now,
        },
        images: [String],
      },
    ],
    impact: {
      description: String,
      metrics: [
        {
          name: String,
          value: String,
        },
      ],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    tags: [String],
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
projectSchema.index({ status: 1, type: 1 });
projectSchema.index({ startDate: -1 });
projectSchema.index({ coordinator: 1 });
projectSchema.index({ category: 1 });

// Virtual for project duration in days
projectSchema.virtual('durationDays').get(function () {
  if (!this.endDate) return null;
  const diff = this.endDate - this.startDate;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Virtual for budget variance
projectSchema.virtual('budgetVariance').get(function () {
  if (!this.budget.estimated || !this.budget.actual) return null;
  return this.budget.actual - this.budget.estimated;
});

// Ensure virtuals are included in JSON
projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;
