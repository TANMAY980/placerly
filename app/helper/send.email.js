const mailtransporter=require('../config/email.config');
const otpmodel=require('../modules/user/model/otp.model');

class Email{
    async SendRegistraionEmail(req,res,user){
        try {
            const sendmail=await mailtransporter.sendMail({
                from:process.env.EMAIL_FROM,
                to:user.email,
                subject:"user Registraion",
                html:`<p> Dear ${user.firstName},welcome to Placerly</p>
                <p> your registraion successfull`
                
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        }
    };

    async SendUpdateProfile(saveuser){
        try {
            const sendmail=await mailtransporter.sendMail({
                from:process.env.EMAIL_FROM,
                to:saveuser.email,
                subject:"user Inactive",
                html:`<p> Dear ${saveuser.firstName},welcome to Placerly</p>
                <p> your Profile details has been updated succesfully </P>`
                
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        }
    };

    async SendInactiveEmail(req,res,user){
        try {
            const sendmail=await mailtransporter.sendMail({
                from:process.env.EMAIL_FROM,
                to:user.email,
                subject:"user Inactive",
                html:`<p> Dear ${user.firstName},welcome to Placerly</p>
                <p> your account is inactive please login after verify your email </P>`
                
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        }
    };

    async Sendotp(user){
        try {
            if (!user || !user._id) {
                throw new Error("Sendotp called without valid user");
            }
            const otp=Math.floor(100000 + Math.random()*900000);
            const existOtp=await otpmodel.findOne({userId:user._id});
            if(existOtp){
                existOtp.otp=otp;
                existOtp.createdAt=new Date();
                await existOtp.save();
            }else{
                await otpmodel({userId:user._id,otp:otp}).save();
            }
                      
            await mailtransporter.sendMail({
                from:process.env.EMAIL_FROM,
                to:user.email,
                subject:"OTP - verify your account",
                html:`<p> Dear ${user.firstName},</p><p>Thank you for signing up with our website. To complete your registration, please verify your email address by entering the following one-time password (OTP)</p>
                <h2>OTP: ${otp}</h2>
                <p>Please verify email <a href="https://placerly-u00j.onrender.com/user/verify">verify email</a></p>
                <p>This OTP is valid for 5 minutes. If you didn't request this OTP, please ignore this email.</p>`
            });
             return true
        } catch (error) {
            console.log(error);
        }
    };

    async updatePassword(req,res){
        try {
            await mailtransporter.sendMail({
              from: `"Placerly -" <${process.env.SENDER_EMAIL}>`,
              subject: "Your password has been successfully updated",
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
                <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Password Update Notification</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Hello ${user.firstName} ${
                user.lastName
                },<br/><br/>
                We wanted to let you know that your password has been successfully updated on <strong>eShop - Where Trends Are Born</strong>.
                If you did not make this change, please contact our support team immediately to secure your account.
                </p>
                <p style="color: #555; font-size: 16px; line-height: 1.6;">
                If you did update your password, no further action is needed. You can now log in to your account with your new password.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                <a href="${req.protocol}://${req.get("host")}/admin/login" 
                    style="background-color: #3498db; color: #ffffff; padding: 14px 28px; text-decoration: none; font-size: 16px; border-radius: 6px;">
                    Log in to Your Account
                </a>
                </div>
                <p style="color: #555; font-size: 14px; line-height: 1.6;">
                If you did not request this change, please contact our support team immediately or reset your password by clicking the link below:
                </p>
                <div style="text-align: center; margin: 20px 0;">
                <a href="${req.protocol}://${req.get(
                    "host"
                )}/admin/reset-password" 
                    style="background-color: #e74c3c; color: #ffffff; padding: 14px 28px; text-decoration: none; font-size: 16px; border-radius: 6px;">
                    Reset Password
                </a>
                </div>
                <p style="color: #555; font-size: 14px; line-height: 1.6;">
                If the button above doesn’t work, you can copy and paste the following URL into your web browser:
                </p>
                <p style="word-wrap: break-word; color: #555; background-color: #f5f5f5; padding: 10px; border-radius: 6px; font-size: 14px;">
                <a href="${req.protocol}://${req.get(
                    "host"
                )}/admin/reset-password" style="color: #3498db; text-decoration: none;">
                ${req.protocol}://${req.get("host")}/admin/reset-password
                </a>
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Thank you,<br/>
                The <strong>eShop - Where Trends Are Born</strong> Team
                </p>
                <hr style="border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">
                This is system genrated email, please do not reply to this email.
                </p>
            </div>
            `,
            });
        } catch (error) {
            console.log(error);
            
        }
    };

    async resetpassword(checkuser,resetlink){
        try {
            const sendmail=await mailtransporter.sendMail({
              from: process.env.EMAIL_FROM,
              to: checkuser.email,
              subject: "Password Reset Link",
              html: `<p>Hello ${checkuser.firstName},</p>
              <p>Please <a href="${resetlink}">Click here</a> to reset your password.</p>
              <p>Or copy and open this link:<br><a href="${resetlink}">${resetlink}</a></p>
              `
            });
            if(sendmail){
                return true
            };
            return false
        } catch (error) {
            console.log(error);
            
        }
    };

    async supportemail(user){
        try {
            const sendmail=await mailtransporter.sendMail({
                from:process.env.EMAIL_FROM,
                to:user.email,
                subject:"Support",
                html:`<p> Dear ${user.firstName},welcome to Placerly support</p>
                <p> we have recieved your query,we're looking into it we will notify your support status </P>`
                
            })
        } catch (error) {
            console.log(error);
            
        }

    }
}
module.exports=new Email()