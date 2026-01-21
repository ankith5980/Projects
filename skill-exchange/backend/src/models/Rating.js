import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.ObjectId,
        ref: 'Session',
        required: true
    },
    skill: {
        type: mongoose.Schema.ObjectId,
        ref: 'Skill',
        required: true
    },
    rater: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    rated: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating'],
        min: 1,
        max: 5
    },
    review: {
        type: String,
        maxlength: [500, 'Review cannot be more than 500 characters']
    },
    type: {
        type: String,
        enum: ['teacher', 'student'], // Who is being rated
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate ratings for the same session by the same rater
ratingSchema.index({ session: 1, rater: 1 }, { unique: true });

// Static method to calculate average rating for a user
ratingSchema.statics.calcAverageRating = async function (userId) {
    const stats = await this.aggregate([
        { $match: { rated: userId } },
        {
            $group: {
                _id: '$rated',
                averageRating: { $avg: '$rating' },
                totalRatings: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await mongoose.model('User').findByIdAndUpdate(userId, {
            averageRating: Math.round(stats[0].averageRating * 10) / 10,
            totalRatings: stats[0].totalRatings
        });
    }
};

// Static method to calculate average rating for a skill
ratingSchema.statics.calcSkillRating = async function (skillId) {
    const stats = await this.aggregate([
        { $match: { skill: skillId } },
        {
            $group: {
                _id: '$skill',
                averageRating: { $avg: '$rating' },
                totalRatings: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await mongoose.model('Skill').findByIdAndUpdate(skillId, {
            averageRating: Math.round(stats[0].averageRating * 10) / 10,
            totalRatings: stats[0].totalRatings
        });
    }
};

// Call calcAverageRating after save
ratingSchema.post('save', function () {
    this.constructor.calcAverageRating(this.rated);
    this.constructor.calcSkillRating(this.skill);
});

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;
