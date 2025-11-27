const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const blogcontroller=require('../../modules/blog/controller/blog.controller');
const imageUpload=require('../../helper/cloudinary.fileupload');
const auth=require('../../middleware/auth');
const namedRouter=routelabel(router);




namedRouter.get("admin.blog.access","/admin/blog/list",auth.jwtauth, auth.isAdmin,blogcontroller.list);
namedRouter.post("admin.blog.add","/admin/blog/create",auth.jwtauth, auth.isAdmin,imageUpload.uploadAdminfile('coverImage'),blogcontroller.BlogCreate);
namedRouter.post("admin.blog.getall","/admin/blog/getall",auth.jwtauth, auth.isAdmin,blogcontroller.getall);
namedRouter.get("admin.blog.details","/admin/blogdetails/:id",auth.jwtauth, auth.isAdmin,blogcontroller.getBlogdetailsbyId);
namedRouter.put("admin.blog.statuschange","/admin/blog/statuschange/:id",auth.jwtauth, auth.isAdmin,blogcontroller.blogStatusChange);
namedRouter.get("admin.blog.jsondetails","/admin/blog/jsondetails/:id",auth.jwtauth, auth.isAdmin,blogcontroller.getBlogJsonDetails);
namedRouter.post("admin.blog.update","/admin/blog/update/:id",auth.jwtauth, auth.isAdmin,imageUpload.uploadAdminfile("coverImage"),blogcontroller.updateBlog);
namedRouter.delete("admin.blog.delete","/admin/blog/delete/:id",auth.jwtauth, auth.isAdmin,blogcontroller.BlogDeleteById);

module.exports=router;
