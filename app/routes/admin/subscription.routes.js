const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const subscriptioncontroller=require('../../modules/subscription/controller/subscription.controller');
const namedRouter=routelabel(router);


module.exports=router;
