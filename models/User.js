import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false // Do not return password by default
    },
    displayName: String,
    contactNumber: String,
    roles: {
        type: [String],
        default: ['developer'], // Default role
    },
    bio: String,
    skills: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
