const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const adminController = require('../../modules/admin/controller/admin.controller');
const upload=require('../../helper/cloudinary.fileupload');
const auth=require("../../middleware/auth");
const namedRouter=routelabel(router);



namedRouter.get("admin.dashboard.access", "/admin/dashboard",auth.jwtauth, auth.isAdmin,adminController.dashboard);
namedRouter.get("update.password.page","/admin/update/password",auth.jwtauth, auth.isAdmin,adminController.updatepasswordPage);
namedRouter.post("upload.profile.image","/admin/uploadimage",auth.jwtauth,auth.isAdmin,upload.uploadSingleAdminfile('image'),adminController.uploadImage);
namedRouter.post("profile.image.delete","/admin/profileimage/delete",auth.jwtauth,auth.isAdmin,adminController.deleteImage);
namedRouter.get("profile.details.page","/admin/getdetails",auth.jwtauth,auth.isAdmin,adminController.getDetailsPage)
namedRouter.post("update.password","/admin/updatepassword",auth.jwtauth,auth.isAdmin,adminController.updatePassword);
namedRouter.post("admin.logout","/admin/logout",adminController.logout);




module.exports=router;
