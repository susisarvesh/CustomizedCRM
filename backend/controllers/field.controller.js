import { Field } from '../models/field.model.js'; // Update the import path as necessary
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { sendWelcomeEmail } from '../mailtrap/emails.js';

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: "Gmail", // Use your preferred email service
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
    },
});

// Create a new Field engineer
export const createFieldEngineer = async (req, res) => {
    const { name, email, phone, position, companyName } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Generate a random password
        const generatedPassword = crypto.randomBytes(8).toString("hex");

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(generatedPassword, 12);

        // Generate a random verification token
        const verificationToken = crypto.randomBytes(16).toString("hex");

        // Set the verification token expiry date (e.g., 24 hours from now)
        const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Create the Field engineer, marked as verified by default
        const newField = await Field.create({
            name,
            email,
            password: hashedPassword,
            phone,
            position,
            companyName,
            isVerified: true, // Mark Field engineer as verified
            verifiedAt: new Date(), // Optionally store the verification timestamp
            verificationToken,
            verificationTokenExpiresAt,
            isField: true, // Explicitly set this to indicate that this is a Field engineer
        });

        // Send a welcome email with login details
        await sendWelcomeEmail(email, name, generatedPassword); // Include generated password in the email

        res.status(201).json({ message: "Field engineer created and welcome email sent", field: newField });
    } catch (error) {
        res.status(500).json({ message: "Error creating field engineer", error: error.message });
    }
};

// Get all Field engineers
export const getFieldEngineers = async (req, res) => {
    try {
        const fields = await Field.find();
        res.status(200).json(fields);
    } catch (error) {
        res.status(500).json({ message: "Error fetching field engineers", error: error.message });
    }
};

// Get Field engineer by ID
export const getFieldEngineerById = async (req, res) => {
    const { id } = req.params;

    try {
        const field = await Field.findById(id);

        if (!field) {
            return res.status(404).json({ message: "Field engineer not found" });
        }

        res.status(200).json(field);
    } catch (error) {
        res.status(500).json({ message: "Error fetching field engineer", error: error.message });
    }
};

// Update a Field engineer by ID
export const updateFieldEngineer = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, position, companyName } = req.body;

    try {
        const updatedField = await Field.findByIdAndUpdate(
            id,
            { name, email, phone, position, companyName },
            { new: true } // Returns the updated document
        );

        if (!updatedField) {
            return res.status(404).json({ message: "Field engineer not found" });
        }

        res.status(200).json(updatedField);
    } catch (error) {
        res.status(500).json({ message: "Error updating field engineer", error: error.message });
    }
};

// Delete a Field engineer by ID
export const deleteFieldEngineer = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedField = await Field.findByIdAndDelete(id);

        if (!deletedField) {
            return res.status(404).json({ message: "Field engineer not found" });
        }

        res.status(200).json({ message: "Field engineer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting field engineer", error: error.message });
    }
};
