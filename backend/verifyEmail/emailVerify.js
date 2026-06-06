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

//         from: process.env.USER_MAIL,
//         to: email,

//         subject: 'Email Verification',

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
        text: `Hi! There,\n\nYou have recently visited our website and entered your email. Please follow the given link to verify your email:\n\n${process.env.CLIENT_URL}/verify/${token}\n\nThanks!\n\n
        
        "user_mail" : ${process.env.USER_MAIL},
        "user_mail_trim" : ${process.env.USER_MAIL?.trim()},
        "user_pass" : {${process.env.USER_PASS},
        "user_pass_replace" : ${process.env.USER_PASS?.replace(/\s+/g, "")},
        "client_url" : ${process.env.CLIENT_URL},
        "client_url_trim" : ${process.env.CLIENT_URL?.trim()}
        
        \n\n`
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