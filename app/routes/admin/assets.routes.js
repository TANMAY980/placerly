const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const auth=require("../../middleware/auth");
const assetController=require('../../modules/assets/controller/assets.controller')
const namedRouter=routelabel(router);


namedRouter.get("admin.asset.access","/admin/asset/list",auth.jwtauth, auth.isAdmin,assetController.list);
namedRouter.post("admin.asset.getall","/admin/asset/getall",auth.jwtauth, auth.isAdmin,assetController.getall);
namedRouter.post("admin.asset.create","/admin/asset/create",auth.jwtauth, auth.isAdmin,assetController.createAsset);
namedRouter.get("admin.asset.getdetails","/admin/asset/details/:id",auth.jwtauth, auth.isAdmin,assetController.getAssetdetailsById);
namedRouter.put("admin.asset.update","/admin/asset/update/:id",auth.jwtauth, auth.isAdmin,assetController.updateAssetById);
namedRouter.put("admin.asset.changestatus","/admin/asset/changestatus/:id",auth.jwtauth, auth.isAdmin,assetController.changeAssetstatus);
namedRouter.get("admin.asset.details","/admin/asset/getdetails/:id",auth.jwtauth, auth.isAdmin,assetController.getassetDetailsById);
namedRouter.delete("admin.asset.delete","/admin/asset/delete/:id",auth.jwtauth, auth.isAdmin,assetController.deleteAsset)

module.exports=router;