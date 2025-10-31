import mongoose from 'mongoose';

const familyMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  relationship: {
    type: String,
    enum: ['spouse', 'child'],
    required: true,
  },
  dateOfBirth: Date,
  phone: String,
  email: String,
  photo: String,
  occupation: String,
  bloodGroup: String,
});

const memberSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
      unique: true,
      sparse: true, // Allow null/undefined temporarily
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    alternatePhone: String,
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    photo: {
      type: String,
      default: null,
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: {
        type: String,
        default: 'India',
      },
    },
    occupation: String,
    company: String,
    designation: String,
    classification: String, // Rotary classification
    membershipType: {
      type: String,
      enum: ['active', 'honorary', 'associate', 'inactive'],
      default: 'active',
    },
    joinDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    sponsoredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
    },
    family: [familyMemberSchema],
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    anniversaryDate: Date,
    interests: [String],
    skills: [String],
    committees: [
      {
        name: String,
        position: String,
        year: String,
      },
    ],
    awards: [
      {
        title: String,
        year: Number,
        description: String,
      },
    ],
    attendanceRate: {
      type: Number,
      default: 0,
    },
    totalMeetingsAttended: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      sparse: true, // Allow null values for members without user accounts
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'resigned'],
      default: 'active',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
memberSchema.index({ memberId: 1 });
memberSchema.index({ user: 1 });
memberSchema.index({ firstName: 1, lastName: 1 });
memberSchema.index({ status: 1 });

// Virtual for full name
memberSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
memberSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Pre-save middleware to generate memberId if not provided
memberSchema.pre('save', async function (next) {
  if (!this.memberId) {
    // Generate memberId: RCS-YYYY-XXX (e.g., RCS-2024-001)
    const year = new Date().getFullYear();
    const count = await mongoose.model('Member').countDocuments();
    this.memberId = `RCS-${year}-${String(count + 1).padStart(3, '0')}`;
  }

  // Set display name if not provided
  if (!this.displayName) {
    this.displayName = this.fullName;
  }

  next();
});

// Ensure virtuals are included in JSON
memberSchema.set('toJSON', { virtuals: true });
memberSchema.set('toObject', { virtuals: true });

const Member = mongoose.model('Member', memberSchema);

export default Member;
