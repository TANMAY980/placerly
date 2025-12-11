const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const auth=require('../../middleware/auth');
const paymentController=require('../../modules/payment/controller/payment.controller');
const namedRouter=routelabel(router);

namedRouter.post("create.order","/create/order",auth.jwtauth,paymentController.checkout);
namedRouter.post("verify.payment","/verify-payment",auth.jwtauth,paymentController.paymentVerification);
module.exports=router