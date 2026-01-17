import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
    sponsorshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sponsorship',
        required: true,
    },
    developerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    developerName: String,
    intro: String,
    contactNumber: String,
    portfolioUrl: String,
    resumeUrl: String,
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
