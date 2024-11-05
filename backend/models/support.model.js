// models/Support.js
import mongoose from "mongoose";

const SupportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    position: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    companyName: {
        type: String,
        required: true,
        trim: true,
    },
    isVerified: {
        type: Boolean,
        default: true, // Default to true, adjust if necessary
    },
    verificationToken: {
        type: String,
        required: true,
    },
    verificationTokenExpiresAt: {
        type: Date,
        required: true,
    },
    isSupport: { // New field to indicate support users
        type: Boolean,
        default: true, // Set to true for support users
    },
    resetPasswordToken: String,
	resetPasswordExpiresAt: Date,
}, { timestamps: true });

// Make sure the model name matches the export name
export const Support = mongoose.model("Support", SupportSchema);
