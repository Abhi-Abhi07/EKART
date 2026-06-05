// import nodemailer from "nodemailer"
// import "dotenv/config"

// export const verifyEmail = (token,email)=>{
//     // const transporter = nodemailer.createTransport({
//     //     service : "gmail",
//     //     auth :{
//     //         user : process.env.USER_MAIL,
//     //         pass : process.env.USER_PASS,
//     //     }
//     // });
// const transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false, // false for port 587 (uses STARTTLS)
//         auth: {
//             user: process.env.USER_MAIL,
//             pass: process.env.USER_PASS,
//         },
//         tls: {
//             ciphers: 'SSLv3',
//             rejectUnauthorized: false
//         }
//     });

//     const mailConfigurations = {

//         // It should be a string of sender/server email
//         from: process.env.USER_MAIL,

//         to: email,

//         // Subject of Email
//         subject: 'Email Verification',
        
//         // This would be the text of email body
//         text: `Hi! There, You have recently visited 
//             our website and entered your email.
//             Please follow the given link to verify your email
//             ${process.env.CLIENT_URL}/verify/${token} 
//             Thanks`
//     };
//     transporter.sendMail(mailConfigurations, function(error, info) {
//         if (error) {
//             // Log it safely to your Render terminal instead of throwing a fatal error
//             console.error('❌ Failed to send verification email:', error.message);
//             return; 
//         }
//         console.log('✅ Email Sent Successfully');
//         console.log(info);
//     });
// }

import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_LOGIN,
        pass: process.env.BREVO_SMTP_KEY,
    },
});

export const verifyEmail = async (token, email) => {
    try {
        const verificationLink =
            `${process.env.CLIENT_URL}/verify/${token}`;

        const info = await transporter.sendMail({
            from: "gurjarabhishek406@gmail.com", // verified sender in Brevo
            to: email,
            subject: "Verify Your Email",
            html: `
                <h2>Email Verification</h2>
                <p>Thank you for registering.</p>
                <p>Click the button below to verify your email:</p>

                <a
                    href="${verificationLink}"
                    style="
                        display:inline-block;
                        padding:10px 20px;
                        background:#2563eb;
                        color:white;
                        text-decoration:none;
                        border-radius:5px;
                    "
                >
                    Verify Email
                </a>

                <p>If you didn't create an account, you can ignore this email.</p>
            `,
        });

        console.log("✅ Email Sent Successfully");
        console.log(info.messageId);

        return true;

    } catch (err) {
        console.error("❌ Failed to send verification email:", err);
        return false;
    }
};