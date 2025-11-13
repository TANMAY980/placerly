const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const faqcontroller=require('../../modules/faq/controller/faq.controller');
const namedRouter=routelabel(router);


namedRouter.post("admin.faq.getall","/admin/faq/getall",faqcontroller.getall);
namedRouter.get("admin.faq.access","/admin/faq/list",faqcontroller.list);
namedRouter.get("admin.faq.faq.details","/admin/faq/details/:id",faqcontroller.getDetailsbyId);
namedRouter.post("admin.faq.create","/admin/faq/create",faqcontroller.createFaq);
namedRouter.put("admin.faq.update","/admin/faq/update/:id",faqcontroller.updateFaqdetails);
namedRouter.put("admin.faq.changestatus","/admin/faq/changestatus/:id",faqcontroller.changeFaqstatus);
namedRouter.get("admin.faq.jsondata","/admin/faq/jsondata/:id",faqcontroller.getJsonDetails);
namedRouter.delete("admin.faq.delete","/admin/faq/delete/:id",faqcontroller.faqDeletedbyId);





module.exports=router;
