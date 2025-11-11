const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const supportcontroller=require('../../modules/support/controller/support.queries.controller');
const namedRouter=routelabel(router);


module.exports=router;
