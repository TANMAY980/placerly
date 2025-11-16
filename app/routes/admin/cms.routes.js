const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const imageUpload=require('../../helper/cloudinary.fileupload');
const cmscontroller=require('../../modules/cms/controller/cms.controller');
const namedRouter=routelabel(router);

namedRouter.get("admin.cms.access","/admin/cms/list",cmscontroller.list);
namedRouter.post("admin.cms.getall","/admin/cms/getall",cmscontroller.getall);
namedRouter.post("admin.cms.create","/admin/cms/create",imageUpload.uploadAdminfile('bannerImage'),cmscontroller.cmsCreate);
namedRouter.put("admin.cms.changestatus","/admin/cms/changestatus/:id",cmscontroller.cmsStatusChange);
namedRouter.get("admin.cms.getdetails","/admin/cms/getdetails/:id",cmscontroller.getcmsDetailsById);
namedRouter.post("admin.cms.update","/admin/cms/update/:id",imageUpload.uploadAdminfile('bannerImage'),cmscontroller.updateCmsDetailsById);
namedRouter.get("admin.cms.details","/admin/cms/details/:id",cmscontroller.getcmsDetailsPageById);
namedRouter.post("adadmin.cms.delete","/admin/cms/delete/:id",cmscontroller.deletecms);

module.exports=router;
