const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const adminController = require('../../modules/admin/controller/admin.controller');
const auth=require("../../middleware/auth");
const namedRouter=routelabel(router);


namedRouter.get("admin.dashboard.access","/admin/dashboard",adminController.dashboard);


module.exports=router;