import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js"; // Your templates
import { transporter, sender } from "./nodemailer.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
	const mailOptions = {
		from: sender,
		to: email,
		subject: "Verify your email",
		html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
	};

	try {
		const response = await transporter.sendMail(mailOptions);
		console.log("Verification email sent successfully", response);
	} catch (error) {
		console.error(`Error sending verification email`, error);
		throw new Error(`Error sending verification email: ${error.message}`);
	}
};

export const sendWelcomeEmail = async (email, name, password) => {

    try {
        const response = await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Welcome to Vsmart Technologies,",
            html: `
                <p>Thank you for signing up with Vsmart Technologies.${name}</p>
                <p>Your login details are as follows:</p>
                <ul>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Password:</strong> ${password}</li>
                </ul>
                <p>We recommend changing your password after your first login.</p>
                <p>© Vsmart Technologies</p>
            `,
        });

        console.log("Welcome email sent successfully", response);
    } catch (error) {
        console.error(`Error sending welcome email`, error);
        throw new Error(`Error sending welcome email: ${error.message}`);
    }
};



export const sendPasswordResetEmail = async (email, resetURL) => {
	const mailOptions = {
		from: sender,
		to: email,
		subject: "Reset your password",
		html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
	};

	try {
		const response = await transporter.sendMail(mailOptions);
		console.log("Password reset email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset email`, error);
		throw new Error(`Error sending password reset email: ${error.message}`);
	}
};

export const sendResetSuccessEmail = async (email) => {
	const mailOptions = {
		from: sender,
		to: email,
		subject: "Password Reset Successful",
		html: PASSWORD_RESET_SUCCESS_TEMPLATE,
	};

	try {
		const response = await transporter.sendMail(mailOptions);
		console.log("Password reset success email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset success email`, error);
		throw new Error(`Error sending password reset success email: ${error.message}`);
	}
};
