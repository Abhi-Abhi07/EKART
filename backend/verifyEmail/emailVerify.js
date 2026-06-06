import nodemailer from "nodemailer"
import "dotenv/config"

export const verifyEmail = async (token, email) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_MAIL,
            pass: process.env.USER_PASS,
        }
    });

    const mailConfigurations = {
        from: process.env.USER_MAIL?.trim(),
        to: email,
        subject: 'Email Verification',
        text: `Hi! There,\n\nYou have recently visited our website and entered your email. Please follow the given link to verify your email:\n\n${process.env.CLIENT_URL}/verify/${token}\n\nThanks!`
    };
    try {
        const info = await transporter.sendMail(mailConfigurations);
        console.log('✅ Email Sent Successfully');
        return { success: true, info };
    } catch (error) {
        console.error('❌ Failed to send verification email:', error.message);
        return { success: false, error: error.message };
    }
}