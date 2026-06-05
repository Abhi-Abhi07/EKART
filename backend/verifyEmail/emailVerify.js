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


import nodemailer from "nodemailer"
import "dotenv/config"

// 1. Added 'async' so the server waits for the email to finish sending
export const verifyEmail = async (token, email) => {
    
    // 2. Optimization: Keep the transporter configuration out of the function block 
    // if you send many emails, or keep it inside if it's low traffic.
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_MAIL,
            pass: process.env.USER_PASS, // This MUST be a 16-character Google App Password
        }
    });

    const mailConfigurations = {
        from: process.env.USER_MAIL,
        to: email,
        subject: 'Email Verification',
        // 3. Cleaned up template literal spacing so the email text doesn't look misaligned in the inbox
        text: `Hi! There,\n\nYou have recently visited our website and entered your email. Please follow the given link to verify your email:\n\n${process.env.CLIENT_URL}/verify/${token}\n\nThanks!`
    };

    // 4. Wrap in a try/catch block using the modern async/await syntax
    try {
        const info = await transporter.sendMail(mailConfigurations);
        console.log('✅ Email Sent Successfully');
        return { success: true, info };
    } catch (error) {
        console.error('❌ Failed to send verification email:', error.message);
        return { success: false, error: error.message };
    }
}