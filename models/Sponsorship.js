import mongoose from 'mongoose';

const SponsorshipSchema = new mongoose.Schema({
    sponsorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sponsorName: String,
    title: {
        type: String,
        required: true,
    },
    description: String,
    budget: String,
    timeline: String,
    skills: [String],
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Sponsorship || mongoose.model('Sponsorship', SponsorshipSchema);
