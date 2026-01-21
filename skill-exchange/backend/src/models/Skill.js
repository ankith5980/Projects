import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a skill title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: [
            'Programming',
            'Design',
            'Marketing',
            'Music',
            'Languages',
            'Business',
            'Photography',
            'Writing',
            'Fitness',
            'Cooking',
            'Arts & Crafts',
            'Finance',
            'Science',
            'Other'
        ]
    },
    teacher: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    pointsCost: {
        type: Number,
        required: [true, 'Please add points cost'],
        min: [5, 'Minimum cost is 5 points'],
        max: [500, 'Maximum cost is 500 points']
    },
    duration: {
        type: Number, // Duration in minutes
        required: [true, 'Please add session duration'],
        min: [15, 'Minimum duration is 15 minutes'],
        max: [180, 'Maximum duration is 180 minutes']
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
        default: 'All Levels'
    },
    availability: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        startTime: String,
        endTime: String
    }],
    tags: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    totalBookings: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalRatings: {
        type: Number,
        default: 0
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
skillSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create index for search
skillSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
