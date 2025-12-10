const express=require('express');
const router=express.Router();
const routelabel=require('route-label');
const auth=require('../../middleware/auth');
const debtController=require('../../modules/debts/controller/debts.controller');
const namedRouter=routelabel(router);


namedRouter.get("admin.debt.access","/admin/debt/list",auth.jwtauth, auth.isAdmin,debtController.list);
namedRouter.post("admin.debt.getall","/admin/debt/getall",auth.jwtauth, auth.isAdmin,debtController.getall);
namedRouter.post("admin.debt.create","/admin/debt/create",auth.jwtauth, auth.isAdmin,debtController.addDebtAcoount);
namedRouter.get("admin.debt.getdetails","/admin/debt/details/:id",auth.jwtauth, auth.isAdmin,debtController.getDebtsdetailsById);
namedRouter.put("admin.debt.update","/admin/debt/update/:id",auth.jwtauth, auth.isAdmin,debtController.updateDebtById);
namedRouter.put("admin.debt.changestatus","/admin/debt/changestatus/:id",auth.jwtauth, auth.isAdmin,debtController.changeDebtstatus);
namedRouter.get("admin.debt.details","/admin/debt/getdetails/:id",auth.jwtauth, auth.isAdmin,debtController.getdebtDetailsById);
namedRouter.delete("admin.debt.delete","/admin/debt/delete/:id",auth.jwtauth, auth.isAdmin,debtController.deleteAsset)


module.exports=router;