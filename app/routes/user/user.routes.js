const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const userController = require('../../modules/user/controller/user.controller');
const namedRouter=routelabel(router)

namedRouter.get("user.home","/",userController.user_home_page);
namedRouter.get("user.registraion.page","/registration",userController.registraionPage);
namedRouter.get("user.login.page","/login",userController.user_login_page);
namedRouter.get("error.page","/error",userController.error_page);
namedRouter.post("user.login","/user/login",userController.login)

module.exports=router
