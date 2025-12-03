const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const userController = require('../../modules/user/controller/user.controller');
const auth=require('../../middleware/auth');
const namedRouter=routelabel(router)

namedRouter.get("user.home","/",auth.jwtauth,userController.user_home_page);
namedRouter.get('user.dashboard',"/dashboard",auth.jwtauth,auth.isUser,userController.dashboard);
namedRouter.get("user.registraion.page","/registration",userController.registraionPage);
namedRouter.get("user.login.page","/login",userController.user_login_page);
namedRouter.get("error.page","/error",userController.error_page);
namedRouter.post("user.login","/user/login",userController.login);
namedRouter.post("user.updatepassword.page","/user/update/password",auth.jwtauth,auth.isUser,userController.updatepasswordPage);
namedRouter.get('user.forgotpassword.page',"/forgotpassword",userController.forgotPassowrdPage);
namedRouter.post('user.forgotpassword',"/forgot/password",userController.forgotPassword);
namedRouter.get('user.reset.password',"/resetpassword/:id/:token",userController.resetPasswordPage);
namedRouter.post('user.resetpassword',"/resetpassword/:id/:token",userController.resetPassword)
namedRouter.post("user.logout","/user.logout",userController.logout);

module.exports=router
