const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const subscriptioncontroller=require('../../modules/subscription/controller/subscription.controller');
const namedRouter=routelabel(router);

namedRouter.get("admin.subscription.access","/admin/subscription/list",subscriptioncontroller.list);
namedRouter.post("admin.subscription.getall","/admin/subscription/getall",subscriptioncontroller.getall);
namedRouter.post("admin.suscription.create","/admin/subscription/create",subscriptioncontroller.createSubsPlan);
namedRouter.get("admin.subscription.getdetails","/admin/subscription/details/:id",subscriptioncontroller.getSubsbdetailsById);
namedRouter.put("admin.subscription.update","/admin/subscription/update/:id",subscriptioncontroller.updateSubsById);
namedRouter.put("admin.subscription.changestatus","/admin/subscription/changestatus/:id",subscriptioncontroller.changeSubstatus);
namedRouter.get("admin.subscription.details","/admin/subscription/getdetails/:id",subscriptioncontroller.getSubscriptionDetailsById);
namedRouter.delete("admin.subscription.delete","/admin/subscription/delete/:id",subscriptioncontroller.deleteSubsPlan)

module.exports=router;
