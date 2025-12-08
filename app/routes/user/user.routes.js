const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const userController = require('../../modules/user/controller/user.controller');
const upload=require('../../helper/cloudinary.fileupload');
const auth=require('../../middleware/auth');
const namedRouter=routelabel(router)

namedRouter.get("user.home","/",auth.attachUser,userController.user_home_page);
namedRouter.get('user.dashboard',"/dashboard",auth.jwtauth,auth.isUser,userController.dashboard);
namedRouter.get("user.registraion.page","/registration",userController.registraionPage);
namedRouter.get("user.login.page","/login",userController.user_login_page);
namedRouter.get("error.page","/error",userController.error_page);
namedRouter.post("user.login","/user/login",userController.login);
namedRouter.get("user.support.page","/user/support",auth.jwtauth,auth.isUser,userController.supportPage);
namedRouter.post("user.support","/user/supportquery",auth.jwtauth,userController.addSupport);
namedRouter.get("user.updatepassword.page","/user/update/password",auth.jwtauth,auth.isUser,userController.updatepasswordPage);
namedRouter.post("user.update.password","/update/userpassword",auth.jwtauth,auth.isUser,userController.updatePassword);
namedRouter.get("user.details","/getdetails",auth.jwtauth,auth.isUser,userController.getDetailsPage);
namedRouter.post("upload.image","/upload/image",auth.jwtauth,auth.isUser,upload.uploadSingleUserfile('image'),userController.uploadImage);
namedRouter.post("user.profileimage.delete","/profileimg/delete",auth.jwtauth,auth.isUser,userController.deleteImage);
namedRouter.get('user.forgotpassword.page',"/forgotpassword",userController.forgotPassowrdPage);
namedRouter.post('user.forgotpassword',"/forgot/password",userController.forgotPassword);
namedRouter.get('user.reset.password',"/resetpassword/:id/:token",userController.resetPasswordPage);
namedRouter.post('user.resetpassword',"/resetpassword/:id/:token",userController.resetPassword)
namedRouter.post("user.logout","/user.logout",userController.logout);

module.exports=router
