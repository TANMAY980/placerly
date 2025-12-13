const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const userController = require('../../modules/user/controller/user.controller');
const assetController=require('../../modules/assets/controller/assets.controller');
const debtController=require('../../modules/debts/controller/debts.controller');
const insuranceController=require('../../modules/insurance/controller/insurance.controller');
const utilityController=require('../../modules/utility/controller/utility.controller');
const transitionController=require('../../modules/transition/controller/transition.controller');
const appointmentRepository=require('../../modules/appointment/controller/appointment.controller');
const upload=require('../../helper/cloudinary.fileupload');
const auth=require('../../middleware/auth');
const namedRouter=routelabel(router)

namedRouter.get("user.home","/",auth.attachUser,userController.user_home_page);
namedRouter.get("user.subscription.page","/user/subscription",auth.attachUser,userController.subscriptionPage);
namedRouter.post("user.appointment.book","/user/appointment",auth.jwtauth,auth.isUser,appointmentRepository.assignAppointment);
namedRouter.get('user.dashboard',"/dashboard",auth.jwtauth,auth.isUser,userController.dashboard);
namedRouter.get('user.asset.details',"/asset/details",auth.jwtauth,auth.isUser,userController.assetDetailsPage);
namedRouter.post("user.asset.add","/asset/add",auth.jwtauth, auth.isUser,assetController.createAsset);
namedRouter.get('user.debt.details',"/debt/details",auth.jwtauth,auth.isUser,userController.debtDetailsPage);
namedRouter.post("user.debt.add","/debt/add",auth.jwtauth,auth.isUser,debtController.addDebtAcoount);
namedRouter.get('user.insurance.details',"/insurance/details",auth.jwtauth,auth.isUser,userController.insuranceDetailsPage);
namedRouter.post("user.insurance.add","/insurance/add",auth.jwtauth,auth.jwtauth,insuranceController.addInsuranceAcoount);
namedRouter.get('user.utility.details',"/utility/details",auth.jwtauth,auth.isUser,userController.utilitiesDetailsPage);
namedRouter.post("user.utility.add","/utility/add",auth.jwtauth,auth.isUser,utilityController.addUtilityAcoount);
namedRouter.get('user.transition.details',"/transition/details",auth.jwtauth,auth.isUser,userController.transitionDetailsPage);
namedRouter.post("user.add.executor","/transition/executor/add",auth.jwtauth,auth.isUser,transitionController.addExecutorDetails);
namedRouter.post("user.add.beneficiary","/transition/beneficiary/add",auth.jwtauth,auth.isUser,transitionController.addBeneficirayDetails);
namedRouter.get("user.registraion.page","/registration",userController.registraionPage);
namedRouter.post("user.register","/register",userController.register)
namedRouter.get("user.login.page","/login",userController.user_login_page);
namedRouter.get("error.page","/error",userController.error_page);
namedRouter.post("user.login","/user/login",userController.login);
namedRouter.get("user.verify","/user/verify",userController.verifyemailPage);
namedRouter.post("user.verify.email","/verify",userController.verify);
namedRouter.post("user.resend.otp","/resend/otp",userController.resendOtp);
namedRouter.get("user.blog.page","/blogpage",auth.attachUser,userController.userblogpage);
namedRouter.get("user.faq.page","/user/faqpage",auth.attachUser,userController.faqPage);
namedRouter.get("user.about.page","/user/aboutpage",auth.attachUser,userController.aboutPage);
namedRouter.get("user.support.page","/user/support",auth.jwtauth,auth.isUser,userController.supportPage);
namedRouter.post("user.support","/user/supportquery",auth.jwtauth,userController.addSupport);
namedRouter.get("user.updatepassword.page","/user/update/password",auth.jwtauth,auth.isUser,userController.updatepasswordPage);
namedRouter.post("user.update.password","/update/userpassword",auth.jwtauth,auth.isUser,userController.updatePassword);
namedRouter.get("user.details","/getdetails",auth.jwtauth,auth.isUser,userController.getDetailsPage);
namedRouter.post("user.update.profiledetails","/update/profiledetails",auth.jwtauth,auth.isUser,upload.uploadSingleUserfile('image'),userController.updateProfile);
namedRouter.post("upload.image","/upload/image",auth.jwtauth,auth.isUser,upload.uploadSingleUserfile('image'),userController.uploadImage);
namedRouter.post("user.profileimage.delete","/profileimg/delete",auth.jwtauth,auth.isUser,userController.deleteImage);
namedRouter.get('user.forgotpassword.page',"/forgotpassword",userController.forgotPassowrdPage);
namedRouter.post('user.forgotpassword',"/forgot/password",userController.forgotPassword);
namedRouter.get('user.reset.password',"/resetpassword/:id/:token",userController.resetPasswordPage);
namedRouter.post('user.resetpassword',"/resetpassword/:id/:token",userController.resetPassword)
namedRouter.post("user.logout","/user.logout",userController.logout);

module.exports=router
