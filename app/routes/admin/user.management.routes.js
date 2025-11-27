const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const usermanagecontroller=require('../../modules/usermanagement/controller/user.management.controller');
const auth=require("../../middleware/auth");
const namedRouter=routelabel(router);

namedRouter.post("admin.user.getAll","/admin/getall",auth.jwtauth, auth.isAdmin,usermanagecontroller.getAll);
namedRouter.get("admin.user.access","/admin/user/list",auth.jwtauth, auth.isAdmin,usermanagecontroller.list);
namedRouter.get("admin.user.details","/admin/userdetails/:id",auth.jwtauth, auth.isAdmin,usermanagecontroller.getUserdetailsbyId);
namedRouter.get("admin.user.jsondetails","/admin/jsondetails/:id",auth.jwtauth, auth.isAdmin,usermanagecontroller.getUserJsonDetails);
namedRouter.put("admin.user.statuschange","/admin/changestatus/:id",auth.jwtauth, auth.isAdmin,usermanagecontroller.userStatusChange);
namedRouter.put("admin.user.updatesubscribe","/admin/updatesubscription/:id",auth.jwtauth, auth.isAdmin,usermanagecontroller.changeSubscribeStatus);
namedRouter.put("admin.user.updateuser","/admin/updateuser/:id",auth.jwtauth, auth.isAdmin,usermanagecontroller.updateuser)
namedRouter.delete("Admin.user.delete","/admin/delete/:id",auth.jwtauth, auth.isAdmin,usermanagecontroller.deleteUserById)



module.exports=router;
