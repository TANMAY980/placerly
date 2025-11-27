const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const faqcontroller=require('../../modules/faq/controller/faq.controller');
const auth=require("../../middleware/auth");
const namedRouter=routelabel(router);


namedRouter.post("admin.faq.getall","/admin/faq/getall",auth.jwtauth, auth.isAdmin,faqcontroller.getall);
namedRouter.get("admin.faq.access","/admin/faq/list",auth.jwtauth, auth.isAdmin,faqcontroller.list);
namedRouter.get("admin.faq.faq.details","/admin/faq/details/:id",auth.jwtauth, auth.isAdmin,faqcontroller.getDetailsbyId);
namedRouter.post("admin.faq.create","/admin/faq/create",auth.jwtauth, auth.isAdmin,faqcontroller.createFaq);
namedRouter.put("admin.faq.update","/admin/faq/update/:id",auth.jwtauth, auth.isAdmin,faqcontroller.updateFaqdetails);
namedRouter.put("admin.faq.changestatus","/admin/faq/changestatus/:id",auth.jwtauth, auth.isAdmin,faqcontroller.changeFaqstatus);
namedRouter.get("admin.faq.jsondata","/admin/faq/jsondata/:id",auth.jwtauth, auth.isAdmin,faqcontroller.getJsonDetails);
namedRouter.delete("admin.faq.delete","/admin/faq/delete/:id",auth.jwtauth, auth.isAdmin,faqcontroller.faqDeletedbyId);





module.exports=router;
