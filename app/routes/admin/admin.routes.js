const express=require('express')
const router=express.Router()
const routelabel=require('route-label')
const adminController = require('../../modules/admin/controller/admin.controller')
const namedRouter=routelabel(router)

namedRouter.get("admin.dashboard","/dashboard",adminController.admin_dashboard)

module.exports=router