const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const subscriptioncontroller=require('../../modules/subscription/controller/subscription.controller');
const auth=require("../../middleware/auth");
const namedRouter=routelabel(router);

namedRouter.get("admin.subscription.access","/admin/subscription/list",auth.jwtauth, auth.isAdmin,subscriptioncontroller.list);
namedRouter.post("admin.subscription.getall","/admin/subscription/getall",auth.jwtauth, auth.isAdmin,subscriptioncontroller.getall);
namedRouter.post("admin.suscription.create","/admin/subscription/create",auth.jwtauth, auth.isAdmin,subscriptioncontroller.createSubsPlan);
namedRouter.get("admin.subscription.getdetails","/admin/subscription/details/:id",auth.jwtauth, auth.isAdmin,subscriptioncontroller.getSubsbdetailsById);
namedRouter.put("admin.subscription.update","/admin/subscription/update/:id",auth.jwtauth, auth.isAdmin,subscriptioncontroller.updateSubsById);
namedRouter.put("admin.subscription.changestatus","/admin/subscription/changestatus/:id",auth.jwtauth, auth.isAdmin,subscriptioncontroller.changeSubstatus);
namedRouter.get("admin.subscription.details","/admin/subscription/getdetails/:id",auth.jwtauth, auth.isAdmin,subscriptioncontroller.getSubscriptionDetailsById);
namedRouter.delete("admin.subscription.delete","/admin/subscription/delete/:id",auth.jwtauth, auth.isAdmin,subscriptioncontroller.deleteSubsPlan)

module.exports=router;
