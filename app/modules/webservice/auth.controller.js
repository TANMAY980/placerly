const authentication=require('../../middleware/auth')
const userRepository=require('../user/repository/user.repostiroy')
const userInfoValid=require('../../helper/db.validation')
const sendmail=require('../../helper/send.email')
const sendSms = require('../../helper/send.sms')
const jwt=require('jsonwebtoken')
const otpmodel = require('../user/model/otp.model')
const mongoose=require('mongoose')

class Auth{

    async user_registration(req,res){
        try {
            const { error, value } = await userInfoValid.register_data(req.body);
            if(error){
                return res.status(400).json({status:false,message:error.message})
            }
            const{firstName,lastName,email,contactNumber,desiredPassword,confirmPassword}=value;
            if(desiredPassword.trim() !== confirmPassword.trim()){
                return res.status(400).json({status:false,message:"Your desired password and confirm password didn't matched"})
            };
            const checkuser=await userRepository.getByField({email});
            if(checkuser){
                return res.status(409).json({status:false,message:"user with this email id already exists"})
            };
            const formattedNumber = contactNumber.startsWith('+91') ? contactNumber : `+91${contactNumber}`;

            const userdata={
                firstName:firstName.trim(),
                lastName:lastName.trim(),
                email:email.trim(),
                contactNumber:formattedNumber.trim(),
                terms_conditon:true,
                password:await authentication.encrypt_password(confirmPassword)
            }
            const save_data=await userRepository.save(userdata)
            const sendemail=await sendmail.SendRegistraionEmail(req,res,userdata)
            const otp=await sendmail.Sendotp(req,res,save_data)
            
            // const sendsms = await sendSms.sendRegisterSms(req,res,userdata)
            if(save_data){
                return res.status(201).json({status:true,message:"user registraion successfully",data:save_data})
            }
            return res.status(400).json({status:false,message:"Failed to register user"})

        } catch (error) {
            return res.status(500).json({status:false,message:error.message})
            
        }
    }

    async user_login(req,res){
        try {
            const {error,value}=await userInfoValid.login(req.body);
            if(error){
                return res.status(400).json({status:false,message:error.message})
            }
            const{email,password}=value
            const checkuser=await userRepository.getByField({email});
            if(!checkuser) return res.status(400).json({status:false,message:"user need to registraion first"});
            
            const checkpassword=await authentication.check_password(password,checkuser.password);
            if(!checkpassword){
                return res.status(400).json({status:false,message:"password didn't matched please try again"})
            }

            if(!checkuser.is_verified){
                const otp=await sendmail.Sendotp(req,res,checkuser)
                if(!otp){
                    return res.status(400).json({status:false,message:"Failed to generate otp for verify email please try again"})
                }
                return res.status(200).json({status:true,message:"successfully send otp in your registered email please verify your email and login again"})
            }
            let accessToken, refreshToken;
            if(checkuser.role==="user"){
                accessToken=jwt.sign({
                    id:checkuser._id,
                    role:checkuser.role,
                    email:checkuser.email
                },process.env.JWT_USER_SECRET_TOKEN,{expiresIn:'7m'})

                refreshToken=jwt.sign({
                    id:checkuser._id,
                    role:checkuser.role,
                    email:checkuser.email
                },process.env.JWT_USER_REFRESH_TOKEN,{expiresIn:"5d"})
            }else{
                accessToken=jwt.sign({
                    id:checkuser._id,
                    role:checkuser.role,
                    email:checkuser.email
                },process.env.JWT_ADMIN_SECRET_TOKEN,{expiresIn:'7m'})

                refreshToken=jwt.sign({
                    id:checkuser._id,
                    role:checkuser.role,
                    email:checkuser.email
                },process.env.JWT_ADMIN_REFRESH_TOKEN,{expiresIn:"5d"}) 
            }
            const message=checkuser.role==="user"?"User login successful":"Admin login successful";
            return res.status(200).json({
                status:true,
                message:message,
                accessToken,
                refreshToken,
                user:{
                    id: checkuser._id,
                    email: checkuser.email,
                    role:checkuser.role
                }
            })
            

        } catch (error) {
            console.log(error);
            return res.status(500).json({status:false,message:error.message})
            
        }
    }

    async verify_email(req,res){
        try {
            const{error,value}=await userInfoValid.verify_email_data(req.body)
            if(error){
                return res.status(400).json({status:false,message:error.message})
            }
            const{email,otp}=value;
            const check_user=await userRepository.getByField({email})
            if(!check_user){
                return res.status(400).json({status:false,message:"User not found"})
            };
            if(check_user.is_verified) return res.status(400).json({status:false,message:"Your email is already verified"});

            const find_otp=await otpmodel.findOne({userId:check_user._id})
            if(!find_otp){
                return res.status(400).json({status:false,message:"OTP expires or not found"})
            }
            if(find_otp.otp !== otp){
                return res.status(400).json({status:false,message:"Invalid OTP"})
            }
            const currentTime=new Date();
            const expirationTime=new Date(find_otp.createdAt.getTime() + 5 * 60 * 1000);
            if(currentTime>expirationTime){
                await sendmail.Sendotp(req,res,check_user)
            }
            check_user.is_verified=true;
            await check_user.save();
            await otpmodel.deleteMany({userId:check_user._id})
            return res.status(200).json({starus:true,message:"Email verified successfully! you can now log in"})
        } catch (error) {
            console.log(error);
            return res.status(500).json({status:false,message:error.message})
        }
    }
    async update_password(req,res){
        try {
            const{error,value}=await userInfoValid.update_password_data(req.body)
        if(error){
            return res.status(400).json({status:false,message:"Check your password enter again"})
        }
        const{password}=value;
        const id=req.params.id;
        const hashedPassword=await authentication.encrypt_password(password)
        if(!hashedPassword)return res.status(400).json({status:false,message:"Something went wrong please try again"});

        const updatePassword=await userRepository.updateById(
            id,
            {password:hashedPassword},
        );
        if(!updatePassword) return res.status(400).json({status:false,message:"Failed to update password try again"});
        return res.status(200).json({status:true,message:"Updated password successfully "})

        } catch (error) {
            console.log(error);
            
            return res.status(500).json({status:false,message:error.message})
        }
    }
}
module.exports=new Auth()