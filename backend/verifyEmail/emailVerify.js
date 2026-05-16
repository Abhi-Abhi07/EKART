// import nodemailer from "nodemailer"
// import "dotenv/config"

// export const verifyEmail = (token,email)=>{
//     const transporter = nodemailer.createTransport({
//         service : "gmail",
//         auth :{
//             user : process.env.USER_MAIL,
//             pass : process.env.USER_PASS,
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
//             http://localhost:5173/verify/${token} 
//             Thanks`
//     };

//     transporter.sendMail(mailConfigurations, function(error, info){
//         if (error) throw Error(error);
//         console.log('Email Sent Successfully');
//         console.log(info);
//     });
// }

import nodemailer from "nodemailer"
import "dotenv/config"

export const verifyEmail = (token, email) => {
    // 💡 FIX: Switch to Port 465 with secure: true
    // This uses explicit SSL/TLS which bypasses Render's port 587 firewall blocks.
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Must be TRUE for port 465
        auth: {
            user: process.env.USER_MAIL,
            pass: process.env.USER_PASS,
        },
        // Drop the custom timeouts so it relies on standard secure connection handshakes
    });

    const frontendUrl = process.env.NODE_ENV === "production" 
        ? "https://ekart-smoky.vercel.app" 
        : "http://localhost:5173";

    const mailConfigurations = {
        from: process.env.USER_MAIL,
        to: email,
        subject: 'Email Verification',
        text: `Hi! There, You have recently visited our website and entered your email.
Please follow the given link to verify your email:
${frontendUrl}/verify/${token} 

Thanks`
    };

    transporter.sendMail(mailConfigurations, function(error, info) {
        if (error) {
            console.error('Email sending failed:', error.message);
            return;
        }
        console.log('Email Sent Successfully');
        console.log(info.messageId);
    });
}