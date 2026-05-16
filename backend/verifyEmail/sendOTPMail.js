import nodemailer from "nodemailer"
import "dotenv/config"

export const sendOTPMail = async (otp,email)=>{
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth :{
            user : process.env.USER_MAIL,
            pass : process.env.USER_PASS,
        }
    });

    const mailConfigurations = {

        from: process.env.USER_MAIL,
        to: email,

        subject: 'Password Reset OTP',
        
        // This would be the text of email body
        html:`<p>Your OTP for password reset is: <b>${otp}</b></p>`
    };

    transporter.sendMail(mailConfigurations, function(error, info){
        if (error) throw Error(error);
        console.log('OTP Sent Successfully');
        console.log(info);
    });
}