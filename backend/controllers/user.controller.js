import { Support } from '../models/support.model.js'; // Update the import path as necessary
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

// Create a new support user
export const createUser = async (req, res) => {
    const { name, position, email, phone, companyName } = req.body;

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

        // Create the support user, marked as verified by default
        const newUser = await Support.create({
            name,
            position,
            email,
            password: hashedPassword,
            phone,
            companyName,
            isVerified: true, // Mark user as verified
            verifiedAt: new Date(), // Optionally store the verification timestamp
            verificationToken,
            verificationTokenExpiresAt,
        });

        // Send a welcome email with login details
        await sendWelcomeEmail(email, name, generatedPassword); // Include generated password in the email

        res.status(201).json({ message: "Support user created and welcome email sent", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error creating support user", error: error.message });
    }
};
// Get all support users
export const getUsers = async (req, res) => {
    try {
        const users = await Support.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching support users", error: error.message });
    }
};

// Get support user by ID
export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await Support.findById(id);

        if (!user) {
            return res.status(404).json({ message: "Support user not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching support user", error: error.message });
    }
};

// Update a support user by ID
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, position, email, phone, companyName } = req.body;

    try {
        const updatedUser = await Support.findByIdAndUpdate(
            id,
            { name, position, email, phone, companyName },
            { new: true } // Returns the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Support user not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating support user", error: error.message });
    }
};

// Delete a support user by ID
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await Support.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "Support user not found" });
        }

        res.status(200).json({ message: "Support user deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting support user", error: error.message });
    }
};
