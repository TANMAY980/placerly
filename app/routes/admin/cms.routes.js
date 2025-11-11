const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const cmscontroller=require('../../modules/cms/controller/cms.controller');
const namedRouter=routelabel(router);



module.exports=router;
