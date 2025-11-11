const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const faqcontroller=require('../../modules/faq/controller/faq.controller');
const namedRouter=routelabel(router);


module.exports=router;
