import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
    sendPasswordResetEmail,
    sendResetSuccessEmail,
    sendVerificationEmail,
    sendWelcomeEmail,
} from "../mailtrap/emails.js";
import { User } from "../models/user.model.js"; // Regular User model
import { Support } from "../models/support.model.js"; // Support User model
import { Customer } from "../models/customer.model.js"; // Customer model
import { Field } from "../models/field.model.js"; // Field Engineer model

// Signup Controller
export const signup = async (req, res) => {
    const { email, password, name, isSupport, isCustomer, isField } = req.body; // Accept flags

    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }

        // Choose the model based on user type
        let userModel;
        if (isSupport) {
            userModel = Support;
        } else if (isCustomer) {
            userModel = Customer;
        } else if (isField) {
            userModel = Field; // Use the Field model for Field Engineers
        } else {
            userModel = User; // Default to regular User
        }

        const userAlreadyExists = await userModel.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new userModel({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            isField, // Save the isField flag
        });

        await user.save();

        // Generate JWT token and set cookie
        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Verify Email Controller
export const verifyEmail = async (req, res) => {
    const { code, isSupport, isCustomer, isField } = req.body; // Accept flags
    try {
        // Choose the model based on user type
        let userModel;
        if (isSupport) {
            userModel = Support;
        } else if (isCustomer) {
            userModel = Customer;
        } else if (isField) {
            userModel = Field; // Use the Field model for Field Engineers
        } else {
            userModel = User; // Default to regular User
        }

        const user = await userModel.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log("Error in verifyEmail ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Login Controller
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check in the regular User collection first
        let user = await User.findOne({ email });

        // If user not found, check in the Support collection
        if (!user) {
            user = await Support.findOne({ email });
        }

        // If user not found, check in the Customer collection
        if (!user) {
            user = await Customer.findOne({ email });
        }

        // If user not found, check in the Field collection (Field Engineers)
        if (!user) {
            user = await Field.findOne({ email });
        }

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Generate token and set cookie
        generateTokenAndSetCookie(res, user._id,user.email);

        // Redirect based on user type: Support, Field Engineer, Customer, or regular user
        if (user.isVerified) {
            res.status(200).json({
                success: true,
                message: "Logged in successfully",
                user: {
                    ...user._doc,
                    password: undefined,
                },
                redirectTo: user.isSupport
                    ? '/supports'
                    : user.isField
                    ? '/field-dashboard' // Redirect Field Engineers to a specific route
                    : user.isCustomer
                    ? '/customer-dashboard/tickets'
                    : '/dashboard', // Determine redirect route for regular users
            });
        } else {
            return res.status(403).json({
                success: false,
                message: "User is not verified",
            });
        }
    } catch (error) {
        console.log("Error in login ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Logout Controller
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Forgot Password Controller
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        let user = await User.findOne({ email });

        // If not found in User, check Support
        if (!user) {
            user = await Support.findOne({ email });
        }
        if (!user) {
            user = await Customer.findOne({ email });
        }
        if (!user) {
            user = await Field.findOne({ email }); // Check for Field Engineers
        }
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
        console.log("User found for forgot password:", user);
        console.log("Reset Token:", resetToken);
        console.log("Reset Token Expiration:", resetTokenExpiresAt);

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save(); // Ensure the user document is updated

        // Send email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
        console.log("Error in forgotPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Reset Password Controller
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        console.log("Received token:", token);

        let user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        // If not found in User, check Support
        if (!user) {
            user = await Support.findOne({
                resetPasswordToken: token,
                resetPasswordExpiresAt: { $gt: Date.now() },
            });
        }
        if (!user) {
            user = await Customer.findOne({
                resetPasswordToken: token,
                resetPasswordExpiresAt: { $gt: Date.now() },
            });
        }
        if (!user) {
            user = await Field.findOne({
                resetPasswordToken: token,
                resetPasswordExpiresAt: { $gt: Date.now() },
            }); // Check for Field Engineers
        }

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        // Update password
        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log("Error in resetPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Check Auth Controller
export const checkAuth = async (req, res) => {
    try {
        // Check in the User collection first
        let user = await User.findById(req.userId).select("-password");
        
        // If not found, check in the Support collection
        if (!user) {
            user = await Support.findById(req.userId).select("-password");
        }

        // If not found, check in the Customer collection
        if (!user) {
            user = await Customer.findById(req.userId).select("-password");
        }

        // If not found, check in the Field collection (Field Engineers)
        if (!user) {
            user = await Field.findById(req.userId).select("-password");
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in checkAuth ", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
