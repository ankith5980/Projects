import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    type: {
      type: String,
      enum: ['membership_fee', 'project_contribution', 'fine', 'donation', 'event_fee', 'other'],
      required: true,
    },
    category: {
      type: String,
      enum: ['quarterly', 'annual', 'one_time', 'recurring'],
      default: 'one_time',
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
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cash', 'bank_transfer', 'cheque', 'other'],
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    transactionId: String,
    dueDate: Date,
    paidDate: Date,
    period: {
      start: Date,
      end: Date,
    },
    quarter: {
      type: String,
      enum: ['Q1', 'Q2', 'Q3', 'Q4'],
    },
    fiscalYear: String,
    description: String,
    notes: String,
    invoice: {
      number: String,
      url: String,
      generatedAt: Date,
    },
    receipt: {
      number: String,
      url: String,
      generatedAt: Date,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringConfig: {
      frequency: {
        type: String,
        enum: ['monthly', 'quarterly', 'annually'],
      },
      nextPaymentDate: Date,
      endDate: Date,
    },
    remindersSent: {
      type: Number,
      default: 0,
    },
    lastReminderDate: Date,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
paymentSchema.index({ member: 1, status: 1 });
paymentSchema.index({ status: 1, dueDate: 1 });
paymentSchema.index({ type: 1, fiscalYear: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ razorpayPaymentId: 1 });

// Virtual for overdue status
paymentSchema.virtual('isOverdue').get(function () {
  if (this.status === 'completed') return false;
  if (!this.dueDate) return false;
  return new Date() > this.dueDate;
});

// Virtual for days overdue
paymentSchema.virtual('daysOverdue').get(function () {
  if (!this.isOverdue) return 0;
  const diff = new Date() - this.dueDate;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to generate invoice/receipt numbers
paymentSchema.pre('save', async function (next) {
  if (this.isNew && !this.invoice.number) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Payment').countDocuments({
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1),
      },
    });
    this.invoice.number = `INV-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  if (this.status === 'completed' && !this.receipt.number) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Payment').countDocuments({
      status: 'completed',
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1),
      },
    });
    this.receipt.number = `REC-${year}-${String(count + 1).padStart(5, '0')}`;
    this.receipt.generatedAt = new Date();
  }

  next();
});

// Static method to get payment statistics
paymentSchema.statics.getStatistics = async function (filters = {}) {
  const stats = await this.aggregate([
    { $match: filters },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);

  return stats;
};

// Ensure virtuals are included in JSON
paymentSchema.set('toJSON', { virtuals: true });
paymentSchema.set('toObject', { virtuals: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
