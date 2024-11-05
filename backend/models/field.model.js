// models/Support.js
import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema({
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
    assignedTickets: [{ // Array to store ticket IDs assigned to the field engineer
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CustomerTicket',
    }],
    isAvailable: { // Field to track engineer's availability
        type: Boolean,
        default: true,
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
    isField: { // New field to indicate support users
        type: Boolean,
        default: true, // Set to true for support users
    },
    resetPasswordToken: String,
	resetPasswordExpiresAt: Date,
}, { timestamps: true }); 

// Make sure the model name matches the export name
export const Field = mongoose.model("Field", FieldSchema);
