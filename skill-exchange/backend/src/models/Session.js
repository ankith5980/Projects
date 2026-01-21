import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    skill: {
        type: mongoose.Schema.ObjectId,
        ref: 'Skill',
        required: true
    },
    teacher: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    scheduledAt: {
        type: Date,
        required: [true, 'Please add a scheduled date and time']
    },
    duration: {
        type: Number, // Duration in minutes
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    pointsTransferred: {
        type: Number,
        required: true
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot be more than 500 characters']
    },
    meetingLink: {
        type: String,
        default: ''
    },
    teacherRated: {
        type: Boolean,
        default: false
    },
    studentRated: {
        type: Boolean,
        default: false
    },
    cancelledBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    cancellationReason: {
        type: String,
        maxlength: [500, 'Reason cannot be more than 500 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
sessionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Index for efficient queries
sessionSchema.index({ teacher: 1, status: 1 });
sessionSchema.index({ student: 1, status: 1 });
sessionSchema.index({ scheduledAt: 1 });

const Session = mongoose.model('Session', sessionSchema);

export default Session;
