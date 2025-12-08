const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const supportcontroller=require('../../modules/support/controller/support.queries.controller');
const auth=require("../../middleware/auth");
const namedRouter=routelabel(router);


namedRouter.get("admin.queries.access","/admin/queries/list",auth.jwtauth, auth.isAdmin,supportcontroller.list);
namedRouter.post("admin.support.getall","/admin/support/getall",auth.jwtauth, auth.isAdmin,supportcontroller.getall);
namedRouter.get("admin.support.details","/admin/support/details/:id",auth.jwtauth, auth.isAdmin,supportcontroller.getSupportDetailsById);
namedRouter.put("admin.support.changestatus","/admin/support/changestatus/:id",auth.jwtauth, auth.isAdmin,supportcontroller.changestatus);
namedRouter.put("admin.support.changeprogress","/admin/support/changeprogress/:id",auth.jwtauth,auth.isAdmin,supportcontroller.progressChange);
namedRouter.put("admin.support.chnagepriority","/admin/support/changepriority/:id",auth.jwtauth,auth.isAdmin,supportcontroller.priorityChange);



module.exports=router;
