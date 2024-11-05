import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

export const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com", // Gmail SMTP host
	port: 465, // 465 for SSL, or 587 for TLS
	secure: true, // true for SSL
	auth: {
		user: process.env.EMAIL_USER, // Gmail email address
		pass: process.env.EMAIL_PASS, // Gmail password or App password
	},
});

export const sender = '"Vsmart Technologies" <no-reply@authcompany.com>';
