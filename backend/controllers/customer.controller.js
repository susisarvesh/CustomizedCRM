import { Customer } from '../models/customer.model.js'; // Update the import path as necessary
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

// Create a new customer
export const createCustomer = async (req, res) => {
    const { name, email, phone, address, companyName } = req.body;

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

        // Create the customer, marked as verified by default
        const newCustomer = await Customer.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            companyName,
            isVerified: true, // Mark customer as verified
            verifiedAt: new Date(), // Optionally store the verification timestamp
            verificationToken,
            verificationTokenExpiresAt,
        });

        // Send a welcome email with login details
        await sendWelcomeEmail(email, name, generatedPassword); // Include generated password in the email

        res.status(201).json({ message: "Customer created and welcome email sent", customer: newCustomer });
    } catch (error) {
        res.status(500).json({ message: "Error creating customer", error: error.message });
    }
};

// Get all customers
export const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching customers", error: error.message });
    }
};

// Get customer by ID
export const getCustomerById = async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await Customer.findById(id);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: "Error fetching customer", error: error.message });
    }
};

// Update a customer by ID
export const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address, companyName } = req.body;

    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            { name, email, phone, address, companyName },
            { new: true } // Returns the updated document
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: "Error updating customer", error: error.message });
    }
};

// Delete a customer by ID
export const deleteCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCustomer = await Customer.findByIdAndDelete(id);

        if (!deletedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting customer", error: error.message });
    }
};
