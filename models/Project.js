import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sellerName: String, // Denormalized for easier display
    title: {
        type: String,
        required: true,
    },
    description: String,
    price: Number,
    category: String,
    techStack: [String],
    images: [String],
    demoVideo: String,
    liveUrl: String,
    status: {
        type: String,
        enum: ['available', 'sold'],
        default: 'available',
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
