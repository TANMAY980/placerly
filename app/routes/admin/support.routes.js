const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const supportcontroller=require('../../modules/support/controller/support.queries.controller');
const namedRouter=routelabel(router);


namedRouter.get("admin.queries.access","/admin/queries/list",supportcontroller.list);
namedRouter.post("admin.support.getall","/admin/support/getall",supportcontroller.getall);
namedRouter.post("admin.support.details","/admin/support/details/:id",supportcontroller.getSupportDetailsById);
namedRouter.put("admin.support.changestatus","/admin/support/changestatus/:id",supportcontroller.changestatus);
namedRouter.put("admin.support.chnagepriority","/admin/support/changepriority/:id",supportcontroller.priorityChange);
namedRouter.put("admin.support.changeprogress","/admin/support/changeprogress/:id",supportcontroller.progressChange);


module.exports=router;
