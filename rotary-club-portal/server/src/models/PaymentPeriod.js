import mongoose from 'mongoose';

const paymentPeriodSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Payment period title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['membership_fee', 'project_contribution', 'event_fee', 'donation', 'fine', 'other'],
      required: true,
    },
    category: {
      type: String,
      enum: ['quarterly', 'annual', 'monthly', 'one_time'],
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    finalDate: {
      type: Date,
      required: [true, 'Final date is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    fiscalYear: {
      type: String,
      required: true,
    },
    quarter: {
      type: String,
      enum: ['Q1', 'Q2', 'Q3', 'Q4', 'N/A'],
      default: 'N/A',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    autoCreatePayments: {
      type: Boolean,
      default: true,
    },
    paymentsCreated: {
      type: Boolean,
      default: false,
    },
    applicableToMembers: {
      type: String,
      enum: ['all', 'active', 'specific'],
      default: 'active',
    },
    specificMembers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
    }],
    excludeMembers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
    }],
    membershipTypes: [{
      type: String,
      enum: ['regular', 'honorary', 'charter', 'life'],
    }],
    reminderSchedule: {
      enabled: {
        type: Boolean,
        default: true,
      },
      firstReminder: {
        type: Number, // days before due date
        default: 7,
      },
      secondReminder: {
        type: Number, // days before due date
        default: 3,
      },
      finalReminder: {
        type: Number, // days before final date
        default: 1,
      },
    },
    lateFeesEnabled: {
      type: Boolean,
      default: false,
    },
    lateFees: {
      type: {
        type: String,
        enum: ['fixed', 'percentage'],
        default: 'fixed',
      },
      amount: {
        type: Number,
        default: 0,
      },
      appliedAfter: {
        type: Number, // days after due date
        default: 0,
      },
    },
    notes: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
paymentPeriodSchema.index({ fiscalYear: 1, category: 1 });
paymentPeriodSchema.index({ isActive: 1, dueDate: 1 });
paymentPeriodSchema.index({ startDate: 1, finalDate: 1 });

// Validation: finalDate must be after dueDate, dueDate must be after startDate
paymentPeriodSchema.pre('save', function (next) {
  if (this.dueDate <= this.startDate) {
    return next(new Error('Due date must be after start date'));
  }
  if (this.finalDate <= this.dueDate) {
    return next(new Error('Final date must be after due date'));
  }
  next();
});

// Virtual for status
paymentPeriodSchema.virtual('status').get(function () {
  const now = new Date();
  if (now < this.startDate) return 'upcoming';
  if (now >= this.startDate && now < this.dueDate) return 'active';
  if (now >= this.dueDate && now < this.finalDate) return 'overdue';
  if (now >= this.finalDate) return 'closed';
  return 'unknown';
});

// Virtual for days remaining
paymentPeriodSchema.virtual('daysRemaining').get(function () {
  const now = new Date();
  if (now >= this.finalDate) return 0;
  
  const targetDate = now < this.dueDate ? this.dueDate : this.finalDate;
  const diff = targetDate - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Static method to get active periods
paymentPeriodSchema.statics.getActivePeriods = async function () {
  const now = new Date();
  return this.find({
    isActive: true,
    startDate: { $lte: now },
    finalDate: { $gte: now },
  }).sort({ dueDate: 1 });
};

// Static method to get upcoming periods
paymentPeriodSchema.statics.getUpcomingPeriods = async function () {
  const now = new Date();
  return this.find({
    isActive: true,
    startDate: { $gt: now },
  }).sort({ startDate: 1 });
};

// Ensure virtuals are included in JSON
paymentPeriodSchema.set('toJSON', { virtuals: true });
paymentPeriodSchema.set('toObject', { virtuals: true });

const PaymentPeriod = mongoose.model('PaymentPeriod', paymentPeriodSchema);

export default PaymentPeriod;
