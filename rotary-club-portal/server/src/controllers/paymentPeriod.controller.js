import PaymentPeriod from '../models/PaymentPeriod.js';
import Payment from '../models/Payment.js';
import Member from '../models/Member.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Create new payment period
// @route   POST /api/payment-periods
// @access  Private (Admin - President, Secretary, Treasurer)
export const createPaymentPeriod = asyncHandler(async (req, res) => {
  const {
    title,
    type,
    category,
    amount,
    currency,
    startDate,
    dueDate,
    finalDate,
    description,
    fiscalYear,
    quarter,
    applicableToMembers,
    specificMembers,
    excludeMembers,
    membershipTypes,
    reminderSchedule,
    lateFeesEnabled,
    lateFees,
    autoCreatePayments,
    notes,
  } = req.body;

  // Validation
  if (!title || !type || !category || !amount || !startDate || !dueDate || !finalDate || !fiscalYear) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  // Validate dates
  const start = new Date(startDate);
  const due = new Date(dueDate);
  const final = new Date(finalDate);

  if (due <= start) {
    return res.status(400).json({
      success: false,
      message: 'Due date must be after start date',
    });
  }
  if (final <= due) {
    return res.status(400).json({
      success: false,
      message: 'Final date must be after due date',
    });
  }

  // Create payment period
  const paymentPeriod = await PaymentPeriod.create({
    title,
    type,
    category,
    amount,
    currency: currency || 'INR',
    startDate: start,
    dueDate: due,
    finalDate: final,
    description,
    fiscalYear,
    quarter: quarter || 'N/A',
    applicableToMembers: applicableToMembers || 'active',
    specificMembers: specificMembers || [],
    excludeMembers: excludeMembers || [],
    membershipTypes: membershipTypes || [],
    reminderSchedule: reminderSchedule || {
      enabled: true,
      firstReminder: 7,
      secondReminder: 3,
      finalReminder: 1,
    },
    lateFeesEnabled: lateFeesEnabled || false,
    lateFees: lateFees || { type: 'fixed', amount: 0, appliedAfter: 0 },
    autoCreatePayments: autoCreatePayments !== false,
    notes,
    createdBy: req.user._id,
  });

  // Auto-create payments if enabled
  if (paymentPeriod.autoCreatePayments) {
    await createPaymentsForPeriod(paymentPeriod);
  }

  res.status(201).json({
    success: true,
    data: paymentPeriod,
    message: 'Payment period created successfully',
  });
});

// @desc    Get all payment periods
// @route   GET /api/payment-periods
// @access  Private
export const getPaymentPeriods = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    fiscalYear,
    category,
    type,
    isActive,
  } = req.query;

  const query = {};

  // Apply filters
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  if (fiscalYear) {
    query.fiscalYear = fiscalYear;
  }

  if (category) {
    query.category = category;
  }

  if (type) {
    query.type = type;
  }

  // Apply status filter
  if (status) {
    const now = new Date();
    switch (status) {
      case 'upcoming':
        query.startDate = { $gt: now };
        break;
      case 'active':
        query.startDate = { $lte: now };
        query.dueDate = { $gt: now };
        break;
      case 'overdue':
        query.dueDate = { $lte: now };
        query.finalDate = { $gt: now };
        break;
      case 'closed':
        query.finalDate = { $lte: now };
        break;
    }
  }

  const skip = (page - 1) * limit;

  const [periods, total] = await Promise.all([
    PaymentPeriod.find(query)
      .populate('createdBy', 'email')
      .populate('updatedBy', 'email')
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    PaymentPeriod.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      periods,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
    message: 'Payment periods fetched successfully',
  });
});

// @desc    Get single payment period
// @route   GET /api/payment-periods/:id
// @access  Private
export const getPaymentPeriod = asyncHandler(async (req, res) => {
  const period = await PaymentPeriod.findById(req.params.id)
    .populate('createdBy', 'email')
    .populate('updatedBy', 'email')
    .populate('specificMembers', 'firstName lastName memberId')
    .populate('excludeMembers', 'firstName lastName memberId');

  if (!period) {
    return res.status(404).json({
      success: false,
      message: 'Payment period not found',
    });
  }

  // Get payment statistics for this period
  const paymentStats = await Payment.aggregate([
    {
      $match: {
        'period.start': period.startDate,
        'period.end': period.finalDate,
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      period,
      paymentStats,
    },
    message: 'Payment period fetched successfully',
  });
});

// @desc    Update payment period
// @route   PUT /api/payment-periods/:id
// @access  Private (Admin - President, Secretary, Treasurer)
export const updatePaymentPeriod = asyncHandler(async (req, res) => {
  const period = await PaymentPeriod.findById(req.params.id);

  if (!period) {
    return res.status(404).json({
      success: false,
      message: 'Payment period not found',
    });
  }

  // Validate dates if provided
  const startDate = req.body.startDate ? new Date(req.body.startDate) : period.startDate;
  const dueDate = req.body.dueDate ? new Date(req.body.dueDate) : period.dueDate;
  const finalDate = req.body.finalDate ? new Date(req.body.finalDate) : period.finalDate;

  if (dueDate <= startDate) {
    return res.status(400).json({
      success: false,
      message: 'Due date must be after start date',
    });
  }
  if (finalDate <= dueDate) {
    return res.status(400).json({
      success: false,
      message: 'Final date must be after due date',
    });
  }

  // Update fields
  const allowedUpdates = [
    'title', 'description', 'amount', 'startDate', 'dueDate', 'finalDate',
    'isActive', 'reminderSchedule', 'lateFeesEnabled', 'lateFees',
    'applicableToMembers', 'specificMembers', 'excludeMembers', 'membershipTypes', 'notes'
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      period[field] = req.body[field];
    }
  });

  period.updatedBy = req.user._id;
  await period.save();

  res.status(200).json({
    success: true,
    data: period,
    message: 'Payment period updated successfully',
  });
});

// @desc    Delete payment period
// @route   DELETE /api/payment-periods/:id
// @access  Private (Admin - President, Secretary, Treasurer)
export const deletePaymentPeriod = asyncHandler(async (req, res) => {
  const period = await PaymentPeriod.findById(req.params.id);

  if (!period) {
    return res.status(404).json({
      success: false,
      message: 'Payment period not found',
    });
  }

  // Check if there are any completed payments associated with this period
  const completedPayments = await Payment.countDocuments({
    'period.start': period.startDate,
    'period.end': period.finalDate,
    status: 'completed',
  });

  if (completedPayments > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete payment period with completed payments. Consider deactivating instead.',
    });
  }

  await period.deleteOne();

  res.status(200).json({
    success: true,
    data: null,
    message: 'Payment period deleted successfully',
  });
});

// @desc    Create payments for all applicable members
// @route   POST /api/payment-periods/:id/create-payments
// @access  Private (Admin - President, Secretary, Treasurer)
export const createPaymentsForPeriod = async (period) => {
  try {
    // Build member query based on applicableToMembers
    let memberQuery = { status: 'active' };

    if (period.applicableToMembers === 'all') {
      memberQuery = {};
    } else if (period.applicableToMembers === 'specific') {
      memberQuery._id = { $in: period.specificMembers };
    }

    // Apply membership type filter
    if (period.membershipTypes && period.membershipTypes.length > 0) {
      memberQuery.membershipType = { $in: period.membershipTypes };
    }

    // Exclude specific members
    if (period.excludeMembers && period.excludeMembers.length > 0) {
      memberQuery._id = { ...memberQuery._id, $nin: period.excludeMembers };
    }

    // Get applicable members
    const members = await Member.find(memberQuery);

    // Create payments for each member
    const paymentPromises = members.map(async (member) => {
      // Check if payment already exists
      const existingPayment = await Payment.findOne({
        member: member._id,
        'period.start': period.startDate,
        'period.end': period.finalDate,
        type: period.type,
      });

      if (existingPayment) {
        return null; // Skip if payment already exists
      }

      return Payment.create({
        member: member._id,
        type: period.type,
        category: period.category,
        amount: period.amount,
        currency: period.currency,
        status: 'pending',
        dueDate: period.dueDate,
        period: {
          start: period.startDate,
          end: period.finalDate,
        },
        quarter: period.quarter !== 'N/A' ? period.quarter : undefined,
        fiscalYear: period.fiscalYear,
        description: period.description || period.title,
      });
    });

    const createdPayments = await Promise.all(paymentPromises);
    const validPayments = createdPayments.filter((p) => p !== null);

    // Mark payments as created
    if (!period.paymentsCreated) {
      period.paymentsCreated = true;
      await period.save();
    }

    return validPayments;
  } catch (error) {
    console.error('Error creating payments for period:', error);
    throw error;
  }
};

// Endpoint to manually trigger payment creation
export const triggerPaymentCreation = asyncHandler(async (req, res) => {
  const period = await PaymentPeriod.findById(req.params.id);

  if (!period) {
    return res.status(404).json({
      success: false,
      message: 'Payment period not found',
    });
  }

  const createdPayments = await createPaymentsForPeriod(period);

  res.status(200).json({
    success: true,
    data: {
      count: createdPayments.length,
      payments: createdPayments,
    },
    message: `${createdPayments.length} payments created successfully`,
  });
});

// @desc    Get active and upcoming periods for dashboard
// @route   GET /api/payment-periods/dashboard/summary
// @access  Private
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const [activePeriods, upcomingPeriods] = await Promise.all([
    PaymentPeriod.getActivePeriods(),
    PaymentPeriod.getUpcomingPeriods(),
  ]);

  res.status(200).json({
    success: true,
    data: {
      active: activePeriods,
      upcoming: upcomingPeriods,
    },
    message: 'Dashboard summary fetched successfully',
  });
});
