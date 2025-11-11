const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const usermanagecontroller=require('../../modules/usermanagement/controller/user.management.controller');
const namedRouter=routelabel(router);

namedRouter.post("admin.user.getAll","/admin/getall",usermanagecontroller.getAll);
namedRouter.get("admin.user.access","/admin/user/list",usermanagecontroller.list);
namedRouter.get("admin.user.details","/admin/userdetails/:id",usermanagecontroller.getUserdetailsbyId);
namedRouter.get("admin.user.jsondetails","/admin/jsondetails/:id",usermanagecontroller.getUserJsonDetails);
namedRouter.put("admin.user.statuschange","/admin/changestatus/:id",usermanagecontroller.userStatusChange);
namedRouter.put("admin.user.updatesubscribe","/admin/updatesubscription/:id",usermanagecontroller.changeSubscribeStatus);
namedRouter.put("admin.user.updateuser","/admin/updateuser/:id",usermanagecontroller.updateuser)
namedRouter.delete("Admin.user.delete","/admin/delete/:id",usermanagecontroller.deleteUserById)



module.exports=router;
