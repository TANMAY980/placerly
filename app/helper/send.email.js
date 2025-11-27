const mailtransporter=require('../config/email.config');
const otpmodel=require('../modules/user/model/otp.model');
const userRepostiroy = require('../modules/user/repository/user.repostiroy');

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

    async Sendotp(req,res,user){
        try {
            const otp=Math.floor(100 + Math.random()*900000);
            const existOtp=await otpmodel.findOne({userId:user._id});
            if(existOtp){
                existOtp.otp=otp;
                existOtp.createdAt=new Date()
            }else{
                await otpmodel({userId:user._id,otp:otp}).save();
            }
                      
            await mailtransporter.sendMail({
                from:process.env.EMAIL_FROM,
                to:user.email,
                subject:"OTP - verify your account",
                html:`<p> Dear ${user.firstName},</p><p>Thank you for signing up with our website. To complete your registration, please verify your email address by entering the following one-time password (OTP)</p>
                <h2>OTP: ${otp}</h2>
                <p>This OTP is valid for 5 minutes. If you didn't request this OTP, please ignore this email.</p>`
            })
            
            return otp  
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports=new Email()